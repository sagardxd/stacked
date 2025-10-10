import { ChannelName, type AssetData, type WSData } from '@repo/types';
import {createRedis, config, logger} from '@repo/config'

const main = async () => {

    let assets: WSData = {
        price_updates: []
    }

    const redisClient = createRedis(config.REDIS_URL);
    await redisClient.connect();

    const backpackWS = new WebSocket("wss://ws.backpack.exchange/");
    const msg = { method: "SUBSCRIBE", params: [ "bookTicker.SOL_USDC"], id: 1 }

    backpackWS.onopen = (() => {
        backpackWS.send(JSON.stringify(msg))
    });

    backpackWS.onmessage = ((event: any) => {
        const response = JSON.parse(event.data);
        const data = response.data;


        const parsed: AssetData = { 
            asset: data.s.replace("_USDC", ""),
            currPrice: Math.round(Number(data.a) * Math.pow(10, data.a.split(".")[1].length)),
            decimal: data.a.split(".")[1].length
        }

        const existingAsset = assets.price_updates.findIndex((data: any) => data.asset === parsed.asset);
        if (existingAsset == -1) {
            assets.price_updates.push(parsed)
        } else {
            assets.price_updates[existingAsset] = parsed
        }
    })

    setInterval(async () => {
        try {
            if (assets.price_updates.length > 0) {
                console.log(assets)
                await redisClient.publish(ChannelName.ASSET_PRICES, assets)
            }
        } catch (err) {
            logger.error("poller", "Error while publishing:", err);
        }
    }, 500);

}



main();