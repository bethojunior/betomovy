<?php

namespace App\Services\Driver;

use App\Constants\Acquirer\Acquirer;
use App\Contracts\Exception\CustomException;
use App\Exceptions\Driver\DriverAddressNotFoundException;
use App\Exceptions\Driver\DriverBankAccountNotFoundException;
use App\Exceptions\Driver\DriverDateOfBirthNotConfiguredException;
use App\Exceptions\Driver\DriverSplitConfigAlreadyExistsException;
use App\Exceptions\Driver\Pay704NotConfiguredException;
use App\Models\Driver\DriverSplitConfig;
use App\Repositories\FinancialIntermediary\AcquirerMetaDataRepository;
use App\Repositories\User\Driver\DriverSplitConfigRepository;
use App\Repositories\User\DriverRepository;
use App\Utils\Pay704\Checkout704Pay;
use App\Utils\Pay704\Constants\BankAccountTypeConst;
use App\Utils\Pay704\Constants\CnaeConst;
use App\Utils\Pay704\Constants\CompanyFormationConst;
use App\Utils\Pay704\Constants\HolderTypeConst;
use App\Utils\Pay704\DTO\AddressDTO;
use App\Utils\Pay704\DTO\BankAccountDTO;
use App\Utils\Pay704\DTO\ContactDTO;
use App\Utils\Pay704\DTO\RepresentativeDTO;
use App\Utils\Pay704\DTO\StoreSubCompanyDTO;

class DriverSplitConfigService
{
    private DriverSplitConfigRepository $repository;
    private DriverRepository $driverRepository;
    private AcquirerMetaDataRepository $acquirerMetaDataRepository;

    public function __construct(
        DriverSplitConfigRepository $repository,
        DriverRepository $driverRepository,
        AcquirerMetaDataRepository $acquirerMetaDataRepository
    )
    {
        $this->repository = $repository;
        $this->driverRepository = $driverRepository;
        $this->acquirerMetaDataRepository = $acquirerMetaDataRepository;
    }

    public function findByDriver(int $driverId): ?DriverSplitConfig
    {
        $driverSplitConfig = $this->repository->findByDriver($driverId);

        if (!$driverSplitConfig) {
            $checkout704Pay = $this->newCheckout704Pay();
            $driver         = $this->driverRepository->findFully($driverId);

            $driverSplitConfigInfo = $checkout704Pay->getCompanyInfo($driver->document);

            if ($driverSplitConfigInfo) {
                $driverSplitConfig = new DriverSplitConfig([
                    'driverId'                => $driverId,
                    'financialIntermediaryId' => Acquirer::PAY704,
                    'externalId'              => $driverSplitConfigInfo->id,
                    'status'                  => $driverSplitConfigInfo->company_status
                ]);
            }
        }

        return $driverSplitConfig;
    }

    /**
     * @throws CustomException
     */
    public function store(int $driverId): DriverSplitConfig
    {
        $checkout704Pay    = $this->newCheckout704Pay();
        $driver = $this->driverRepository->findFully($driverId);

        if ($driver->driverSplitConfig) {
            throw new DriverSplitConfigAlreadyExistsException(
                'Já existe uma configuração de split para este motorista.'
            );
        }

        $driverSplitConfigInfo = $checkout704Pay->getCompanyInfo($driver->document);

        if ($driverSplitConfigInfo) {
            $driverSplitConfig = new DriverSplitConfig([
                'driverId'                => $driverId,
                'financialIntermediaryId' => Acquirer::PAY704,
                'externalId'              => $driverSplitConfigInfo->id,
                'status'                  => $driverSplitConfigInfo->company_status
            ]);

            $this->repository->save($driverSplitConfig);

            return $driverSplitConfig;
        }

        $storeSubCompanyDTO = $this->newStoreSubCompanyDTO($driverId);
        $result             = $checkout704Pay->storeSubCompany($storeSubCompanyDTO);

        /** @var DriverSplitConfig $driverSplitConfig */
        $driverSplitConfig = $this->repository->create([
            'driverId'                => $driverId,
            'financialIntermediaryId' => Acquirer::PAY704,
            'externalId'              => $result->id,
            'status'                  => $result->status
        ]);

        return $driverSplitConfig;
    }

    /**
     * @throws Pay704NotConfiguredException
     */
    private function newCheckout704Pay(): Checkout704Pay
    {
        list(
            '704_pay_api_id'     => $pay704Id,
            '704_pay_api_secret' => $pay704Secret
            ) = $this->acquirerMetaDataRepository->findByKeys([
            '704_pay_api_id',
            '704_pay_api_secret'
        ]);

        if (!$pay704Id || !$pay704Secret) {
            throw new Pay704NotConfiguredException('Suas chaves de API da 704 Pay não estão configuradas.');
        }

        return new Checkout704Pay($pay704Id, $pay704Secret);
    }

    private function newStoreSubCompanyDTO(int $driverId): StoreSubCompanyDTO
    {
        $driver = $this->driverRepository->findFully($driverId);

        if (!$driver->dateOfBirth || $driver->dateOfBirth == '0000-00-00') {
            throw new DriverDateOfBirthNotConfiguredException();
        }

        if (!$driver->driverAddress) {
            throw new DriverAddressNotFoundException();
        }

        if (!$driver->bankAccountId) {
            throw new DriverBankAccountNotFoundException();
        }

        $representativeDTO = new RepresentativeDTO(
            $driver->name,
            $driver->email,
            onlyCharacters($driver->phone),
            onlyCharacters($driver->document),
            $driver->dateOfBirth
        );

        $contactDto = new ContactDTO(
            $driver->name,
            $driver->email,
            onlyCharacters($driver->phone)
        );

        $addressDto = new AddressDTO(
            $driver->driverAddress->zipCode,
            $driver->driverAddress->street,
            $driver->driverAddress->number,
            $driver->driverAddress->neighborhood,
            $driver->driverAddress->city,
            $driver->driverAddress->state,
            $driver->driverAddress->complement
        );

        $bankAccountTypeId = $driver->typeAccount == 'corrente'
            ? BankAccountTypeConst::CORRENTE : BankAccountTypeConst::POUPANCA;

        // remove left 0s from bank number
        $bankNumber = ltrim($driver->bankNumber, '0');

        $bankAccountDto = new BankAccountDTO(
            $bankAccountTypeId,
            $bankNumber,
            $driver->agency,
            $driver->numberAccount,
            $driver->numberAccountDigit,
            HolderTypeConst::PESSOA_FISICA
        );

        return new StoreSubCompanyDTO(
            $driver->name,
            HolderTypeConst::PESSOA_FISICA,
            $driver->name,
            onlyCharacters($driver->document),
            CnaeConst::SERVICO_DE_TRANSPORTE_DE_PASSAGEIROS,
            $driver->dateOfBirth,
            CompanyFormationConst::EMPRESA_INDIVIDUAL_RESP_LIMITADA,
            $representativeDTO,
            $addressDto,
            $contactDto,
            $bankAccountDto
        );
    }
}
