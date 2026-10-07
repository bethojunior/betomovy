export interface ProcessorContext {
  redisKey: string;
  tripPrevious: Record<string, any>;
  tripReference: string;
  ttl: number;
}
