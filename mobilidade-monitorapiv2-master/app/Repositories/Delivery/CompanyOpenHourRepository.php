<?php

namespace App\Repositories\Delivery;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\CompanyOpenHour;
use Carbon\Carbon;

class CompanyOpenHourRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyOpenHour::class);
    }

    public function findByCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->with('company')
            ->get();
    }

    public function listAllHourOpenDailyByCompany(int $companyId)
    {
        $result = $this->getModel()
            ::where('companyId', $companyId)
            ->get();

        $hourStartToday = null;
        foreach ($result as $item) {
            $item->isToday = $this->isWeekDay($item->weekDayId);

            if ($item->isToday === true) {
                $hourStartToday = $item->hourStart;
            }
        }

        return Carbon::parse($hourStartToday)->format('H:i');

    }

    private function isWeekDay($weekDayId)
    {

        $today = Carbon::now()->format('l');
        switch ($today) {
            case 'Sunday':
                $today = 1;
                break;
            case 'Monday':
                $today = 2;
                break;
            case 'Tuesday':
                $today = 3;
                break;
            case 'Wednesday':
                $today = 4;
                break;
            case 'Thursday':
                $today = 5;
                break;
            case 'Friday':
                $today = 6;
                break;
            case 'Saturday':
                $today = 7;
                break;
        }

        if ($today == $weekDayId) {
            return true;
        }

        return false;

    }
}
