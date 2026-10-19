-- Clé d'appareil des Raspberry Pi : seule son empreinte SHA-256 est gardée.

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "keyCreatedAt" TIMESTAMPTZ(3),
ADD COLUMN     "keyHash" TEXT;

-- Contraintes ajoutées à la main (Prisma ne sait pas les décrire).

-- Empreinte SHA-256 en hexadécimal, avec sa date ; réservée aux Raspberry Pi.
ALTER TABLE "devices" ADD CONSTRAINT "devices_key_check"
    CHECK (("keyHash" IS NULL AND "keyCreatedAt" IS NULL)
        OR ("keyHash" ~ '^[0-9a-f]{64}$' AND "keyCreatedAt" IS NOT NULL AND "type" = 'raspberry'));
