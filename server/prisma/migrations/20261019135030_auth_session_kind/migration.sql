-- Sessions d'appareil : un Raspberry Pi connecté par sa clé n'a accès qu'aux
-- routes marquées @DeviceAllowed (moindre privilège), pas à tout le compte.

-- AlterTable
ALTER TABLE "authSessions" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'user';

-- Contraintes ajoutées à la main (Prisma ne sait pas les décrire).

ALTER TABLE "authSessions" ADD CONSTRAINT "authSessions_kind_check"
    CHECK ("kind" IN ('user', 'device'));

-- Les sessions déjà ouvertes par une clé d'appareil ne se distinguent pas des
-- autres : on les ferme, le Pi se reconnecte seul avec sa clé et obtient une
-- session d'appareil.
UPDATE "authSessions" SET "revokedAt" = CURRENT_TIMESTAMP
    WHERE "revokedAt" IS NULL
      AND "deviceId" IN (SELECT "id" FROM "devices" WHERE "keyHash" IS NOT NULL);
