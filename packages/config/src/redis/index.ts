import { createClient, type RedisClientType } from "redis";
import { logger } from "../logger";
import type { ChannelName, WSData } from "@repo/types";

class RedisClient {
  private client: RedisClientType;

  constructor(private url: string) {
    this.client = createClient({ url: url });
    this.client.on("error", (err: any) =>
      logger.error('Redis client constructor', 'connecting to redis client', err)

    );
  }

  async connect() {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
    } catch (error) {
      logger.error('connect', 'connecting to redis client', error)
    }
  }

  async publish(channelName: ChannelName, data: WSData) {
    try {
      await this.client.publish(channelName, JSON.stringify(data));
    } catch (error) {
      logger.error('publish', `Error publising to channel: ${channelName}`, error);
    }
  }

  async subscribe(channelName: ChannelName, callback: (message: any) => void) {
    try {
      const subClient = this.client.duplicate();
  
      await subClient.connect();
  
      await subClient.subscribe(channelName, (message) => {
        try {
          callback(JSON.parse(message));
        } catch (err) {
          logger.error("subscribe", `Error parsing message from ${channelName}`, err);
        }
      });
  
      logger.info(`Subscribed to channel: ${channelName}`);
      return subClient; // return it so you can later unsubscribe or disconnect
    } catch (error) {
      logger.error("subscribe", `Error subscribing to channel: ${channelName}`, error);
    }
  }
  

  async disconnect() {
    if (this.client.isOpen) this.client.disconnect();
  }
}

export const createRedis = (url: string) => new RedisClient(url);
