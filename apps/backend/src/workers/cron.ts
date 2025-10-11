import cron from "node-cron";
import { updateValidatorsInfo } from "./updateValidatorsJob";
import { config } from "@repo/config";
import { startCleanupCron } from "./cleanupCron";
import { updatePositionStatus } from "./positionStatus";

let isValidatorJobRunning = false;
let isPositionStatusJobRunning = false;

export function startCron() {
  cron.schedule(
    config.VALIDATOR_UPDATE_CRON_SCHEDULE,
    async () => {
      if (isValidatorJobRunning) {
        console.log("[cron] previous job still running, skipping this run");
        return; 
      }
      isValidatorJobRunning = true;
      console.log(`[cron] start ${new Date().toISOString()}`);
      try {
        await updateValidatorsInfo();
        await startCleanupCron();
        console.log(`[cron] done ${new Date().toISOString()}`);
      } catch (err) {
        console.error("[cron] error", err);
      }
    },
    { timezone: "UTC" }
  );
  cron.schedule(config.POSITION_STATUS_CRON_SCHEDULE, async () => {
    if (isPositionStatusJobRunning) {
      console.log("[positionStatus cron] previous job still running, skipping this run");
      return; 
    }
    isPositionStatusJobRunning = true;
    console.log(`[positionStatus cron] start ${new Date().toISOString()}`);
    try {
      await updatePositionStatus();
      console.log(`[positionStatus cron] done ${new Date().toISOString()}`);
    } catch (err) {
      console.error("[positionStatus cron] error", err);
    }
  });
}

export async function startImmediateCronJobs() {
  console.log(`[cron] start immediate jobs ${new Date().toISOString()}`);
  try {
    await updateValidatorsInfo();
    await startCleanupCron();
    await updatePositionStatus();
    console.log(`[cron] done immediate jobs ${new Date().toISOString()}`);
  } catch (err) {
    console.error("[cron] error", err);
  }
}
