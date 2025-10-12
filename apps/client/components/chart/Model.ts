import type { SkPath } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";

import { fetchBinancePrices } from "@/services/binance.service";
import { curveLines } from "./Math";

export const PADDING = 16;

export const COLORS = ["#F69D69", "#FFC37D", "#61E0A1", "#31CBD1"];

// Binance API types
export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

export type PriceList = [string, number][];

export interface DataPoints {
  percent_change: number;
  prices: PriceList;
}

export interface GraphData {
  hour: DataPoints;
  day: DataPoints;
  week: DataPoints;
  month: DataPoints;
  year: DataPoints;
  all: DataPoints;
}

const POINTS = 20;

// Helper function to calculate percent change
const calculatePercentChange = (prices: PriceList): number => {
  if (prices.length < 2) return 0;
  
  const firstPriceStr = prices[0]?.[0];
  const lastPriceStr = prices[prices.length - 1]?.[0];
  
  if (!firstPriceStr || !lastPriceStr) return 0;
  
  const firstPrice = parseFloat(firstPriceStr);
  const lastPrice = parseFloat(lastPriceStr);
  
  if (isNaN(firstPrice) || isNaN(lastPrice) || firstPrice === 0) return 0;
  
  return ((lastPrice - firstPrice) / firstPrice) * 100;
};

// Convert Binance kline data to our format
const convertBinanceToPriceList = (klines: [string, number][]): PriceList => {
  return klines.map(([price, timestamp]) => [price, timestamp]);
};

// Fetch and process data for different time intervals
export const fetchGraphData = async (symbol: string = "SOLUSDT"): Promise<GraphData> => {
  try {
    console.log('Starting to fetch graph data for symbol:', symbol);
    
    // Fetch data for different intervals
    const [hourData, dayData, weekData, monthData, yearData, allData] = await Promise.all([
      fetchBinancePrices(symbol, "1h", 24), // 24 hours
      fetchBinancePrices(symbol, "4h", 42), // 7 days (42 * 4h = 168h)
      fetchBinancePrices(symbol, "1d", 30), // 30 days
      fetchBinancePrices(symbol, "1d", 90), // 90 days
      fetchBinancePrices(symbol, "1w", 52), // 52 weeks
      fetchBinancePrices(symbol, "1M", 365), // 365 days (approximately 1 year)
    ]);

    console.log('Fetched data lengths:', {
      hour: hourData.length,
      day: dayData.length,
      week: weekData.length,
      month: monthData.length,
      year: yearData.length,
      all: allData.length
    });

    return {
      hour: {
        percent_change: calculatePercentChange(hourData),
        prices: convertBinanceToPriceList(hourData),
      },
      day: {
        percent_change: calculatePercentChange(dayData),
        prices: convertBinanceToPriceList(dayData),
      },
      week: {
        percent_change: calculatePercentChange(weekData),
        prices: convertBinanceToPriceList(weekData),
      },
      month: {
        percent_change: calculatePercentChange(monthData),
        prices: convertBinanceToPriceList(monthData),
      },
      year: {
        percent_change: calculatePercentChange(yearData),
        prices: convertBinanceToPriceList(yearData),
      },
      all: {
        percent_change: calculatePercentChange(allData),
        prices: convertBinanceToPriceList(allData),
      },
    };
  } catch (error) {
    console.error("Error fetching Binance data:", error);
    // Return empty data structure on error
    const emptyDataPoints: DataPoints = {
      percent_change: 0,
      prices: [],
    };
    return {
      hour: emptyDataPoints,
      day: emptyDataPoints,
      week: emptyDataPoints,
      month: emptyDataPoints,
      year: emptyDataPoints,
      all: emptyDataPoints,
    };
  }
};

const buildGraph = (
  datapoints: DataPoints,
  label: string,
  WIDTH: number,
  HEIGHT: number
) => {
  const AJUSTED_SIZE = HEIGHT - PADDING * 2;
  const priceList = datapoints.prices.slice(0, POINTS);
  
  // Handle empty data
  if (priceList.length === 0) {
    return {
      label,
      minPrice: 0,
      maxPrice: 0,
      percentChange: 0,
      path: Skia.Path.Make(),
    };
  }
  
  const formattedValues = priceList
    .filter((price) => price && price[0] && !isNaN(parseFloat(price[0])))
    .map((price) => [parseFloat(price[0]), price[1]] as [number, number])
    .reverse();
    
  if (formattedValues.length === 0) {
    return {
      label,
      minPrice: 0,
      maxPrice: 0,
      percentChange: 0,
      path: Skia.Path.Make(),
    };
  }
  
  const prices = formattedValues.map((value) => value[0]);
  const dates = formattedValues.map((value) => value[1]);
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  // Handle case where minDate equals maxDate
  const dateRange = maxDate - minDate || 1;
  const priceRange = maxPrice - minPrice || 1;
  
  const points = formattedValues.map(([price, date]) => {
    const x = ((date - minDate) / dateRange) * WIDTH;
    const y = ((price - minPrice) / priceRange) * AJUSTED_SIZE;
    return { x, y };
  });
  
  if (points.length > 0) {
    points.push({ x: WIDTH + 10, y: points[points.length - 1].y });
  }
  
  const path = curveLines(points, 0.1, "complex");
  return {
    label,
    minPrice,
    maxPrice,
    percentChange: datapoints.percent_change,
    path,
  };
};

export interface Graph {
  label: string;
  value: number;
  data: {
    label: string;
    minPrice: number;
    maxPrice: number;
    percentChange: number;
    path: SkPath;
  };
}

export type Graphs = Graph[];

export const getGraph = (width: number, height: number, graphData: GraphData) => [
  {
    label: "1H",
    value: 0,
    data: buildGraph(graphData.hour, "Last Hour", width, height),
  },
  {
    label: "1D",
    value: 1,
    data: buildGraph(graphData.day, "Today", width, height),
  },
  {
    label: "1M",
    value: 2,
    data: buildGraph(graphData.month, "Last Month", width, height),
  },
  {
    label: "1Y",
    value: 3,
    data: buildGraph(graphData.year, "This Year", width, height),
  },
  {
    label: "All",
    value: 4,
    data: buildGraph(graphData.all, "All time", width, height),
  },
];

export type GraphIndex = 0 | 1 | 2 | 3 | 4;
