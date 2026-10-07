<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/12/2019
 * Time: 16:29
 */

namespace App\Services\Config;


use App\Constants\StatusConst;
use App\Models\Central\Price;
use App\Models\Config\CityConfig;
use App\Models\Price\Dynamic\PriceDynamic;
use App\Models\Price\Dynamic\PriceDynamicScheduled;
use App\Models\Price\Range\PriceRange;
use App\Models\Trip\DriverCommission;
use App\Models\Trip\DriverCommissionAnotherFee;
use App\Models\Trip\DriverCommissionPaymentForm;
use App\Models\Trip\Zone;
use App\Models\User\Driver;
use App\Repositories\Central\PriceRepository;
use App\Repositories\CityConfig\CityConfigRepository;
use App\Repositories\Locale\CityRepository;
use App\Repositories\Price\Dynamic\PriceDynamicRepository;
use App\Repositories\Price\Dynamic\PriceDynamicScheduledRepository;
use App\Repositories\Price\Range\PriceRangeRepository;
use App\Repositories\Trip\DriverCommissionAnotherFeeRepository;
use App\Repositories\Trip\DriverCommissionPaymentFormRepository;
use App\Repositories\Trip\DriverCommissionRepository;
use App\Repositories\Trip\ZoneRepository;
use App\Utils\Admin704Apps\Admin704Apps;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class CityMirroringService
{
    /**
     * @var PriceRepository
     */
    private $priceRepository;
    /**
     * @var ZoneRepository
     */
    private $zoneRepository;
    /**
     * @var CityConfigRepository
     */
    private $cityConfigRepository;
    /**
     * @var DriverCommissionRepository
     */
    private $driverCommissionRepository;
    /**
     * @var PriceDynamicRepository
     */
    private $priceDynamicRepository;
    /**
     * @var PriceDynamicScheduledRepository
     */
    private $priceDynamicScheduledRepository;
    /**
     * @var PriceRangeRepository
     */
    private $priceRangeRepository;
    /**
     * @var DriverCommissionAnotherFeeRepository
     */
    private $driverCommissionAnotherFeeRepository;
    /**
     * @var DriverCommissionPaymentFormRepository
     */
    private $driverCommissionPaymentFormRepository;
    private $admin704Apps;
    private $cityRepository;

    public function __construct(ZoneRepository $zoneRepository,
                                PriceRepository $priceRepository,
                                CityConfigRepository $cityConfigRepository,
                                DriverCommissionRepository $driverCommissionRepository,
                                PriceDynamicRepository $priceDynamicRepository,
                                PriceDynamicScheduledRepository $priceDynamicScheduledRepository,
                                PriceRangeRepository $priceRangeRepository,
                                DriverCommissionAnotherFeeRepository $driverCommissionAnotherFeeRepository,
                                DriverCommissionPaymentFormRepository $driverCommissionPaymentFormRepository,
                                CityRepository $cityRepository,
                                Admin704Apps $admin704Apps)
    {
        $this->zoneRepository = $zoneRepository;
        $this->priceRepository = $priceRepository;
        $this->cityConfigRepository = $cityConfigRepository;
        $this->driverCommissionRepository = $driverCommissionRepository;
        $this->priceDynamicRepository = $priceDynamicRepository;
        $this->priceDynamicScheduledRepository = $priceDynamicScheduledRepository;
        $this->priceRangeRepository = $priceRangeRepository;
        $this->driverCommissionAnotherFeeRepository = $driverCommissionAnotherFeeRepository;
        $this->driverCommissionPaymentFormRepository = $driverCommissionPaymentFormRepository;
        $this->admin704Apps = $admin704Apps;
        $this->cityRepository = $cityRepository;
    }

    /**
     * @param array $request
     * @return bool
     * @throws \Exception
     */
    public function mirror(array $request)
    {
        $cityMirrorId = $request['cityMirrorId'];
        $mirroringCityId = $request['mirroringCityId'];

        $findCityIdInLocale = $this->cityRepository->findCityIdByNameAndEstate($request['nome'], $request['estado']);

        if (!is_null($findCityIdInLocale)) {
            $mirroringCityId = $findCityIdInLocale[0]->id;
        }

        try {
            \DB::beginTransaction();

            $this->mirrorObject(
                $cityMirrorId, $mirroringCityId, new Zone, false, 'idZone', 'created_at', 'updated_at');
            $this->mirrorObject(
                $cityMirrorId, $mirroringCityId, new CityConfig, true, 'idCityConfig');
            $this->mirrorCollection(
                $cityMirrorId, $mirroringCityId, new Price, 'id', 'created_at', 'updated_at');
            $this->mirrorCollection(
                $cityMirrorId, $mirroringCityId, new DriverCommission, 'idDriverCommission', 'created_at', 'updated_at');
            $this->mirrorCollection(
                $cityMirrorId, $mirroringCityId, new PriceDynamic, 'idPriceDynamic');
            $this->mirrorCollection(
                $cityMirrorId, $mirroringCityId, new PriceDynamicScheduled, 'id');
            $this->mirrorCollection(
                $cityMirrorId, $mirroringCityId, new PriceRange, 'id', 'created_at', 'updated_at');

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        $this->forgetCityCache();

        return true;
    }

    private function mirrorObject(
        int $cityMirrorId, int $mirroringCityId, Model $newModel, bool $realDelete, ...$hiddenParams)
    {
        $classDir = explode('\\', $newModel->getMorphClass());
        $repository = lcfirst(end($classDir)) . 'Repository';

        /** @var Model $mirror */
        $mirror = $this->$repository
            ->findByCity($cityMirrorId);

        $mirroringExists = $this->$repository
            ->findByCity($mirroringCityId);

        if ($mirroringExists) {
            if ($realDelete) {
                $this->$repository
                    ->delete($mirroringExists);
            } else {
                $mirroringExists->statusId = StatusConst::REMOVED;

                $this->$repository->save($mirroringExists);
            }
        }

        $mirror->makeHidden($hiddenParams);
        $data = $mirror->toArray();

        $newModel->fill($data);
        $newModel->cityId = $mirroringCityId;

        if ($newModel instanceof CityConfig)
            $newModel->enabledDriverFields = json_decode($mirror->enabledDriverFields);

        $this->$repository->save($newModel);
    }

    private function mirrorCollection(
        int $cityMirrorId, int $mirroringCityId, Model $newModel, ...$hiddenParams)
    {
        $classDir = explode('\\', $newModel->getMorphClass());
        $repository = lcfirst(end($classDir)) . 'Repository';

        /** @var Collection $mirrors */
        $mirrors = $this->$repository
            ->findByCity($cityMirrorId);

        $this->$repository
            ->disableInCity($mirroringCityId);

        $mirrors
            ->map(function (Model $mirror) use ($mirroringCityId, $newModel, $repository, $hiddenParams) {
                $mirror->makeHidden($hiddenParams);

                $data = $mirror->toArray();

                $newModel = new $newModel($data);
                $newModel->cityId = $mirroringCityId;

                $this->$repository->save($newModel);

                if ($mirror instanceof DriverCommission &&
                    $newModel instanceof DriverCommission)
                    $this->mirrorDriverCommission($mirror, $newModel);
            });
    }

    private function mirrorDriverCommission(DriverCommission $mirrorDriverCommission, DriverCommission $newCommission)
    {
        $mirrorDriverCommissionAnotherFee = $this->driverCommissionAnotherFeeRepository
            ->findByDriverCommission($mirrorDriverCommission->idDriverCommission);

        if ($mirrorDriverCommissionAnotherFee) {
            $mirrorDriverCommissionAnotherFee->makeHidden('id');

            $data = $mirrorDriverCommissionAnotherFee->toArray();

            $driverCommissionAnotherFee = new DriverCommissionAnotherFee($data);
            $driverCommissionAnotherFee->driverCommissionId = $newCommission->idDriverCommission;

            $this->driverCommissionAnotherFeeRepository->save($driverCommissionAnotherFee);
        }

        $driverCommissionsPaymentForm = $this->driverCommissionPaymentFormRepository
            ->findByDriverCommission($mirrorDriverCommission->idDriverCommission);

        $driverCommissionsPaymentForm
            ->map(function (DriverCommissionPaymentForm $mirrorDriverCommissionPaymentForm) use ($newCommission) {
                $mirrorDriverCommissionPaymentForm->makeHidden('id');

                $data = $mirrorDriverCommissionPaymentForm->toArray();

                $driverCommissionPaymentForm = new DriverCommissionPaymentForm($data);
                $driverCommissionPaymentForm->driverCommissionId = $newCommission->idDriverCommission;

                $this->driverCommissionPaymentFormRepository->save($driverCommissionPaymentForm);
            });
    }

    private function forgetCityCache(): void
    {
        Cache::forget('city:actives');
        Cache::forget('city:actives:fully');
    }
}
