<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/07/2020
 * Time: 17:10
 */

namespace App\Http\Middleware;


use App\Repositories\Company\CompanyDeliveryConfigRepository;
use Closure;

class OwnDeliveryMenMiddleware
{
    /**
     * @var CompanyDeliveryConfigRepository
     */
    private $repository;

    public function __construct(CompanyDeliveryConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    public function handle($request, Closure $next)
    {
        $companyDeliveryConfig =
            \Cache::remember('companyDeliveryConfig', 600, function () use ($request) {
                return $this->repository
                    ->findByCompany(
                        $request->user()
                            ->companyWorker
                            ->companyId);
            });

        if(!$companyDeliveryConfig->releaseDelivery)
            return redirect()->route('home');

        return $next($request);
    }
}
