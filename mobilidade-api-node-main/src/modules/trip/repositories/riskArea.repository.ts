import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskArea } from '../entities';

@Injectable()
export class RiskAreaRepository {
  constructor(
    @InjectRepository(RiskArea)
    private repository: Repository<RiskArea>,
  ) {}

  async checkRiskArea(lat: string, lng: string): Promise<boolean> {
    const riskArea = await this.repository
      .createQueryBuilder('riskArea')
      .select(
        `
        ( 
          6371 * 1000 *
          ACOS(
              COS( RADIANS( latitude ) ) *
              COS( RADIANS( :latitude ) ) *
              COS( RADIANS( :longitude ) -
              RADIANS( longitude ) ) +
              SIN( RADIANS( latitude ) ) *
              SIN( RADIANS( :latitude) )
          )
        )
      `,
        'distance',
      )
      .addSelect('riskArea.radius')
      .where('riskArea.status = :status', { status: 'confirmed' })
      .andWhere('riskArea.deleted_at IS NULL')
      .having('distance <= riskArea.radius')
      .setParameters({ latitude: lat, longitude: lng })
      .getOne();

    return !!riskArea;
  }
}
