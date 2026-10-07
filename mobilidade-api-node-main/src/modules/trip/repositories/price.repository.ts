import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from '../entities';

@Injectable()
export class PriceRepository {
  constructor(
    @InjectRepository(Price)
    private repository: Repository<Price>,
  ) {}

  async findById(id: number): Promise<Price | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByTripTypeAndCity(
    tripTypeId: number,
    cityId: number,
  ): Promise<Price | null> {
    return await this.repository.findOne({
      where: { tripTypeId, cityId, statusId: 1 },
    });
  }
}
