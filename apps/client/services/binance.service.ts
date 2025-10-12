import axios from "axios";

export const fetchBinancePrices = async (
    symbol: string,
    interval: string,
    limit: number = 100
  ): Promise<[string, number][]> => {

    const res = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
  
    // Map to your [price, timestamp] format
    return res.data.map((item: any[]) => [item[4], item[0]]); 
  };
  