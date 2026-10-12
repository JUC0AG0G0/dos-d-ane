import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '../entities/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { hashPassword } from './password.js';

/**
 * En production, crée au démarrage le compte admin défini par ADMIN_EMAIL et
 * ADMIN_PASSWORD s'il n'existe pas. Un compte existant garde son mot de
 * passe ; il est seulement remis admin.
 */
@Injectable()
export class AdminAccount implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminAccount.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    if (this.config.get<string>('APP_ENV') !== 'production') return;
    const email = this.config
      .getOrThrow<string>('ADMIN_EMAIL')
      .trim()
      .toLowerCase();
    await this.prisma.user.upsert({
      where: { email },
      update: { role: Role.admin },
      create: {
        email,
        displayName: 'Admin',
        passwordHash: await hashPassword(
          this.config.getOrThrow<string>('ADMIN_PASSWORD'),
        ),
        role: Role.admin,
      },
    });
    this.logger.log(`Compte admin : ${email}`);
  }
}
