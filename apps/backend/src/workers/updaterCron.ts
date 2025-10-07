import cron from "node-cron";
import { updateValidatorsInfo } from "./updateValidatorsJob";
import { config } from "@repo/config";

export function startCron() {
  cron.schedule(config.VALIDATOR_UPDATE_CRON_SCHEDULE, async () => {
    console.log(`[cron] updateValidatorsInfo start ${new Date().toISOString()}`);
    try {
      await updateValidatorsInfo();
      console.log(`[cron] updateValidatorsInfo done ${new Date().toISOString()}`);
    } catch (err) {
      console.error("[cron] updateValidatorsInfo error", err);
    }
  }, { timezone: "UTC" });
}
