export const KSERVE_METRICS_CONFIG_MAP_NAME_SUFFIX = '-metrics-dashboard';

export enum KserveMetricsGraphTypes {
  CPU_USAGE = 'CPU_USAGE',
  MEMORY_USAGE = 'MEMORY_USAGE',
  REQUEST_COUNT = 'REQUEST_COUNT',
  MEAN_LATENCY = 'MEAN_LATENCY',
}

export enum NimMetricsGraphTypes {
  TIME_TO_FIRST_TOKEN = 'TIME_TO_FIRST_TOKEN',
  TIME_PER_OUTPUT_TOKEN = 'TIME_PER_OUTPUT_TOKEN',
  KV_CACHE = 'KV_CACHE',
  CURRENT_REQUESTS = 'CURRENT_REQUESTS',
  TOKENS_COUNT = 'TOKENS_COUNT',
  REQUEST_OUTCOMES = 'REQUEST_OUTCOMES',
}
