<?php


namespace App\Filters;


use Api\Repositories\Company\CompanyDeliveryOrderConfigRepository;
use App\Repositories\Company\CompanyDeliveryConfigRepository;
use App\Repositories\Config\ConfigRepository;
use JeroenNoten\LaravelAdminLte\Menu\Filters\FilterInterface;

class MenuFilter implements FilterInterface
{
    protected $companyDeliveryOrderConfig;
    protected $typeOfDeliveryArea;

    public function __construct(
        CompanyDeliveryOrderConfigRepository $companyDeliveryOrderConfigRepository,
        ConfigRepository                     $configRepository
    )
    {
        $company = \Auth::user()->companyWorker->company;

        $this->companyDeliveryOrderConfig = $companyDeliveryOrderConfigRepository
            ->findByCompany($company->id);

        $this->typeOfDeliveryArea = $configRepository->findByKey('type_of_delivery_area');
    }

    /**
     * @inheritDoc
     */
    public function transform($item)
    {
        if ($this->typeOfDeliveryArea->value == 'by_area') {
            if (isset($item['url']) && in_array($item['url'], ['config/rate', 'config/deliveryman'])) {
                if (isset($this->companyDeliveryOrderConfig))
                    if ($this->companyDeliveryOrderConfig->callForAll)
                        $item['restricted'] = true;
            }

            if (isset($item['url']) && in_array($item['url'], ['config/zone'])) {
                $item['restricted'] = true;
            }
        }

        if ($this->typeOfDeliveryArea->value == 'by_neighborhood') {
            if (isset($item['url']) && in_array($item['url'], ['config/rate', 'config/deliveryman','config/deliveryArea'])) {
                $item['restricted'] = true;
            }
        }
        return $item;
    }
}
