import { z } from 'zod'
import dotenv from 'dotenv'
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const envSchema = z.object({
    REDIS_URL: z.string(),
    PORT_BACKEND: z.string().transform(Number),
    PORT_POLLER: z.string().transform(Number),
    PORT_WS_SERVER: z.string().transform(Number),
    VALIDATOR_TOKEN: z.string(),
    VALIDATOR_API_URL: z.string().url(),
    VALIDATOR_UPDATE_CRON_SCHEDULE: z.string().default("0 3 * * *"), // Default to daily at 03:00 UTC
})

const env = envSchema.parse(process.env);

export const config = {
    REDIS_URL: env.REDIS_URL,
    PORT_BACKEND: env.PORT_BACKEND,
    PORT_POLLER: env.PORT_POLLER,
    PORT_WS_SERVER: env.PORT_WS_SERVER,
    VALIDATOR_TOKEN: env.VALIDATOR_TOKEN,
    VALIDATOR_API_URL: env.VALIDATOR_API_URL,
    VALIDATOR_UPDATE_CRON_SCHEDULE: env.VALIDATOR_UPDATE_CRON_SCHEDULE,
}


export default config