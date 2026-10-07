import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';

export class RequestLocationDriverDto {
  @IsNotEmpty()
  @IsString()
  latitude: string;
  @IsNotEmpty()
  @IsString()
  longitude: string;
  @IsNotEmpty()
  @IsNumber()
  driverId: number;
  @IsNumber()
  cityId: number;
  @IsDate()
  lastConnection: Date;
  @IsString()
  socketClientId: string;
  @IsString()
  status: string;

  constructor(partial: Partial<RequestLocationDriverDto>) {
    Object.assign(this, partial);
  }
}
