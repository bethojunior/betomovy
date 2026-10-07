<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 22:02
 */

namespace App\Services\Trip;


use App\Constants\StatusConst;
use App\Exceptions\Trip\TripTypeException;
use App\Models\Trip\TripType;
use App\Repositories\CallGroup\CallGroupsTripTypeLinkedRepository;
use App\Repositories\Locale\CityRepository;
use App\Repositories\Price\PriceRepository;
use App\Repositories\Trip\TripTypeRepository;
use App\Repositories\AppPartners\TripTypePartnerLinkedRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class TripTypeService
{
    /**
     * @var TripTypeRepository|Model
     */
    private $repository;
    /**
     * @var PriceRepository
     */
    private $priceRepository;
    private $cityRepository;
    private $tripTypePartnerLinkedRepository;
    private $callGroupsTripTypeLinkedRepository;

    public function __construct(
        TripTypeRepository $repository,
        CityRepository $cityRepository,
        PriceRepository $priceRepository,
        TripTypePartnerLinkedRepository $tripTypePartnerLinkedRepository,
        CallGroupsTripTypeLinkedRepository $callGroupsTripTypeLinkedRepository
    ) {
        $this->repository = $repository;
        $this->cityRepository = $cityRepository;
        $this->priceRepository = $priceRepository;
        $this->tripTypePartnerLinkedRepository = $tripTypePartnerLinkedRepository;
        $this->callGroupsTripTypeLinkedRepository = $callGroupsTripTypeLinkedRepository;
    }

    public function all()
    {
        return $this->repository->findAll();
    }

    /**
     * @param array $request
     * @return TripType
     * @throws TripTypeException
     */
    public function insert(array $request): TripType
    {
        DB::beginTransaction();
        try {
            $tripType = new TripType($request);
            $tripType->order = 1;

            $picture = \Storage::cloud()
                ->putFile('tripType', $request['picture']);

            if (!$picture)
                throw new TripTypeException('Ocorreu um erro ao fazer upload da foto');

            $tripType->picture = explode('/', $picture)[1];

            $this->repository->save($tripType);

            DB::commit();

            return $tripType;
        } catch (\Exception $error) {
            DB::rollBack();
            throw $error;
        }
    }

    private function saveCallGroups(array $listCallGroups, $idTripType)
    {
        $existingCallGroup = $this->callGroupsTripTypeLinkedRepository
            ->getCallGroupByTripTypeId($idTripType)
            ->pluck('call_group_id')
            ->toArray();

        if (!empty($listCallGroups)) {
            foreach ($listCallGroups as $idCallGroup) {
                $responseCallGroups = $this->callGroupsTripTypeLinkedRepository->findCallGroupByIdAndTripType($idCallGroup, $idTripType);

                if (empty($responseCallGroups)) {
                    $this->callGroupsTripTypeLinkedRepository->create([
                        'tripTypeId' => $idTripType,
                        'call_group_id' => $idCallGroup
                    ]);
                }
            }
        }

        $callGroupsToDelete = array_diff($existingCallGroup, $listCallGroups);

        if (!empty($callGroupsToDelete)) {
            $this->callGroupsTripTypeLinkedRepository->removeCallGroups($idTripType, $callGroupsToDelete);
        }
    }


    private function saveAppPartners(array $listAppPartners, $idTripType)
    {
        $existingAppPartners = $this->tripTypePartnerLinkedRepository
            ->getAppPartnersByTripTypeId($idTripType)
            ->pluck('config_apps_partners_id')
            ->toArray();

        if (!empty($listAppPartners)) {
            foreach ($listAppPartners as $appPartner) {
                $responseAppPartner = $this->tripTypePartnerLinkedRepository->findTripTypeById($appPartner, $idTripType);

                if (empty($responseAppPartner)) {
                    $this->tripTypePartnerLinkedRepository->create([
                        'tripTypePartnerId' => $idTripType,
                        'config_apps_partners_id' => $appPartner
                    ]);
                }
            }
        }

        $partnersToDelete = array_diff($existingAppPartners, $listAppPartners);

        if (!empty($partnersToDelete)) {
            $this->tripTypePartnerLinkedRepository->removeAppsPartnersByTripTypeId($idTripType, $partnersToDelete);
        }
    }

    /**
     * @param TripType $tripType
     * @param array $request
     * @return TripType
     * @throws TripTypeException
     */
    public function update(TripType $tripType, array $request): TripType
    {
        DB::beginTransaction();
        try {
            $tripType->fill($request);
            $listAppPartners = $request['idsAppPartners'] ?? [];
            $listCallGroups = $request['idsCallGroups'] ?? [];

            $this->saveCallGroups($listCallGroups, $tripType->idTripType);
            $this->saveAppPartners($listAppPartners, $tripType->idTripType);

            if (isset($request['picture']) && $request['picture'] instanceof UploadedFile) {
                $picture = \Storage::cloud()
                    ->putFile('tripType', $request['picture']);

                if (!$picture)
                    throw new TripTypeException('Ocorreu um erro ao fazer upload da foto');

                $tripType->picture = explode('/', $picture)[1];
            }

            $tripType->load([
                "tripTypePartnerLinked" => function ($query) use ($listAppPartners) {
                    $query->whereIn("config_apps_partners_id", $listAppPartners);
                },
                "callGroupsTripTypeLinked" => function ($query) use ($listCallGroups) {
                    $query->whereIn("call_group_id", $listCallGroups);
                }
            ]);


            $tripType->save();
            DB::commit();
            return $tripType;
        } catch (\Exception $error) {
            DB::rollBack();
            throw $error;
        }

        $tripType->load([
            "callGroupsTripTypeLinked" => function ($query) use ($listCallGroups) {
                $query->whereIn("call_group_id", $listCallGroups);
            }
        ]);

        $tripType->save();

        return $tripType;
    }

    /**
     * @param int $id
     * @return bool
     * @throws \Exception
     */
    public function delete(int $id): bool
    {
        DB::beginTransaction();
        try {
            /** @var TripType $tripType */
            $tripType = $this->repository->find($id);
            $tripType
                ->statusId = StatusConst::REMOVED;
            $this->repository->save($tripType);

            $this->priceRepository
                ->disableByTripType($tripType->idTripType);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return true;
    }

    public function getAppsPartnersLinked($tripTypeId)
    {
        return $this->tripTypePartnerLinkedRepository->getAppsPartnersByTripTypeId($tripTypeId);
    }

    public function removeAppsPartnersLinked(int $tripTypeId, array $appsPartnersLinked)
    {
        DB::beginTransaction();
        try {
            $listAppPartners = $appsPartnersLinked['idsAppPartners'] ?? [];
            $result = $this->tripTypePartnerLinkedRepository->removeAppsPartnersByTripTypeId($tripTypeId, $listAppPartners);

            DB::commit();

            return $result;
        } catch (\Exception $error) {
            DB::rollBack();
            throw $error;
        }
    }
}
