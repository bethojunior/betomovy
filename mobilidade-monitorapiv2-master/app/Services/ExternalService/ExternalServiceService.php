<?php


namespace App\Services\ExternalService;


use App\Constants\Config\ExternalServiceActionConst;
use App\Constants\Config\ExternalServiceTypeConst;
use App\Models\ExternalService\ExternalService;
use App\Models\ExternalService\ExternalServiceMetaDataCity;
use App\Repositories\ExternalService\ExternalServiceMetaDataRepository;
use App\Repositories\ExternalService\ExternalServiceRepository;
use App\Utils\Sms;

class ExternalServiceService
{
    private $repository;
    private $externalServiceMetaDataRepository;

    public function __construct(ExternalServiceRepository $repository, ExternalServiceMetaDataRepository $externalServiceMetaDataRepository)
    {
        $this->repository = $repository;
        $this->externalServiceMetaDataRepository = $externalServiceMetaDataRepository;
    }

    public function findAllTypeSms(array $request = [], int $cityId = null)
    {
        return $this->repository->findAllByType(ExternalServiceTypeConst::SMS, $request);
    }

    public function findAllTypeSmsByCity(int $cityId, array $request = [])
    {
        return $this->repository->findAllByTypeAndCity(ExternalServiceTypeConst::SMS, $cityId, $request);
    }

    public function findAllTypeCriminalRecordByCity(int $cityId, array $request = [])
    {
        return $this->repository->findAllByTypeAndCity(ExternalServiceTypeConst::CRIMINAL_RECORD, $cityId, $request);
    }

    public function update(ExternalService $externalService, array $data)
    {
        \DB::beginTransaction();

        try {
            $this->repository->disableAllByType($externalService->externalServiceTypeId);
            $externalService->update(['active' => true]);

            foreach ($data['metadata'] as $item) {
                $this->externalServiceMetaDataRepository
                    ->updateValueByKey($item['key'], $item['value'] ?? '');
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $externalService;
    }

    public function updateByCity(ExternalService $externalService, array $data, int $cityId): array
    {
        \DB::beginTransaction();

        try {
            $externalServices = [];
            $this->repository->deleteAllByTypeAndCity($externalService->externalServiceTypeId, $cityId);

            foreach ($data['metadata'] as $item) {
                if (!str_contains($item['key'], 'bkp') && !$item['value']) throw new \Exception('campo \'value\' é requerido');
                $externalServices[] = ExternalServiceMetaDataCity::create([
                    'externalServiceMetaDataId' => $this->externalServiceMetaDataRepository->findByKey($item['key'])->id,
                    'value' => $item['value'],
                    'cityId' => $cityId
                ]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $externalServices;
    }

    public function sendSmsTest(array $request)
    {
        $sms = new Sms($request['phone'], 'Teste de envio de sms');
        return $sms->send(
            ExternalServiceActionConst::CONFIRMATION_MESSAGE_CUSTOMER_REGISTER);
    }
}
