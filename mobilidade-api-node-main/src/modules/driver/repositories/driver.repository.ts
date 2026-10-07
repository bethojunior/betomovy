import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { DriverLocationDTO } from '../dto/driverLocation.dto';

const LAT_LNG_PRECISION = 7;

@Injectable()
export class DriverRepository {
  constructor(
    @InjectRepository(Driver)
    private repository: Repository<Driver>,
  ) {}

  async find(driverId: number) {
    return this.repository
      .createQueryBuilder('driver')
      .where('driver.idDriver = :id', { id: driverId })
      .innerJoinAndSelect('driver.user', 'user')
      .innerJoinAndSelect('driver.balance', 'balance')
      .leftJoinAndSelect('driver.car', 'car')
      .getOne();
  }

  async findDataDriverPosition(driverId: number): Promise<DriverLocationDTO> {
    // const status = ['disponivel', 'corrida'];
    const driver = await this.repository
      .createQueryBuilder('driver')
      .innerJoin('user', 'u', 'driver.userId = u.idUser')
      .innerJoin('levelAccess', 'la', 'la.userId = u.idUser')
      .innerJoin('userType', 'ut', 'ut.idUserType = la.userTypeId')
      .innerJoin('city', 'c', 'driver.cityId = c.id')
      .innerJoin(
        'driverRegisterStatus',
        'dr',
        'dr.idDriverRegisterStatus = driver.driverRegisterStatusId',
      )
      .leftJoin('car', 'car', 'car.driverId = driver.idDriver')
      .where('driver.idDriver = :id', { id: driverId })
      .select([
        'driver.idDriver AS idDriver',
        'driver.userId AS userId',
        'driver.status AS status',
        'driver.last_lat AS lastLat',
        'driver.last_lon AS lastLon',
        'driver.profileImage AS profileImage',
        'u.name AS userName',
        'u.phone AS userPhone',
        'u.nickname AS userNickname',
        'driver.driverRegisterStatusId AS driverRegisterStatusId',
        'la.userTypeId AS userTypeId',
        'u.rating AS userRating',
        'ut.name AS userType',
        'dr.name AS driverRegisterStatus',
        'c.nome AS cityName',
        'c.id AS cityId',
        `CASE WHEN car.idCar IS NOT NULL THEN JSON_OBJECT(
          'idCar', car.idCar,
          'year', car.year,
          'plate', car.plate,
          'model', car.model,
          'color', car.color,
          'brand', car.brand,
          'driverId', car.driverId
        ) ELSE NULL END AS car`,
      ])
      .getRawOne();

    if (driver?.car && typeof driver.car === 'string') {
      driver.car = JSON.parse(driver.car);
    }

    return new DriverLocationDTO(driver);
  }

  async updatePosition(driverId: number, position: Point): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder()
      .update(Driver)
      .set({
        last_lat: position.lat.toFixed(LAT_LNG_PRECISION),
        last_lon: position.lng.toFixed(LAT_LNG_PRECISION),
        last_position_update: new Date().toISOString(),
      })
      .where('idDriver = :id', { id: driverId })
      .execute();
  }
}
