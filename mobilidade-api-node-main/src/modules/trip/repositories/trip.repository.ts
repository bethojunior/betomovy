import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DriverNetTripPriceQuery,
  SearchTripQuery,
} from 'src/@types/modules/driver/driverResponse';
import { Equal, In, IsNull, Or, Repository } from 'typeorm';
import { Trip } from '../entities';

@Injectable()
export class TripRepository {
  constructor(
    @InjectRepository(Trip)
    private repository: Repository<Trip>,
  ) {}

  async findDriverNetPrice(tripReference: string): Promise<DriverNetTripPriceQuery> {
    return this.repository
      .createQueryBuilder('trip')
      .select('trip.price')
      .addSelect(
        `
        if(
          (dC.valueType = '$'),
            round(
              (
                trip.price - 
                ifnull(
                  round(bfof.value, 2), round(dC.value, 2)
              ) - ifnull(round(bfpf.value, 2), 0)
          ),
          2
        ),
            round(
              (
                trip.price - 
                ifnull(
                  round(bfof.value, 2),
                  round(trip.price * (dC.value / 100), 2)
              ) - 
              ifnull(
                round(bfpf.value, 2),
                0
                )
            ),
            2
          )
        )
        `,
        'driverValue',
      )
      .leftJoin(
        'driverCommission',
        'dC',
        'trip.driverCommissionId = dC.idDriverCommission',
      )
      .leftJoin(
        'balanceFlow',
        'bfpf',
        'bfpf.balanceFlowTypeId = :balanceFlowTypeId1 and bfpf.tripReference = trip.tripReference',
        { balanceFlowTypeId1: 43 },
      )
      .leftJoin(
        'balanceFlow',
        'bfof',
        'bfof.balanceFlowTypeId = :balanceFlowTypeId2 and bfof.tripReference = trip.tripReference',
        { balanceFlowTypeId2: 8 },
      )
      .where('trip.tripReference = :tripReference', { tripReference })
      .getRawOne();
  }

  async findByTripReference(
    tripReference: string,
    listTripsDenied: string[],
    driverId: number,
  ): Promise<SearchTripQuery> {
    const query = this.repository
      .createQueryBuilder('trip')
      .select('trip.idTrip', 'idTrip')
      .addSelect('trip.tripReference', 'tripReference')
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
      .addSelect('trip.tripTypeId', 'tripTypeId')
      .addSelect('trip.cityId', 'cityId')
      .addSelect('trip.aditionalInfo', 'aditionalInfo')
      .addSelect('trip.flow', 'flow')
      .addSelect('trip.haveReturn', 'haveReturn')
      .addSelect('origin.address', 'startAddress')
      .addSelect('origin.latitude', 'startLatitude')
      .addSelect('origin.longitude', 'startLongitude')
      .addSelect('destination.address', 'endAddress')
      .addSelect('destination.latitude', 'endLatitude')
      .addSelect('destination.longitude', 'endLongitude')
      .addSelect('tripPaymentForm.name', 'tripPaymentForm')
      .addSelect('tripPaymentForm.paymentFormTypeId', 'paymentFormTypeId')
      .addSelect('customer.profileImage', 'customerImage')
      .addSelect('user.quantityTrips', 'quantityTripsCustomer')
      .addSelect('user.name', 'nameCustomer')
      .addSelect('FORMAT(user.rating, 2)+0', 'ratingCustomer')
      .addSelect('tripType.type', 'type')
      .addSelect(
        'CONCAT(config.value, :tripTypePath, tripType.picture)',
        'tripTypePicture',
      )

      .innerJoin('trip.tripPaymentForm', 'tripPaymentForm')
      .innerJoin('trip.origin', 'origin')
      .innerJoin('trip.destination', 'destination')
      .innerJoin('trip.tripType', 'tripType')
      .innerJoin('trip.user', 'user')
      .innerJoin('config', 'config', 'config.key = :linkStoragePicture', {
        linkStoragePicture: 'link_storage_pictures',
      })

      .leftJoin('customer', 'customer', 'trip.user.idUser = customer.userId')

      .where('trip.tripReference = :tripReference', { tripReference })
      .andWhere('(trip.status = :status OR trip.status = :status2)', {
        status: 'searching',
        status2: 'searching_favorite',
      })

      .setParameter('tripTypePath', 'tripType/')
      .setParameter('callingDriver', driverId);

    if (listTripsDenied.length) {
      query.andWhere('trip.tripReference NOT IN (:listTripsDenied)', {
        listTripsDenied: listTripsDenied.join(','),
      });
    }

    return query.getRawOne<SearchTripQuery>();
  }

  getTripOff(tripReference: string): Promise<Trip | null> {
    return this.repository.findOne({
      select: ['userId', 'driverId', 'status', 'canceledBy', 'tripReference'],
      where: {
        tripReference: tripReference,
        status: In(['canceled', 'finished', 'not_answered', 'back_off']),
        canceledBy: Or(Equal('customer'), IsNull()),
      },
    });
  }

  async findTripCompleteByTripReferenceRaw(tripReference: string): Promise<any> {
    const result = await this.repository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .leftJoinAndSelect('trip.tripType', 'tripType')
      .leftJoin('trip.tripPaymentForm', 'tripPaymentForm')
      .leftJoinAndSelect('trip.zone', 'zone')
      .leftJoinAndSelect('trip.rewardTrip', 'rewardTrip')
      .leftJoinAndSelect('trip.user', 'user')
      .leftJoinAndSelect('trip.tripWayPoints', 'tripWayPoints')
      .leftJoinAndSelect('trip.driverCommission', 'driverCommission')
      .leftJoinAndSelect('trip.driverCalleds', 'driversCalled')
      .addSelect('tripPaymentForm.name', 'trip_payment_form_name')
      .addSelect('trip.price', 'trip_price')
      .addSelect('trip.priceId', 'trip_priceId')
      .addSelect('trip.date', 'trip_date')
      .addSelect('trip.endDate', 'trip_endDate')
      .addSelect('trip.distance', 'trip_distance')
      .addSelect('trip.estimatedTripTime', 'trip_estimatedTripTime')
      .addSelect('trip.multiplierDynamic', 'trip_multiplierDynamic')
      .addSelect('trip.callingDriver', 'trip_callingDriver')
      .addSelect('trip.cityId', 'trip_cityId')
      .addSelect('trip.aditionalInfo', 'trip_aditionalInfo')
      .addSelect('trip.flow', 'trip_flow')
      .addSelect('trip.haveReturn', 'trip_haveReturn')
      .where('trip.tripReference = :tripReference', { tripReference })
      .getRawAndEntities();

    if (!result.entities || result.entities.length === 0) {
      return null;
    }

    const trip = result.entities[0] as any;
    const raw = result.raw[0];

    if (raw) {
      trip.price = raw.trip_price;
      trip.priceId = raw.trip_priceId;
      trip.date = raw.trip_date;
      trip.endDate = raw.trip_endDate;
      trip.distance = raw.trip_distance;
      trip.estimatedTripTime = raw.trip_estimatedTripTime;
      trip.multiplierDynamic = raw.trip_multiplierDynamic;
      trip.callingDriver = raw.trip_callingDriver;
      trip.cityId = raw.trip_cityId;
      trip.aditionalInfo = raw.trip_aditionalInfo;
      trip.flow = raw.trip_flow;
      trip.haveReturn = raw.trip_haveReturn;
      trip.tripPaymentForm = raw.trip_payment_form_name;
    }

    return trip;
  }
}
