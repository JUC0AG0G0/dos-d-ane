-- Passage aux JWT : le token porte l'id de la session, son hash n'est plus
-- stocké. Les sessions ouvertes avec l'ancien token opaque sont fermées.
UPDATE "authSessions" SET "revokedAt" = CURRENT_TIMESTAMP WHERE "revokedAt" IS NULL;

-- DropIndex
DROP INDEX "authSessions_tokenHash_key";

-- AlterTable
ALTER TABLE "authSessions" DROP COLUMN "tokenHash";

-- displayName devient obligatoire. Les comptes existants sans nom reçoivent
-- le début de leur email suivi d'un bout de leur id, pour rester uniques.
UPDATE "users"
    SET "displayName" = split_part("email", '@', 1) || '-' || left("id"::text, 8)
    WHERE "displayName" IS NULL OR btrim("displayName") = '';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "displayName" SET NOT NULL;

-- Ajouté à la main (Prisma ne sait pas décrire un index sur une expression) :
-- displayName unique sans tenir compte de la casse (« Jules » et « jules »).
CREATE UNIQUE INDEX "users_displayName_lower_key" ON "users" (lower("displayName"));
