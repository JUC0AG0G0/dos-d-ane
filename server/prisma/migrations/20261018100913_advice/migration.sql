-- Conseils : exercices, réglages du poste, repères douleur et médias.

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "title" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "isPreventive" BOOLEAN NOT NULL DEFAULT false,
    "isForPain" BOOLEAN NOT NULL DEFAULT false,
    "durationSeconds" INTEGER NOT NULL,
    "posture" TEXT NOT NULL,
    "precautions" TEXT NOT NULL DEFAULT '',
    "mediaId" UUID,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exerciseSteps" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "exerciseId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "exerciseSteps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postureTips" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "key" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "shortText" TEXT NOT NULL,
    "tutorialText" TEXT NOT NULL,
    "sourceLabel" TEXT,
    "sourceUrl" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "mediaId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "postureTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "painZones" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "intro" TEXT NOT NULL DEFAULT '',
    "sourceLabel" TEXT,
    "sourceUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "painZones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "painZoneAdvices" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "painZoneId" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "painZoneAdvices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "painZoneExercises" (
    "painZoneId" UUID NOT NULL,
    "exerciseId" UUID NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "painZoneExercises_pkey" PRIMARY KEY ("painZoneId","exerciseId")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "uploadedById" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adviceSettings" (
    "key" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adviceSettings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "exercises_status_zone_idx" ON "exercises"("status", "zone");

-- CreateIndex
CREATE UNIQUE INDEX "exerciseSteps_exerciseId_position_key" ON "exerciseSteps"("exerciseId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "postureTips_key_key" ON "postureTips"("key");

-- CreateIndex
CREATE UNIQUE INDEX "painZoneAdvices_painZoneId_kind_position_key" ON "painZoneAdvices"("painZoneId", "kind", "position");

-- CreateIndex
CREATE INDEX "painZoneExercises_exerciseId_idx" ON "painZoneExercises"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "painZoneExercises_painZoneId_position_key" ON "painZoneExercises"("painZoneId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "media_storageKey_key" ON "media"("storageKey");

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exerciseSteps" ADD CONSTRAINT "exerciseSteps_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postureTips" ADD CONSTRAINT "postureTips_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "painZoneAdvices" ADD CONSTRAINT "painZoneAdvices_painZoneId_fkey" FOREIGN KEY ("painZoneId") REFERENCES "painZones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "painZoneExercises" ADD CONSTRAINT "painZoneExercises_painZoneId_fkey" FOREIGN KEY ("painZoneId") REFERENCES "painZones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "painZoneExercises" ADD CONSTRAINT "painZoneExercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Contraintes ajoutées à la main (Prisma ne sait pas les décrire).

ALTER TABLE "exercises" ADD CONSTRAINT "exercises_zone_check"
    CHECK ("zone" IN ('nuque', 'epaules', 'dos', 'poignets', 'yeux', 'jambes'));
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_status_check"
    CHECK ("status" IN ('draft', 'published'));
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_type_check"
    CHECK ("isPreventive" OR "isForPain");
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_duration_check"
    CHECK ("durationSeconds" > 0);

ALTER TABLE "postureTips" ADD CONSTRAINT "postureTips_key_check"
    CHECK ("key" IN ('ecran', 'dossier', 'pieds', 'clavier', 'lumiere', 'pauses'));
ALTER TABLE "postureTips" ADD CONSTRAINT "postureTips_source_check"
    CHECK (("sourceLabel" IS NULL AND "sourceUrl" IS NULL)
        OR ("sourceLabel" IS NOT NULL AND "sourceUrl" LIKE 'https://%'));

ALTER TABLE "painZones" ADD CONSTRAINT "painZones_status_check"
    CHECK ("status" IN ('draft', 'published'));
ALTER TABLE "painZones" ADD CONSTRAINT "painZones_source_check"
    CHECK (("sourceLabel" IS NULL AND "sourceUrl" IS NULL)
        OR ("sourceLabel" IS NOT NULL AND "sourceUrl" LIKE 'https://%'));

ALTER TABLE "painZoneAdvices" ADD CONSTRAINT "painZoneAdvices_kind_check"
    CHECK ("kind" IN ('helps', 'avoid'));

-- 3 exercices conseillés au plus par zone.
ALTER TABLE "painZoneExercises" ADD CONSTRAINT "painZoneExercises_position_check"
    CHECK ("position" BETWEEN 1 AND 3);

ALTER TABLE "media" ADD CONSTRAINT "media_mimeType_check"
    CHECK ("mimeType" IN ('image/gif', 'image/png', 'video/mp4'));
