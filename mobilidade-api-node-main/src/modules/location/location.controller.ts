import { Controller, HttpStatus, Inject, Post, Res } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(
    @Inject(LocationService) private readonly locationService: LocationService,
  ) {}

  @Post('route')
  async route(@Payload() payload: RouteDTO, @Res() res: Response) {
    if (!payload) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: 'Payload inválido',
      });
    }

    const result = await this.locationService.route(payload);

    return res.status(HttpStatus.OK).json({
      status: result,
    });
  }

  @Post('deleteRoute')
  deleteRoute(@Payload() payload: any, @Res() res: Response) {
    if (!payload) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: 'Payload inválido',
      });
    }

    const result = this.locationService.deleteRoute(payload);

    return res.status(HttpStatus.OK).json({
      status: result,
    });
  }

  @Post('insertv2')
  async insert(@Payload() payload: LocationDTO[], @Res() res: Response) {
    if (!payload[0]) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: 'Payload inválido',
      });
    }

    const result = await this.locationService.insert(payload[0]);

    return res.status(HttpStatus.OK).json({
      status: result,
    });
  }
}
