
import { Asset } from '@repo/types';
import apiCaller from './axios.service';

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Binance K-lines API response type
type BinanceKline = [
  number, // Open time
  string, // Open price
  string, // High price
  string, // Low price
  string, // Close price
  string, // Volume
  number, // Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string  // Ignore
];

// API call to fetch candlestick data from backend
export const fetchCandleData = async (
  symbol: string = 'SOl',
  interval: string = '1m'
): Promise<CandleData[]> => {
  try {
    const result = await apiCaller.get(`/candles/${symbol}?interval=${interval}`);

    if (result && result.data && Array.isArray(result.data)) {
      return result.data.map((candle: any) => ({
        timestamp: parseInt(candle.time),
        open: parseFloat(candle.open),
        high: parseFloat(candle.high),
        low: parseFloat(candle.low),
        close: parseFloat(candle.close),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching candle data:', error);
    return [];
  }
};

// Fetch K-lines data directly from Binance API
export const fetchBinanceKlines = async (
  symbol: Asset,
  interval: string = '1h',
  limit: number = 10
): Promise<{ value: number; dataPointText: string }[]> => {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const klines: BinanceKline[] = await response.json();

    // Extract close prices and convert to integers for chart display
    return klines.map((kline, index) => {
      const closePrice = parseFloat(kline[4]); // Close price is at index 4
      const integerValue = (closePrice)// Convert to integer

      return {
        value: integerValue,
        dataPointText: integerValue.toString()
      };
    });
  } catch (error) {
    console.error('Error fetching Binance K-lines:', error);
    // Return fallback data in case of error
    return [
      { value: 50000, dataPointText: '50000' },
      { value: 51000, dataPointText: '51000' },
      { value: 49000, dataPointText: '49000' },
      { value: 52000, dataPointText: '52000' },
      { value: 48000, dataPointText: '48000' },
      { value: 53000, dataPointText: '53000' },
      { value: 47000, dataPointText: '47000' },
      { value: 54000, dataPointText: '54000' },
      { value: 46000, dataPointText: '46000' },
      { value: 55000, dataPointText: '55000' },
    ];
  }
};
