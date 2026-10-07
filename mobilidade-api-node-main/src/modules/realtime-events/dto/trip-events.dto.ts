import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TripEventsType } from '../trip-events-type.enum';

export class TripEventDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(TripEventsType)
  event: string;

  @IsOptional()
  trip: Record<string, any>;
}
