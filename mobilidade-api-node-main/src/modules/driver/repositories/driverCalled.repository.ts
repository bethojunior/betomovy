import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchTripQuery } from 'src/@types/modules/driver/driverResponse';
import { Repository } from 'typeorm';
import { DriverCalled } from '../entities/driverCalled.entity';

@Injectable()
export class DriverCalledRepository {
  constructor(
    @InjectRepository(DriverCalled)
    private repository: Repository<DriverCalled>,
  ) {}

  async findTripCallingDriver(
    driverId: number,
    listTripsDenied: string[],
  ): Promise<SearchTripQuery> {
    const query = this.repository
      .createQueryBuilder('driverCalled')
      .select('trip.idTrip', 'idTrip')
      .addSelect(
        'TIME_TO_SEC(TIMEDIFF(:now, driverCalled.updated_at))',
        'missingSeconds',
      )
      .addSelect('driverCalled.tripReference', 'tripReference')
      .addSelect('trip.status', 'status')
      .addSelect('trip.price', 'price')
      .addSelect('trip.priceId', 'priceId')
      .addSelect('trip.date', 'date')
      .addSelect('trip.endDate', 'endDate')
      .addSelect('trip.distance', 'distance')
      .addSelect('trip.estimatedTripTime', 'estimatedTripTime')
      .addSelect('trip.multiplierDynamic', 'multiplierDynamic')
      .addSelect('trip.callingDriver', 'callingDriver')
      .addSelect('trip.userId', 'userId')
      .addSelect('trip.rewardTripId', 'rewardTripId')
      .addSelect('rewardTrip.value', 'rewardValue')
      .addSelect('rewardTripType.name', 'rewardType')
      .addSelect('tripPaymentForm.name', 'tripPaymentForm')
      .addSelect('tripPaymentForm.paymentFormTypeId', 'paymentFormTypeId')
      .addSelect('zone.radius', 'radius')
      .addSelect('zone.greaterRadius', 'greaterRadius')
      .addSelect('zone.time', 'timeToIncrease')
      .addSelect('zone.callClose', 'callClose')
      .addSelect('zone.allowsFavorite', 'allowsFavorite')
      .addSelect('zone.typeCalled', 'typeCalled')
      .addSelect('tripType.type', 'type')
      .addSelect('customer.profileImage', 'customerImage')
      .addSelect(
        'CONCAT(config.value, :tripTypePath, tripType.picture)',
        'tripTypePicture',
      )
      .addSelect('trip.tripTypeId', 'tripTypeId')
      .addSelect('trip.cityId', 'cityId')
      .addSelect('origin.address', 'startAddress')
      .addSelect('origin.latitude', 'startLatitude')
      .addSelect('origin.longitude', 'startLongitude')
      .addSelect('destination.address', 'endAddress')
      .addSelect('destination.latitude', 'endLatitude')
      .addSelect('destination.longitude', 'endLongitude')
      .addSelect('cityConfig.timeToExpireTrip', 'timeToExpireTrip')
      .addSelect('user.name', 'nameCustomer')
      .addSelect('FORMAT(user.rating, 2)+0', 'ratingCustomer')
      .addSelect('user.quantityTrips', 'quantityTripsCustomer')
      .addSelect('trip.haveReturn', 'haveReturn')

      .innerJoin('driverCalled.trip', 'trip')
      .innerJoin('trip.tripPaymentForm', 'tripPaymentForm')
      .innerJoin('trip.zone', 'zone')
      .innerJoin('trip.origin', 'origin')
      .innerJoin('trip.destination', 'destination')
      .innerJoin('trip.tripType', 'tripType')
      .innerJoin('trip.user', 'user')
      .innerJoin('cityConfig', 'cityConfig', 'cityConfig.cityId = trip.cityId')
      .innerJoin('config', 'config', 'config.key = :linkStoragePicture', {
        linkStoragePicture: 'link_storage_pictures',
      })

      .leftJoin('customer', 'customer', 'trip.user.idUser = customer.userId')
      .leftJoin('trip.rewardTrip', 'rewardTrip')
      .leftJoin('rewardTrip.rewardTripType', 'rewardTripType')

      .where('(trip.status = :status OR trip.status = :status2)', {
        status: 'searching',
        status2: 'searching_favorite',
      })
      .andWhere('driverCalled.driverId = :driverId', { driverId })
      .andWhere('driverCalled.status = :driverCalledStatus', {
        driverCalledStatus: 'calling',
      })
      .andWhere('FIND_IN_SET(:callingDriver, trip.callingDriver) > 0')

      .setParameter(
        'now',
        new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      )
      .setParameter('tripTypePath', 'tripType/')
      .setParameter('callingDriver', driverId);

    if (listTripsDenied.length) {
      query.andWhere('trip.tripReference NOT IN (:listTripsDenied)', {
        listTripsDenied: listTripsDenied.join(','),
      });
    }

    return query.getRawOne<SearchTripQuery>();
  }

