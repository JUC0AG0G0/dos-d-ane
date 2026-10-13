import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../entities/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AdminUserDto, UserEmailDto } from './dto/admin-user.dto.js';
import { maskEmail } from './mask-email.js';

const userSelect = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  createdAt: true,
} as const;

const toAdminUser = ({
  email,
  ...user
}: {
  email: string;
} & Omit<AdminUserDto, 'maskedEmail'>): AdminUserDto => ({
  ...user,
  maskedEmail: maskEmail(email),
});

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<AdminUserDto[]> {
    const users = await this.prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: 'asc' },
    });
    return users.map(toAdminUser);
  }

  async revealEmail(id: string): Promise<UserEmailDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    // TODO: journal d'audit des affichages d'email (admin, compte, date)
    return user;
  }

  updateRoles(userIds: string[], role: Role): Promise<AdminUserDto[]> {
    const ids = [...new Set(userIds)];
    return this.prisma.$transaction(async (tx) => {
      const admins = await tx.$queryRaw<{ id: string }[]>`
        SELECT id FROM users WHERE role = 'admin' FOR UPDATE`;
      const count = await tx.user.count({ where: { id: { in: ids } } });
      if (count !== ids.length) {
        throw new NotFoundException('Utilisateur introuvable');
      }
      if (
        role !== Role.admin &&
        admins.every((admin) => ids.includes(admin.id))
      ) {
        throw new ConflictException(
          'Impossible de retirer le dernier administrateur',
        );
      }
      await tx.user.updateMany({
        where: { id: { in: ids } },
        data: { role },
      });
      const users = await tx.user.findMany({
        where: { id: { in: ids } },
        select: userSelect,
        orderBy: { createdAt: 'asc' },
      });
      return users.map(toAdminUser);
    });
  }
}
