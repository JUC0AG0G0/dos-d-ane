import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { PostureTipKey } from './advice.constants.js';
import { postureTipSelect, toAdminPostureTip } from './advice.mappers.js';
import { assertCompleteOrder, assertSource } from './advice-validation.js';
import type { UpdatePostureTipDto } from './dto/advice-inputs.dto.js';
import type {
  AdminPostureTipDto,
  PostureTipDto,
} from './dto/advice-responses.dto.js';
import { POSTURE_TIP_DEFAULTS } from './posture-tip-defaults.js';

/**
 * Les 6 réglages du poste. Ils ne sont jamais créés ni supprimés ici : seuls
 * l'ordre, les textes, la source et l'affichage changent. Le numéro du repère
 * n'est pas stocké : c'est le rang parmi les réglages visibles.
 */
@Injectable()
export class PostureTipsService {
  constructor(private readonly prisma: PrismaService) {}

  async listVisible(): Promise<PostureTipDto[]> {
    const rows = await this.prisma.postureTip.findMany({
      where: { isVisible: true },
      select: postureTipSelect,
      orderBy: { position: 'asc' },
    });
    return rows.map((row) => {
      const { isVisible: _v, updatedAt: _u, ...tip } = toAdminPostureTip(row);
      return tip;
    });
  }

  async adminList(): Promise<AdminPostureTipDto[]> {
    const rows = await this.prisma.postureTip.findMany({
      select: postureTipSelect,
      orderBy: { position: 'asc' },
    });
    return rows.map(toAdminPostureTip);
  }

  async update(
    id: string,
    dto: UpdatePostureTipDto,
  ): Promise<AdminPostureTipDto> {
    const current = await this.prisma.postureTip.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Réglage introuvable');
    assertSource(
      dto.sourceLabel !== undefined ? dto.sourceLabel : current.sourceLabel,
      dto.sourceUrl !== undefined ? dto.sourceUrl : current.sourceUrl,
    );
    const row = await this.prisma.postureTip.update({
      where: { id },
      data: dto,
      select: postureTipSelect,
    });
    return toAdminPostureTip(row);
  }

  /** Remet les textes et la source par défaut (l'ordre et l'affichage ne bougent pas). */
  async reset(id: string): Promise<AdminPostureTipDto> {
    const current = await this.prisma.postureTip.findUnique({
      where: { id },
      select: { key: true },
    });
    if (!current) throw new NotFoundException('Réglage introuvable');
    const row = await this.prisma.postureTip.update({
      where: { id },
      data: POSTURE_TIP_DEFAULTS[current.key as PostureTipKey],
      select: postureTipSelect,
    });
    return toAdminPostureTip(row);
  }

  async reorder(ids: string[]): Promise<AdminPostureTipDto[]> {
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.postureTip.findMany({ select: { id: true } });
      assertCompleteOrder(
        ids,
        existing.map((t) => t.id),
      );
      for (const [i, id] of ids.entries()) {
        await tx.postureTip.update({
          where: { id },
          data: { position: i + 1 },
        });
      }
    });
    return this.adminList();
  }
}
