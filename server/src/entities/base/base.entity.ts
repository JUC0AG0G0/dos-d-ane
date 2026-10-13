import type { Creatable } from './creatable.interface.js';
import type { Identifiable } from './identifiable.interface.js';
import type { Updatable } from './updatable.interface.js';

/**
 * Classes de base des entités. Les interfaces décrivent les contrats,
 * ces classes apportent les champs communs pour ne pas les répéter.
 */
export abstract class BaseEntity implements Identifiable {
  id: string;

  /** Construit une entité à partir d'une ligne renvoyée par Prisma. */
  static from<T extends BaseEntity>(this: new () => T, data: T): T {
    return Object.assign(new this(), data);
  }
}

/** Entité avec date de création. */
export abstract class CreatedEntity extends BaseEntity implements Creatable {
  createdAt: Date;
}

/** Entité avec dates de création et de modification. */
export abstract class TimestampedEntity
  extends CreatedEntity
  implements Updatable
{
  updatedAt: Date;
}
