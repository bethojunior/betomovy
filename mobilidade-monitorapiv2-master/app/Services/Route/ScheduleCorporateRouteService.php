<?php


namespace App\Services\Route;


use App\Constants\StatusConst;
use App\Models\Route\ScheduleCorporateRoute;
use App\Repositories\Route\ScheduleCorporateRouteRepository;
use App\Repositories\Route\ScheduleCorporateRouteWeekRepository;


class ScheduleCorporateRouteService
{
    /**
     * @var ScheduleCorporateRouteRepository
     */
    private $repository;
    /**
     * @var ScheduleCorporateRouteWeekRepository
     */
    private $repositoryScheduleRouteCorporateWeek;

    public function __construct(ScheduleCorporateRouteRepository $repository, ScheduleCorporateRouteWeekRepository $repositoryScheduleRouteCorporateWeek)
    {
        $this->repository = $repository;
        $this->repositoryScheduleRouteCorporateWeek = $repositoryScheduleRouteCorporateWeek;
    }

    public function insert(array $request)
    {

        try {
            \DB::beginTransaction();
            $days = $request['days'];
            $scheduleCorporateRoute = $this->repository->create($request);
            foreach ($days as $day) {
                $day['scheduleCorporateRouteId'] = $scheduleCorporateRoute->id;
                $this->repositoryScheduleRouteCorporateWeek->create($day);
            }

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        \DB::commit();

        return $scheduleCorporateRoute;

    }

    public function findScheduleByCompany($companyId)
    {
        return $this->repository->findScheduleByCompany($companyId);
    }

    public function findScheduleCompanyByDate($companyId,array $request)
    {
        return $this->repository->findScheduleCompanyByDate($companyId,$request['date']);
    }

    public function update($id, array $request)
    {
        try {
            \DB::beginTransaction();
            $days = $request['days'];
            $scheduleCorporateRoute = $this->repository->findWithDays($id);
            $scheduleCorporateRoute->schedule = $request['schedule'];
            $scheduleCorporateRoute->title = $request['title'];
            $scheduleCorporateRoute->vacancies = $request['vacancies'];

            $this->repository->save($scheduleCorporateRoute);

            foreach ($scheduleCorporateRoute->days as $day) {
                $day->statusId = StatusConst::REMOVED;
                $this->repositoryScheduleRouteCorporateWeek->save($day);
            }

            foreach ($days as $day) {
                $day['scheduleCorporateRouteId'] = $scheduleCorporateRoute->id;
                $this->repositoryScheduleRouteCorporateWeek->create($day);
            }

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        \DB::commit();

        return $scheduleCorporateRoute;
    }

    public function delete($id)
    {
        /**
         * @var ScheduleCorporateRoute $scheduleCorporateRoute
         */
        $scheduleCorporateRoute = $this->repository->find($id);
        $scheduleCorporateRoute->statusId = StatusConst::REMOVED;
        $this->repository->save($scheduleCorporateRoute);
        return $scheduleCorporateRoute;
    }

}
