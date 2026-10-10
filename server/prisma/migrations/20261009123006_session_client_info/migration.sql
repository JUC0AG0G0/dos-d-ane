-- Informations relevées à la connexion, affichées dans la liste des sessions.
-- AlterTable
ALTER TABLE "authSessions" ADD COLUMN "ipAddress" TEXT,
ADD COLUMN "userAgent" TEXT;
