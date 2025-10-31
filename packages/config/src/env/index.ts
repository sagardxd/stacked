import { z } from 'zod'
import dotenv from 'dotenv'
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const envSchema = z.object({
    REDIS_URL: z.string(),
    PORT_POLLER: z.string().transform(Number),
    PORT_WS_SERVER: z.string().transform(Number),
    PROGRAM_ID: z.string(),
    DEVNET_RPC_URL: z.string().url(),
})

const env = envSchema.parse(process.env);

export const config = {
    REDIS_URL: env.REDIS_URL,
    PORT_POLLER: env.PORT_POLLER,
    PORT_WS_SERVER: env.PORT_WS_SERVER,
    PROGRAM_ID: env.PROGRAM_ID,
    DEVNET_RPC_URL: env.DEVNET_RPC_URL,
}


export default config