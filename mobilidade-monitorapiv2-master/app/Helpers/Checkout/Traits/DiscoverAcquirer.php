<?php

namespace App\Helpers\Checkout\Traits;

use App\Constants\Acquirer\Acquirer;
use App\Contracts\Checkout\CheckoutInterface;
use App\Exceptions\Checkout\CheckoutException;
use App\Repositories\FinancialIntermediary\AcquirerMetaDataRepository;
use App\Repositories\FinancialIntermediary\FinancialIntermediaryRepository;
use App\Utils\Pay704\Checkout704Pay;

trait DiscoverAcquirer
{
    private FinancialIntermediaryRepository $financialIntermediaryRepository;
    private AcquirerMetaDataRepository $acquirerMetaDataRepository;

    public function __construct(
        FinancialIntermediaryRepository $financialIntermediaryRepository,
        AcquirerMetaDataRepository $acquirerMetaDataRepository
    )
    {
        $this->financialIntermediaryRepository = $financialIntermediaryRepository;
        $this->acquirerMetaDataRepository      = $acquirerMetaDataRepository;
    }

    /**
     * @param int $intermediary_id
     * @return Checkout704Pay|CheckoutInterface
     * @throws CheckoutException
     */
    protected function getCheckout(int $intermediary_id): CheckoutInterface
    {
        switch ($intermediary_id) {
            case Acquirer::PAY704:
                $keys = $this->acquirerMetaDataRepository->findManyByKeys(
                    '704_pay_api_id',
                    '704_pay_api_secret',
                );
                return new Checkout704Pay(
                    $keys['704_pay_api_id'],
                    $keys['704_pay_api_secret']
                );
            //@TODO: Add the other acquirers here
            default:
                throw new CheckoutException(
                    'Não foi possível identificar o intermediador financeiro para essa operação'
                );
        }
    }
}
