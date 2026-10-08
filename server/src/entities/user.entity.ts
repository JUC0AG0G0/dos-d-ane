import type { User as UserRow } from '../generated/prisma/client.js';
import type { Role } from './role.js';
import { TimestampedEntity } from './base/base.entity.js';

export class User extends TimestampedEntity implements UserRow {
  email: string;
  displayName: string | null;
  passwordHash: string;
  role: Role;
}
