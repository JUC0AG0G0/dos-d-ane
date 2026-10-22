-- Un Raspberry Pi ajouté par son code garde l'empreinte de ce code : le même
-- code tapé de nouveau dans le même compte reprend l'appareil au lieu d'en
-- créer un autre. Les appareils existants n'en ont pas (null).

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "pairingCodeHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "devices_userId_pairingCodeHash_key" ON "devices"("userId", "pairingCodeHash");

-- Contraintes ajoutées à la main (Prisma ne sait pas les décrire).

-- Empreinte SHA-256 en hexadécimal, seulement pour un Raspberry Pi.
ALTER TABLE "devices" ADD CONSTRAINT "devices_pairingCodeHash_check"
    CHECK ("pairingCodeHash" IS NULL
        OR ("pairingCodeHash" ~ '^[0-9a-f]{64}$' AND "type" = 'raspberry'));
