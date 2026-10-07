<?php


namespace App\Services\Advertising;


use App\Constants\StatusConst;
use App\Exceptions\Advertising\AdvertisingLimitException;
use App\Models\Advertising\Advertising;
use App\Models\Company\Company;
use App\Repositories\Advertising\AdvertisingRepository;
use App\Repositories\Company\CompanyRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class AdvertisingService
{
    const MAX_ADVERTISING_PER_CITY_AND_APP = 10;

    /**
     * @var AdvertisingRepository
     */
    private $repository;
    /**
     * @var CompanyRepository
     */
    private $companyRepository;

    public function __construct(AdvertisingRepository $repository, CompanyRepository $companyRepository)
    {
        $this->repository = $repository;
        $this->companyRepository = $companyRepository;
    }

    /**
     * @param array $request
     * @return Advertising
     * @throws \Exception
     */
    public function insert(array $request)
    {
        $activeCount = $this->repository
            ->countByCityAndApp($request['cityId'], $request['appId']);

        if ($activeCount >= self::MAX_ADVERTISING_PER_CITY_AND_APP) {
            throw new AdvertisingLimitException(
                "Limite de " . self::MAX_ADVERTISING_PER_CITY_AND_APP . " publicidades atingido para esta cidade e aplicativo"
            );
        }

        $advertising = new Advertising($request);

        /** @var Company $company */
        $company = $this->companyRepository
            ->find($request['companyId']);

        try {
            \DB::beginTransaction();

            if (isset($request['thumbnail']))
                $advertising->thumbnail = $this->uploadImage($request['thumbnail'], $company);

            if (isset($request['banner']))
                $advertising->banner = $this->uploadImage($request['banner'], $company);

            $this->repository
                ->save($advertising);

            \DB::commit();

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $advertising;
    }

    public function findAll(array $request)
    {
        $result = $this->repository
            ->findAll($request);

        return $result->isEmpty() ? null : $result;
    }

    public function show($id)
    {
        return $this->repository
            ->show($id);
    }

    public function update($id, array $request)
    {
        /** @var Advertising $advertising */
        $advertising = $this->repository
            ->find($id);

        DB::beginTransaction();

        try {
            if (isset($request['thumbnail'])) {
                $advertising->thumbnail = $this->uploadImage($request['thumbnail'], $advertising->company);
            }

            if (isset($request['banner'])) {
                $advertising->banner = $this->uploadImage($request['banner'], $advertising->company);
            }

            $advertising->description = $request['description'] ?? $advertising->description;
            $advertising->link = $request['link'] ?? $advertising->link;
            $advertising->dateStart = $request['dateStart'] ?? $advertising->dateStart;
            $advertising->dateEnd = $request['dateEnd'] ?? $advertising->dateEnd;
            $advertising->emailInformation = $request['emailInformation'] ?? $advertising->emailInformation;
            $advertising->emailRedirect = $request['emailRedirect'] ?? $advertising->emailRedirect;
            $advertising->companyId = $request['companyId'] ?? $advertising->companyId;
            $advertising->cityId = $request['cityId'] ?? $advertising->cityId;
            $advertising->amountOfTime = $request['amountOfTime'] ?? $advertising->amountOfTime;
            $advertising->advertisingAppSiteId = $request['advertisingAppSiteId'] ?? $advertising->advertisingAppSiteId;
            $advertising->appId = $request['appId'] ?? $advertising->appId;
            $advertising->genderId = $request['genderId'] ?? $advertising->genderId;

            $this->repository
                ->save($advertising);

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();

            throw $e;
        }

        return $advertising;
    }

    public function updateStatus($id, int $statusId = StatusConst::ACTIVE)
    {
        $advertising = $this->repository->find($id);

        $advertising->statusId = $statusId;

        $this->repository->save($advertising);

        return $advertising;
    }

    public function delete($id)
    {
        $advertising = $this->repository->find($id);

        $advertising->statusId = StatusConst::REMOVED;

        $this->repository->save($advertising);

        return true;
    }

    public function updateOrder(array $orders): bool
    {
        return $this->repository->updateOrder($orders);
    }

    private function uploadImage(UploadedFile $file, Company $company)
    {
        return \Storage::cloud()
            ->putFile("publicity/{$company->id}", $file, 'public');
    }
}
