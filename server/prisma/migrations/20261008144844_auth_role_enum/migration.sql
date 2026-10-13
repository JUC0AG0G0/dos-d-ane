-- Rôles : la table roles devient un enum (seulement user et admin).
-- Tout compte est user par défaut ; admin ne s'attribue qu'à la main.

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable : reprend le rôle des comptes existants avant de supprimer roles.
ALTER TABLE "users" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'user';
UPDATE "users" SET "role" = 'admin'
    FROM "roles"
    WHERE "roles"."id" = "users"."roleId" AND "roles"."name" = 'admin';

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roleId";

-- DropTable
DROP TABLE "roles";

-- AlterTable : dernière utilisation d'une session, affichée dans la liste.
ALTER TABLE "authSessions" ADD COLUMN "lastUsedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
