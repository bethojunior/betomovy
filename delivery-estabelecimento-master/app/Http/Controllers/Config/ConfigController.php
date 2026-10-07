<?php

namespace App\Http\Controllers\Config;

use Api\Http\Responses\ApiResponse;
use App\Http\Controllers\Controller;
use App\Repositories\Company\CompanyDeliveryConfigRepository;
use App\Repositories\Company\CompanyDeliveryRateRepository;
use App\Repositories\Enum\WeekDayRepository;
use App\Repositories\Neighborhood\CompanyDeliveryNeighborhoodRepository;
use App\Repositories\Neighborhood\DeliveryNeighborhoodRepository;
use App\Services\Company\CompanyDeliveryManService;
use App\Services\Company\CompanyDeliveryOrderConfigService;
use App\Services\Company\CompanyOpenHourService;
use App\Services\Company\EstablishmentCategoryDeliveryService;
use App\Services\Company\TypeDeliveryCategoryService;
use App\Services\Config\SettingDeliveryCompanyPixService;
use App\Services\Product\DeliveryCategoryService;
use App\Services\Product\DeliveryProductService;
use Common\Repositories\Config\CompanyDeliveryOrderConfigRepository;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    /**
     * @param DeliveryCategoryService $service
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function createProducts(
        DeliveryCategoryService $service,
        Request $request
    ) {
        $deliveryCategories = $service->findCompanyCategoryWithProducts($request->query->all());

        return view(
            'config.create-product',
            compact('deliveryCategories')
        );
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function createCategory(TypeDeliveryCategoryService $typeDeliveryCategoryService, EstablishmentCategoryDeliveryService $establishmentCategoryDeliveryService)
    {
        $selectedCategories = $establishmentCategoryDeliveryService->findCompany();
        $categories = $typeDeliveryCategoryService->findAll();

        foreach ($categories as $category) {
            foreach ($selectedCategories as $item) {
                if ($category->id == $item->typeDeliveryCategoryId)
                    $category->selected = true;
            }
        }

        return view('config.create-category', compact('categories', 'selectedCategories'));
    }

    public function updateCategory(Request $request, EstablishmentCategoryDeliveryService $service)
    {
        try {
            $service->insert($request->all());
            toast("Categorias atualizadas", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function createClass(DeliveryCategoryService $service)
    {
        $deliveryCategories = $service->findCompanyCategories();

        return view('config.create-class', compact('deliveryCategories'));
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function createOptional()
    {
        return view('config.create-optional');
    }

    /**
     * @param DeliveryNeighborhoodRepository $deliveryNeighborhoodRepository
     * @param CompanyDeliveryNeighborhoodRepository $companyDeliveryNeighborhoodRepository
     * @param CompanyDeliveryConfigRepository $companyDeliveryConfigRepository
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function createZone(
        DeliveryNeighborhoodRepository $deliveryNeighborhoodRepository,
        CompanyDeliveryNeighborhoodRepository $companyDeliveryNeighborhoodRepository,
        CompanyDeliveryConfigRepository $companyDeliveryConfigRepository,
        CompanyDeliveryOrderConfigRepository $companyDeliveryOrderConfigRepository,
        Request $request
    ) {
        $company = \Auth::user()->companyWorker->company;

        $deliveryNeighborhoods = $deliveryNeighborhoodRepository
            ->findAvailableForCompany($company);

        $companyDeliveryNeighborhoods = $companyDeliveryNeighborhoodRepository
            ->findAllByCompany($company->id, $request->query->all());

        $companyDeliveryConfig = $companyDeliveryConfigRepository
            ->findByCompany($company->id);

        $companyDeliveryOrderConfig = $companyDeliveryOrderConfigRepository->findByCompany($company->id);

        return view(
            'config.create-zone',
            compact(
                'deliveryNeighborhoods',
                'companyDeliveryNeighborhoods',
                'companyDeliveryConfig',
                'companyDeliveryOrderConfig'
            )
        );
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function profile(
        CompanyOpenHourService $companyOpenHourService,
        CompanyDeliveryOrderConfigService $companyDeliveryOrderConfigService,
        CompanyDeliveryConfigRepository $companyDeliveryConfigRepository,
        SettingDeliveryCompanyPixService $settingDeliveryCompanyPixService
    ) {
        $company = \Auth::user()->companyWorker->company;

        $weekDays = $companyOpenHourService->findByCompany();
        $companyDeliveryOrderConfig = $companyDeliveryOrderConfigService->findByCompany();
        $companyDeliveryConfig = $companyDeliveryConfigRepository
            ->findByCompany($company->id);
        $settingDeliveryCompanyPix = $settingDeliveryCompanyPixService->findByCompany($company->id);
        $user = \Auth::user();

        return view('config.profile', compact('weekDays', 'companyDeliveryOrderConfig', 'user', 'companyDeliveryConfig', 'settingDeliveryCompanyPix'));
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function financial()
    {
        return view('config.financial');
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function report()
    {
        return view('config.report');
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function advanced()
    {
        return view('config.advanced');
    }

    public function address()
    {
        return view('config.address');
    }

    public function rate(CompanyDeliveryRateRepository  $repository)
    {
        $companyWorker = \Auth::user()->companyWorker;

        $rates =  $repository
            ->findByCompany($companyWorker->companyId);

        return view('config.rate', compact('rates'));
    }

    public function deliveryArea()
    {
        return view('config.delivery-area');
    }

    /**
     * @param CompanyDeliveryManService $service
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function deliveryman(CompanyDeliveryManService $service)
    {
        $listDeliveryMan = $service->findDeliveryManByCompany();

        return view('config.deliveryman', compact('listDeliveryMan'));
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function downloadPrinter()
    {
        $url = env('URL_PRINTER_EXE');
        return view('config.page-download-exe-printer', compact('url'));
    }
}
