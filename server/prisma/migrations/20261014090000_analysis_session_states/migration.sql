-- Une session d'analyse peut être préparée avant d'être lancée.
ALTER TABLE "analysisSessions" ALTER COLUMN "startedAt" DROP NOT NULL;

-- Contraintes ajoutées à la main (Prisma ne sait pas les décrire).

ALTER TABLE "analysisSessions" ADD CONSTRAINT "analysisSessions_dates_check"
    CHECK ("endedAt" IS NULL OR ("startedAt" IS NOT NULL AND "endedAt" >= "startedAt"));

CREATE UNIQUE INDEX "deviceSessions_deviceId_open_key"
    ON "deviceSessions" ("deviceId") WHERE "endedAt" IS NULL;
