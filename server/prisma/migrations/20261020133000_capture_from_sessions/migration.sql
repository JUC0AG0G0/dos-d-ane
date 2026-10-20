-- Un appareil capture tant qu'il est dans une session lancée : c'est déduit
-- de deviceSessions, plus de statut stocké.
ALTER TABLE "devices" DROP COLUMN "captureStatus";

-- Un appareil peut être dans plusieurs sessions en préparation ; une seule
-- session lancée, vérifiée par AnalysisService.
DROP INDEX "deviceSessions_deviceId_open_key";
