import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ExerciseType } from './advice.constants.js';
import {
  exerciseSelect,
  exerciseSummarySelect,
  toAdminExercise,
  toExerciseSummary,
} from './advice.mappers.js';
import type {
  AdminExerciseQueryDto,
  CreateExerciseDto,
  ExerciseQueryDto,
  UpdateExerciseDto,
} from './dto/advice-inputs.dto.js';
import type {
  AdminExerciseDto,
  ExerciseDto,
  ExerciseListDto,
} from './dto/advice-responses.dto.js';
import { MediaService } from './media.service.js';

const typeWhere = (type?: ExerciseType): Prisma.ExerciseWhereInput =>
  type === 'preventive'
    ? { isPreventive: true }
    : type === 'pain'
      ? { isForPain: true }
      : {};

@Injectable()
export class ExercisesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  // --- Utilisateur : contenu publié seulement -------------------------------

  async listPublished({
    type,
    zone,
  }: ExerciseQueryDto): Promise<ExerciseListDto> {
    const base: Prisma.ExerciseWhereInput = { status: 'published', zone };
    const [items, all, preventive, pain] = await Promise.all([
      this.prisma.exercise.findMany({
        where: { ...base, ...typeWhere(type) },
        select: exerciseSummarySelect,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.exercise.count({ where: base }),
      this.prisma.exercise.count({ where: { ...base, isPreventive: true } }),
      this.prisma.exercise.count({ where: { ...base, isForPain: true } }),
    ]);
    return {
      items: items.map(toExerciseSummary),
      counts: { all, preventive, pain },
    };
  }

  async getPublished(id: string): Promise<ExerciseDto> {
    const row = await this.prisma.exercise.findFirst({
      where: { id, status: 'published' },
      select: exerciseSelect,
    });
    if (!row) throw new NotFoundException('Exercice introuvable');
    const {
      status: _s,
      createdAt: _c,
      updatedAt: _u,
      ...exercise
    } = toAdminExercise(row);
    return exercise;
  }

  // --- Administration -------------------------------------------------------

  async adminList({
    search,
    zone,
    type,
    status,
  }: AdminExerciseQueryDto): Promise<AdminExerciseDto[]> {
    const rows = await this.prisma.exercise.findMany({
      where: {
        zone,
        status,
        ...typeWhere(type),
        ...(search && { title: { contains: search, mode: 'insensitive' } }),
      },
      select: exerciseSelect,
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(toAdminExercise);
  }

  async create(dto: CreateExerciseDto): Promise<AdminExerciseDto> {
    const { steps = [], mediaId, ...data } = dto;
    this.assertValid({ ...dto, steps, status: dto.status ?? 'draft' });
    if (mediaId) await this.media.assertExists(mediaId);
    const row = await this.prisma.exercise.create({
      data: {
        ...data,
        posture: data.posture ?? 'assis ou debout',
        mediaId,
        steps: { create: steps.map((text, i) => ({ position: i + 1, text })) },
      },
      select: exerciseSelect,
    });
    return toAdminExercise(row);
  }

  async update(id: string, dto: UpdateExerciseDto): Promise<AdminExerciseDto> {
    const current = await this.prisma.exercise.findUnique({
      where: { id },
      select: exerciseSelect,
    });
    if (!current) throw new NotFoundException('Exercice introuvable');
    const { steps, mediaId, ...data } = dto;
    const oldMediaId = current.media?.id ?? null;
    this.assertValid({
      isPreventive: dto.isPreventive ?? current.isPreventive,
      isForPain: dto.isForPain ?? current.isForPain,
      status: dto.status ?? current.status,
      steps: steps ?? current.steps.map((s) => s.text),
    });
    if (mediaId) await this.media.assertExists(mediaId);

    const row = await this.prisma.$transaction(async (tx) => {
      if (steps) {
        await tx.exerciseStep.deleteMany({ where: { exerciseId: id } });
      }
      // Un brouillon disparaît des exercices conseillés des zones.
      if (dto.status === 'draft') {
        await tx.painZoneExercise.deleteMany({ where: { exerciseId: id } });
      }
      return tx.exercise.update({
        where: { id },
        data: {
          ...data,
          ...(mediaId !== undefined && { mediaId }),
          ...(steps && {
            steps: {
              create: steps.map((text, i) => ({ position: i + 1, text })),
            },
          }),
        },
        select: exerciseSelect,
      });
    });
    if (mediaId !== undefined && mediaId !== oldMediaId) {
      await this.media.removeIfUnused(oldMediaId);
    }
    return toAdminExercise(row);
  }

  /** Supprime l'exercice, ses étapes, ses liens avec les zones et son média. */
  async remove(id: string): Promise<void> {
    const row = await this.prisma.exercise.findUnique({
      where: { id },
      select: { mediaId: true },
    });
    if (!row) throw new NotFoundException('Exercice introuvable');
    await this.prisma.exercise.delete({ where: { id } });
    await this.media.removeIfUnused(row.mediaId);
  }

  private assertValid(e: {
    isPreventive: boolean;
    isForPain: boolean;
    status: string;
    steps: string[];
  }) {
    if (!e.isPreventive && !e.isForPain) {
      throw new BadRequestException(
        'Choisissez au moins un type : préventif ou en cas de douleur',
      );
    }
    if (e.status === 'published' && e.steps.length === 0) {
      throw new BadRequestException(
        'Un exercice publié doit avoir au moins une étape',
      );
    }
  }
}
