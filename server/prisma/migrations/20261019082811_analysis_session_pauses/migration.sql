-- Pauses d'une session d'analyse : pendant une pause, le serveur refuse les
-- captures et le temps de pause n'est pas compté dans la durée active.

-- CreateTable
CREATE TABLE "analysisSessionPauses" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "analysisSessionId" UUID NOT NULL,
    "startedAt" TIMESTAMPTZ(3) NOT NULL,
    "endedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysisSessionPauses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analysisSessionPauses_analysisSessionId_idx" ON "analysisSessionPauses"("analysisSessionId");

-- AddForeignKey
ALTER TABLE "analysisSessionPauses" ADD CONSTRAINT "analysisSessionPauses_analysisSessionId_fkey" FOREIGN KEY ("analysisSessionId") REFERENCES "analysisSessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes ajoutées à la main (Prisma ne sait pas les décrire).

ALTER TABLE "analysisSessionPauses" ADD CONSTRAINT "analysisSessionPauses_dates_check"
    CHECK ("endedAt" IS NULL OR "endedAt" >= "startedAt");

-- Une seule pause ouverte par session.
CREATE UNIQUE INDEX "analysisSessionPauses_analysisSessionId_open_key"
    ON "analysisSessionPauses" ("analysisSessionId") WHERE "endedAt" IS NULL;
