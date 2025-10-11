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
    POSITION_STATUS_CRON_SCHEDULE: z.string().default("2 * * * *"), // Default to every 2 minutes
    JWT_SECRET: z.string(),
    APP_URI: z.string().url().default("http://localhost:3000"),
    PROGRAM_ID: z.string(),
    DEVNET_RPC_URL: z.string().url(),
    MAINNET_RPC_URL: z.string().url().optional(),
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
    POSITION_STATUS_CRON_SCHEDULE: env.POSITION_STATUS_CRON_SCHEDULE,
    JWT_SECRET: env.JWT_SECRET,
    APP_URI: env.APP_URI,
    PROGRAM_ID: env.PROGRAM_ID,
    DEVNET_RPC_URL: env.DEVNET_RPC_URL,
    MAINNET_RPC_URL: env.MAINNET_RPC_URL,
}


export default config