import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  MAX_ZONE_EXERCISES,
  WHEN_TO_SEE_DOCTOR_KEY,
} from './advice.constants.js';
import {
  painZoneSelect,
  toAdminPainZone,
  toPainZone,
} from './advice.mappers.js';
import { assertCompleteOrder, assertSource } from './advice-validation.js';
import type {
  CreatePainZoneDto,
  UpdatePainZoneDto,
} from './dto/advice-inputs.dto.js';
import type {
  AdminPainZoneDto,
  AdminPainZonesDto,
  PainZonesDto,
} from './dto/advice-responses.dto.js';

type Tx = Prisma.TransactionClient;

@Injectable()
export class PainZonesService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublished(): Promise<PainZonesDto> {
    const [whenToSeeDoctor, rows] = await Promise.all([
      this.whenToSeeDoctor(),
      this.prisma.painZone.findMany({
        where: { status: 'published' },
        select: painZoneSelect,
        orderBy: { position: 'asc' },
      }),
    ]);
    return { whenToSeeDoctor, zones: rows.map(toPainZone) };
  }

  async adminList(): Promise<AdminPainZonesDto> {
    const [whenToSeeDoctor, rows] = await Promise.all([
      this.whenToSeeDoctor(),
      this.prisma.painZone.findMany({
        select: painZoneSelect,
        orderBy: { position: 'asc' },
      }),
    ]);
    return { whenToSeeDoctor, zones: rows.map(toAdminPainZone) };
  }

  async create(dto: CreatePainZoneDto): Promise<AdminPainZoneDto> {
    const { helps = [], avoid = [], exerciseIds = [], ...data } = dto;
    assertSource(data.sourceLabel ?? null, data.sourceUrl ?? null);
    const id = await this.prisma.$transaction(async (tx) => {
      await this.assertPublishedExercises(tx, exerciseIds);
      const last = await tx.painZone.aggregate({ _max: { position: true } });
      const zone = await tx.painZone.create({
        data: { ...data, position: (last._max.position ?? 0) + 1 },
        select: { id: true },
      });
      await this.writeAdvices(tx, zone.id, helps, avoid);
      await this.writeExercises(tx, zone.id, exerciseIds);
      return zone.id;
    });
    return this.adminGet(id);
  }

  async update(id: string, dto: UpdatePainZoneDto): Promise<AdminPainZoneDto> {
    const current = await this.prisma.painZone.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Zone introuvable');
    const { helps, avoid, exerciseIds, ...data } = dto;
    assertSource(
      data.sourceLabel !== undefined ? data.sourceLabel : current.sourceLabel,
      data.sourceUrl !== undefined ? data.sourceUrl : current.sourceUrl,
    );
    await this.prisma.$transaction(async (tx) => {
      await tx.painZone.update({ where: { id }, data });
      if (helps || avoid) {
        const kept = await tx.painZoneAdvice.findMany({
          where: { painZoneId: id },
          select: { kind: true, text: true },
          orderBy: { position: 'asc' },
        });
        const texts = (kind: string) =>
          kept.filter((a) => a.kind === kind).map((a) => a.text);
        await tx.painZoneAdvice.deleteMany({ where: { painZoneId: id } });
        await this.writeAdvices(
          tx,
          id,
          helps ?? texts('helps'),
          avoid ?? texts('avoid'),
        );
      }
      if (exerciseIds) {
        await this.assertPublishedExercises(tx, exerciseIds);
        await tx.painZoneExercise.deleteMany({ where: { painZoneId: id } });
        await this.writeExercises(tx, id, exerciseIds);
      }
    });
    return this.adminGet(id);
  }

  async remove(id: string): Promise<void> {
    const { count } = await this.prisma.painZone.deleteMany({ where: { id } });
    if (!count) throw new NotFoundException('Zone introuvable');
  }

  async reorder(ids: string[]): Promise<AdminPainZonesDto> {
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.painZone.findMany({ select: { id: true } });
      assertCompleteOrder(
        ids,
        existing.map((z) => z.id),
      );
      for (const [i, id] of ids.entries()) {
        await tx.painZone.update({ where: { id }, data: { position: i + 1 } });
      }
    });
    return this.adminList();
  }

  async setWhenToSeeDoctor(text: string): Promise<{ text: string }> {
    return this.prisma.adviceSetting.upsert({
      where: { key: WHEN_TO_SEE_DOCTOR_KEY },
      create: { key: WHEN_TO_SEE_DOCTOR_KEY, text },
      update: { text },
      select: { text: true },
    });
  }

  private async whenToSeeDoctor(): Promise<string> {
    const setting = await this.prisma.adviceSetting.findUnique({
      where: { key: WHEN_TO_SEE_DOCTOR_KEY },
    });
    return setting?.text ?? '';
  }

  private async adminGet(id: string): Promise<AdminPainZoneDto> {
    const row = await this.prisma.painZone.findUniqueOrThrow({
      where: { id },
      select: painZoneSelect,
    });
    return toAdminPainZone(row);
  }

  /** Exercices conseillés : 3 au plus, existants et publiés. */
  private async assertPublishedExercises(tx: Tx, ids: string[]) {
    if (ids.length > MAX_ZONE_EXERCISES) {
      throw new BadRequestException(
        `${MAX_ZONE_EXERCISES} exercices conseillés au maximum`,
      );
    }
    const published = await tx.exercise.count({
      where: { id: { in: ids }, status: 'published' },
    });
    if (published !== ids.length) {
      throw new BadRequestException(
        'Les exercices conseillés doivent exister et être publiés',
      );
    }
  }

  private async writeAdvices(
    tx: Tx,
    painZoneId: string,
    helps: string[],
    avoid: string[],
  ) {
    await tx.painZoneAdvice.createMany({
      data: [
        ...helps.map((text, i) => ({
          painZoneId,
          kind: 'helps',
          position: i + 1,
          text,
        })),
        ...avoid.map((text, i) => ({
          painZoneId,
          kind: 'avoid',
          position: i + 1,
          text,
        })),
      ],
    });
  }

  private async writeExercises(tx: Tx, painZoneId: string, ids: string[]) {
    await tx.painZoneExercise.createMany({
      data: ids.map((exerciseId, i) => ({
        painZoneId,
        exerciseId,
        position: i + 1,
      })),
    });
  }
}
