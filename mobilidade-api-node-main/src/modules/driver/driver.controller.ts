import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Payload } from '@nestjs/microservices';
import { DriverService } from './driver.service';
import { SearchTripDto } from '../driver/dto';

@Controller('driver')
export class DriverController {
  constructor(
    @Inject(DriverService) private readonly driverService: DriverService,
  ) {}

  @Get('realtime/all') // busca todos os motoristas onlines em tempo real
  async realtimeIndex(
    @Payload() payload: StdPayload<SearchTripDto>,
    @Res() res: Response,
  ) {
    res.status(HttpStatus.ACCEPTED).json({
      message: 'Requisitando busca de viagens',
    });
  }

  @Post('SearchTrip')
  async searchTrip(
    @Payload() payload: StdPayload<SearchTripDto>,
    @Res() res: Response,
  ) {
    const { stdObject } = payload;

    try {
      const result = await this.driverService.searchTrip(stdObject[0]);

      return res.status(HttpStatus.OK).json({
        status: true,
        message: 'Listando viagens',
        data: result ? [result] : [],
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: error.message || error });
    }
  }

  @Post('SearchTripByReference')
  async getTrip(@Payload() payload: SearchTripDto, @Res() res: Response) {
    try {
      const result = await this.driverService.getTrip(payload);

      return res.status(HttpStatus.OK).json({
        status: true,
        message: 'Listando viagem',
        data: result || {},
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: error.message || error });
    }
  }

  @Get('online/:cityId')
  async getOnlineDrivers(
    @Param('cityId', ParseIntPipe) cityId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.driverService.getOnlineDrivers(cityId);

      return res.status(HttpStatus.OK).json({
        status: true,
        message: 'Listando viagem',
        data: result || {},
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: error.message || error });
    }
  }
}
