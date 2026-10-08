import type { Role as RoleRow } from '../generated/prisma/client.js';
import { BaseEntity } from './base/base.entity.js';

/** Rôle d'un compte : user, admin. */
export class Role extends BaseEntity implements RoleRow {
  name: string;
}
