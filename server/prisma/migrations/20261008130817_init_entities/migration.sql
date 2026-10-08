-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "passwordHash" TEXT NOT NULL,
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "model" TEXT,
    "captureEligible" BOOLEAN NOT NULL DEFAULT false,
    "captureStatus" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authSessions" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "userId" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysisSessions" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "userId" UUID NOT NULL,
    "startedAt" TIMESTAMPTZ(3) NOT NULL,
    "endedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysisSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deviceSessions" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "analysisSessionId" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "startedAt" TIMESTAMPTZ(3) NOT NULL,
    "endedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deviceSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "captures" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "deviceSessionId" UUID NOT NULL,
    "capturedAt" TIMESTAMPTZ(3) NOT NULL,
    "imageWidth" INTEGER NOT NULL,
    "imageHeight" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "captures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bodyParts" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "bodyParts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keypoints" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "captureId" UUID NOT NULL,
    "bodyPartId" UUID NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keypoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "devices_userId_idx" ON "devices"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "authSessions_tokenHash_key" ON "authSessions"("tokenHash");

-- CreateIndex
CREATE INDEX "authSessions_userId_idx" ON "authSessions"("userId");

-- CreateIndex
CREATE INDEX "authSessions_deviceId_idx" ON "authSessions"("deviceId");

-- CreateIndex
CREATE INDEX "analysisSessions_userId_idx" ON "analysisSessions"("userId");

-- CreateIndex
CREATE INDEX "deviceSessions_deviceId_idx" ON "deviceSessions"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "deviceSessions_analysisSessionId_deviceId_key" ON "deviceSessions"("analysisSessionId", "deviceId");

-- CreateIndex
CREATE INDEX "captures_deviceSessionId_capturedAt_idx" ON "captures"("deviceSessionId", "capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "bodyParts_code_key" ON "bodyParts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "keypoints_captureId_bodyPartId_key" ON "keypoints"("captureId", "bodyPartId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authSessions" ADD CONSTRAINT "authSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authSessions" ADD CONSTRAINT "authSessions_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysisSessions" ADD CONSTRAINT "analysisSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deviceSessions" ADD CONSTRAINT "deviceSessions_analysisSessionId_fkey" FOREIGN KEY ("analysisSessionId") REFERENCES "analysisSessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deviceSessions" ADD CONSTRAINT "deviceSessions_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "captures" ADD CONSTRAINT "captures_deviceSessionId_fkey" FOREIGN KEY ("deviceSessionId") REFERENCES "deviceSessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keypoints" ADD CONSTRAINT "keypoints_captureId_fkey" FOREIGN KEY ("captureId") REFERENCES "captures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keypoints" ADD CONSTRAINT "keypoints_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "bodyParts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Contraintes CHECK ajoutées à la main (Prisma ne sait pas les décrire).

-- Un navigateur n'est jamais éligible à la capture.
ALTER TABLE "devices" ADD CONSTRAINT "devices_web_not_capture_check"
    CHECK ("type" <> 'web' OR "captureEligible" = false);

-- captureStatus vaut active ou inactive pour un appareil éligible, null sinon.
ALTER TABLE "devices" ADD CONSTRAINT "devices_captureStatus_check"
    CHECK (
        ("captureEligible" AND "captureStatus" IN ('active', 'inactive'))
        OR (NOT "captureEligible" AND "captureStatus" IS NULL)
    );

-- Taille de l'image en pixels.
ALTER TABLE "captures" ADD CONSTRAINT "captures_imageSize_check"
    CHECK ("imageWidth" > 0 AND "imageHeight" > 0);

-- Coordonnées en pixels, jamais négatives.
ALTER TABLE "keypoints" ADD CONSTRAINT "keypoints_position_check"
    CHECK ("x" >= 0 AND "y" >= 0);

-- Score du modèle entre 0 et 1.
ALTER TABLE "keypoints" ADD CONSTRAINT "keypoints_confidence_check"
    CHECK ("confidence" IS NULL OR "confidence" BETWEEN 0 AND 1);
