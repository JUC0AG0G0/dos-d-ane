-- Résultats envoyés par le Pi : alertes de posture et résumés par période.

-- CreateTable
CREATE TABLE "postureEvents" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "deviceSessionId" UUID NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startedAt" TIMESTAMPTZ(3) NOT NULL,
    "endedAt" TIMESTAMPTZ(3),
    "headAngleAvg" DOUBLE PRECISION,
    "trunkAngleAvg" DOUBLE PRECISION,
    "causes" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "postureEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postureSummaries" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "deviceSessionId" UUID NOT NULL,
    "clientId" TEXT NOT NULL,
    "periodStart" TIMESTAMPTZ(3) NOT NULL,
    "periodEnd" TIMESTAMPTZ(3) NOT NULL,
    "score" INTEGER,
    "secondsGreen" INTEGER NOT NULL,
    "secondsOrange" INTEGER NOT NULL,
    "secondsRed" INTEGER NOT NULL,
    "secondsIgnored" INTEGER NOT NULL,
    "secondsAbsent" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "postureSummaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "postureEvents_deviceSessionId_startedAt_idx" ON "postureEvents"("deviceSessionId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "postureEvents_deviceSessionId_clientId_key" ON "postureEvents"("deviceSessionId", "clientId");

-- CreateIndex
CREATE INDEX "postureSummaries_deviceSessionId_periodStart_idx" ON "postureSummaries"("deviceSessionId", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "postureSummaries_deviceSessionId_clientId_key" ON "postureSummaries"("deviceSessionId", "clientId");

-- AddForeignKey
ALTER TABLE "postureEvents" ADD CONSTRAINT "postureEvents_deviceSessionId_fkey" FOREIGN KEY ("deviceSessionId") REFERENCES "deviceSessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postureSummaries" ADD CONSTRAINT "postureSummaries_deviceSessionId_fkey" FOREIGN KEY ("deviceSessionId") REFERENCES "deviceSessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes ajoutées à la main (Prisma ne sait pas les décrire).

ALTER TABLE "postureEvents" ADD CONSTRAINT "postureEvents_type_check"
    CHECK ("type" IN ('FORWARD_HEAD', 'TRUNK_FORWARD', 'TRUNK_BACKWARD', 'IMMOBILE'));
ALTER TABLE "postureEvents" ADD CONSTRAINT "postureEvents_dates_check"
    CHECK ("endedAt" IS NULL OR "endedAt" >= "startedAt");
ALTER TABLE "postureEvents" ADD CONSTRAINT "postureEvents_angles_check"
    CHECK (("headAngleAvg" IS NULL OR "headAngleAvg" BETWEEN -180 AND 180)
       AND ("trunkAngleAvg" IS NULL OR "trunkAngleAvg" BETWEEN -180 AND 180));
ALTER TABLE "postureEvents" ADD CONSTRAINT "postureEvents_causes_check"
    CHECK ("causes" IS NULL OR jsonb_typeof("causes") = 'object');

ALTER TABLE "postureSummaries" ADD CONSTRAINT "postureSummaries_period_check"
    CHECK ("periodEnd" >= "periodStart");
ALTER TABLE "postureSummaries" ADD CONSTRAINT "postureSummaries_score_check"
    CHECK ("score" IS NULL OR "score" BETWEEN 0 AND 100);
ALTER TABLE "postureSummaries" ADD CONSTRAINT "postureSummaries_seconds_check"
    CHECK ("secondsGreen" >= 0 AND "secondsOrange" >= 0 AND "secondsRed" >= 0
       AND "secondsIgnored" >= 0 AND "secondsAbsent" >= 0);
