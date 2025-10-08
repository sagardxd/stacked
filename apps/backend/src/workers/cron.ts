import cron from "node-cron";
import { updateValidatorsInfo } from "./updateValidatorsJob";
import { config } from "@repo/config";
import { startCleanupCron } from "./cleanupCron";

export function startCron() {
  cron.schedule(config.VALIDATOR_UPDATE_CRON_SCHEDULE, async () => {
    console.log(`[cron] start ${new Date().toISOString()}`);
    try {
      await updateValidatorsInfo();
      await startCleanupCron();
      console.log(`[cron] done ${new Date().toISOString()}`);
    } catch (err) {
      console.error("[cron] error", err);
    }
  }, { timezone: "UTC" });
}
