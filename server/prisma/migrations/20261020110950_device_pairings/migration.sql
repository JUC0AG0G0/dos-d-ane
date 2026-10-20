-- Appairage des Raspberry Pi par le code de leur étiquette : seules les
-- empreintes SHA-256 du code et du secret de relève sont gardées.

-- CreateTable
CREATE TABLE "devicePairings" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "codeHash" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "deviceId" UUID,
    "claimedAt" TIMESTAMPTZ(3),
    "lastSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devicePairings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devicePairings_codeHash_key" ON "devicePairings"("codeHash");

-- CreateIndex
CREATE UNIQUE INDEX "devicePairings_deviceId_key" ON "devicePairings"("deviceId");

-- AddForeignKey
ALTER TABLE "devicePairings" ADD CONSTRAINT "devicePairings_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Contraintes ajoutées à la main (Prisma ne sait pas les décrire).

-- Empreintes SHA-256 en hexadécimal ; l'appareil et la date de validation vont ensemble.
ALTER TABLE "devicePairings" ADD CONSTRAINT "devicePairings_check"
    CHECK ("codeHash" ~ '^[0-9a-f]{64}$'
        AND "secretHash" ~ '^[0-9a-f]{64}$'
        AND (("deviceId" IS NULL) = ("claimedAt" IS NULL)));