  async findTripCallingDriverV2(
    driverId: number,
    listTripsDenied: string[],
  ): Promise<SearchTripQuery> {
    const query = this.repository
      .createQueryBuilder('driverCalled')
      .select('trip.idTrip', 'idTrip')
      .addSelect('driverCalled.tripReference', 'tripReference')
      .addSelect('trip.status', 'status')
      .addSelect('trip.price', 'price')
      .addSelect('trip.priceId', 'priceId')
      .addSelect('trip.date', 'date')
      .addSelect('trip.endDate', 'endDate')
      .addSelect('trip.distance', 'distance')
      .addSelect('trip.estimatedTripTime', 'estimatedTripTime')
      .addSelect('trip.multiplierDynamic', 'multiplierDynamic')
      .addSelect('trip.callingDriver', 'callingDriver')
      .addSelect('trip.userId', 'userId')
      .addSelect('trip.rewardTripId', 'rewardTripId')
      .addSelect('rewardTrip.value', 'rewardValue')
      .addSelect('rewardTripType.name', 'rewardType')
      .addSelect('tripPaymentForm.name', 'tripPaymentForm')
      .addSelect('tripPaymentForm.paymentFormTypeId', 'paymentFormTypeId')
      .addSelect('zone.radius', 'radius')
      .addSelect('zone.greaterRadius', 'greaterRadius')
      .addSelect('zone.time', 'timeToIncrease')
      .addSelect('zone.callClose', 'callClose')
      .addSelect('zone.allowsFavorite', 'allowsFavorite')
      .addSelect('zone.typeCalled', 'typeCalled')
      .addSelect('tripType.type', 'type')
      .addSelect('customer.profileImage', 'customerImage')
      .addSelect(
        'CONCAT(config.value, :tripTypePath, tripType.picture)',
        'tripTypePicture',
      )
      .addSelect('trip.tripTypeId', 'tripTypeId')
      .addSelect('trip.cityId', 'cityId')
      .addSelect('origin.address', 'startAddress')
      .addSelect('origin.latitude', 'startLatitude')
      .addSelect('origin.longitude', 'startLongitude')
      .addSelect('destination.address', 'endAddress')
      .addSelect('destination.latitude', 'endLatitude')
      .addSelect('destination.longitude', 'endLongitude')
      .addSelect('cityConfig.timeToExpireTrip', 'timeToExpireTrip')
      .addSelect('user.name', 'nameCustomer')
      .addSelect('FORMAT(user.rating, 2)+0', 'ratingCustomer')
      .addSelect('user.quantityTrips', 'quantityTripsCustomer')
      .addSelect('trip.haveReturn', 'haveReturn')
      .addSelect('turbochargedPrice.id', 'turbochargedPrice')

      .innerJoin('driverCalled.trip', 'trip')
      .innerJoin('trip.tripPaymentForm', 'tripPaymentForm')
      .innerJoin('trip.zone', 'zone')
      .innerJoin('trip.origin', 'origin')
      .innerJoin('trip.destination', 'destination')
      .innerJoin('trip.tripType', 'tripType')
      .innerJoin('trip.user', 'user')
      .innerJoin('cityConfig', 'cityConfig', 'cityConfig.cityId = trip.cityId')
      .innerJoin('config', 'config', 'config.key = :linkStoragePicture', {
        linkStoragePicture: 'link_storage_pictures',
      })
      .leftJoin(
        'turbochargedPrice',
        'turbochargedPrice',
        'turbochargedPrice.idTrip = trip.idTrip',
      )

      .leftJoin('customer', 'customer', 'trip.user.idUser = customer.userId')
      .leftJoin('trip.rewardTrip', 'rewardTrip')
      .leftJoin('rewardTrip.rewardTripType', 'rewardTripType')

      .where('(trip.status = :status OR trip.status = :status2)', {
        status: 'searching',
        status2: 'searching_favorite',
      })
      .andWhere('driverCalled.driverId = :driverId', { driverId })
      .andWhere('driverCalled.status <> :driverCalledStatus', {
        driverCalledStatus: 'refused',
      })
      .groupBy('driverCalled.tripReference')

      .setParameter(
        'now',
        new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      )
      .setParameter('tripTypePath', 'tripType/');

    if (listTripsDenied.length) {
      query.andWhere('trip.tripReference NOT IN (:listTripsDenied)', {
        listTripsDenied: listTripsDenied.join(','),
      });
    }

    return query.getRawOne<SearchTripQuery>();
  }
}
