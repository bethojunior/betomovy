<?php

namespace app\services\Adquirer;

use app\dao\DriverDao;
use app\services\AcquirerService;
use app\utils\Headers;

/**
 * @deprecated Use AcquirerService instead
 */
class AdquirerService
{
    private $driverDao;
    private $acquirerService;

    public function __construct()
    {
        $this->driverDao = new DriverDao();
        $this->acquirerService = new AcquirerService();
    }

    /**
    * @deprecated Use AcquirerService getActiveAcquirerData instead
    */
    public function currentAdquirer()
    {
        $user = $this->driverDao->findByUserId(Headers::getUserId());

        $id = $this->acquirerService->getActiveAcquirerId(null, $user->cityId);
        return (new \app\dao\FinancialIntermediaryDao())->find($id);
    }
}
