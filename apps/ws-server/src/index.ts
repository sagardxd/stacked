import { createRedis, config } from '@repo/config'
import { ChannelName } from '@repo/types';
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: config.PORT_WS_SERVER, host: '0.0.0.0' });

const redisClient = createRedis(config.REDIS_URL);
await redisClient.connect();

await redisClient.subscribe(ChannelName.ASSET_PRICES, (message) => {

    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(message));
        }
    });
})

wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ msg: "Welcome from server" }));
});
