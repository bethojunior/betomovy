<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/09/2019
 * Time: 11:00
 */

namespace App\Services\Monetization;


use App\Constants\StatusConst;
use App\Models\Monetization\ReferralMonetization;
use App\Repositories\Monetization\ReferralMonetizationRepository;
use App\Repositories\Monetization\ReferralMonetizationTripTypeRepository;
use App\Repositories\Trip\TripTypeRepository;

class ReferralMonetizationService
{
    /**
     * @var ReferralMonetizationRepository
     */
    private $repository;
    /**
     * @var ReferralMonetizationTripTypeRepository
     */
    private $monetizationTripTypeRepository;
    private $tripTypeRepository;

    public function __construct(ReferralMonetizationRepository $repository,
                                ReferralMonetizationTripTypeRepository $monetizationTripTypeRepository,
                                TripTypeRepository $tripTypeRepository)
    {
        $this->repository = $repository;
        $this->monetizationTripTypeRepository = $monetizationTripTypeRepository;
        $this->tripTypeRepository = $tripTypeRepository;
    }

    /**
     * @param $request
     * @return ReferralMonetization
     * @throws \Exception
     */
    public function insert($request)
    {
        try {
            \DB::beginTransaction();

            $referralMonetization = new ReferralMonetization($request);

            $this->repository->save($referralMonetization);

            $this->attachTripTypes($referralMonetization, $request['tripTypes']);

            \DB::commit();

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $referralMonetization;
    }

    /**
     * @return ReferralMonetizationRepository[]|\Illuminate\Database\Eloquent\Collection
     */
    public function findAll(array $request)
    {
        return $this->repository
            ->findAll($request);
    }

    /**
     * @param $id
     * @param array $request
     * @return ReferralMonetization
     * @throws \Exception
     */
    public function update($id, array $request)
    {
        $this->delete($id);

        return $this->insert($request);
    }

    /**
     * @param $id
     * @return bool
     */
    public function delete($id)
    {
        /** @var ReferralMonetization $referralMonetization */
        $referralMonetization = $this->repository
            ->find($id);

        $referralMonetization->statusId = StatusConst::REMOVED;
        $this->repository
            ->save($referralMonetization);

        return true;
    }

    private function attachTripTypes(ReferralMonetization $referralMonetization, $tripTypes)
    {
        if ($tripTypes[0]['tripTypeId'] == null) {

            $allTripTypes = $this->tripTypeRepository->findAll()->toArray();
            $monetizationTripTypes = [];

            foreach ($allTripTypes as $item) {
                foreach ($tripTypes as $tripType) {
                    $tripType['tripTypeId'] = $item['idTripType'];
                    $tripType['referralMonetizationId'] = $referralMonetization->id;
                    $monetizationTripTypes[] = $tripType;
                }
            }

            $this->monetizationTripTypeRepository->createMany($monetizationTripTypes);
        } else {
            $this->monetizationTripTypeRepository
                ->createMany(array_map(function ($tripType) use ($referralMonetization) {
                    $tripType['referralMonetizationId'] = $referralMonetization->id;

                    return $tripType;
                }, $tripTypes));
        }
    }
}
