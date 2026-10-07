<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/06/2020
 * Time: 15:17
 */

namespace App\Services\Company;


use App\Models\Company\CompanyOpenHour;
use App\Repositories\Company\CompanyOpenHourRepository;
use App\Repositories\Enum\WeekDayRepository;
use Illuminate\Support\Facades\Auth;

class CompanyOpenHourService
{
    /**
     * @var CompanyOpenHourRepository
     */
    private $companyOpenHourRepository;
    /**
     * @var WeekDayRepository
     */
    private $weekDayRepository;

    public function __construct(CompanyOpenHourRepository $companyOpenHourRepository,
                                WeekDayRepository $weekDayRepository)
    {
        $this->companyOpenHourRepository = $companyOpenHourRepository;
        $this->weekDayRepository = $weekDayRepository;
    }

    public function findByCompany()
    {
        $companyId = Auth::user()->companyWorker->companyId;

        return $this->weekDayRepository
            ->findWithCompanyOpenHour($companyId);
    }

    /**
     * @param array $request
     * @return bool
     * @throws \Exception
     */
    public function save(array $request): bool
    {
        \DB::beginTransaction();
        try {
            $companyId = Auth::user()->companyWorker->companyId;

            $this->companyOpenHourRepository
                ->removeAllFromCompany($companyId);

            foreach ($request['day'] as $index => $value) {
                if (!$value['hourStart'])
                    continue;

                $companyOpenHour = new CompanyOpenHour;
                $companyOpenHour->weekDayId = $index;
                $companyOpenHour->companyId = $companyId;
                $companyOpenHour->hourStart = $value['hourStart'];
                $companyOpenHour->hourStop = $value['hourStop'];

                $companyOpenHour->save();
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        return true;
    }
}
