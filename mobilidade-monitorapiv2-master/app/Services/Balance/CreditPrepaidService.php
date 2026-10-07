<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/05/2020
 * Time: 15:54
 */

namespace App\Services\Balance;


use App\Models\Balance\CreditPrepaid;
use App\Models\Balance\CreditPrepaidPaymentForm;
use App\Repositories\Balance\CreditPrepaidPaymentFormRepository;
use App\Repositories\Balance\CreditPrepaidRepository;
use App\Utils\RedisUtil;

class CreditPrepaidService
{
    /**
     * @var CreditPrepaidRepository
     */
    private $repository;
    /**
     * @var CreditPrepaidPaymentFormRepository
     */
    private $creditPrepaidPaymentFormRepository;

    public function __construct(CreditPrepaidRepository $repository,
                                CreditPrepaidPaymentFormRepository $creditPrepaidPaymentFormRepository)
    {
        $this->repository = $repository;
        $this->creditPrepaidPaymentFormRepository = $creditPrepaidPaymentFormRepository;
    }

    public function findAll()
    {
        return $this->repository->findAll();
    }

    public function insert(array $request)
    {
        $creditPrepaid = new CreditPrepaid($request);
        $creditPrepaid->save();

        $this->syncPaymentForms($creditPrepaid, $request['paymentForms']);

        (new RedisUtil)->delete("list-prepaid");

        return $creditPrepaid;
    }

    /**
     * @param CreditPrepaid $creditPrepaid
     * @param array $request
     * @return CreditPrepaid
     */
    public function update(CreditPrepaid $creditPrepaid, array $request): CreditPrepaid
    {
        $this->repository->update($creditPrepaid, $request);

        $this->creditPrepaidPaymentFormRepository
            ->deleteByCreditPrepaid($creditPrepaid->id);

        $this->syncPaymentForms($creditPrepaid, $request['paymentForms']);

        (new RedisUtil)->delete("list-prepaid");

        return $creditPrepaid;
    }

    /**
     * @param CreditPrepaid $creditPrepaid
     * @return bool
     * @throws \Exception
     */
    public function delete(CreditPrepaid $creditPrepaid): ?bool
    {
        (new RedisUtil)->delete("list-prepaid");
        return $creditPrepaid->delete();
    }

    private function syncPaymentForms(CreditPrepaid $creditPrepaid, array $paymentFormIds): void
    {
        $this->creditPrepaidPaymentFormRepository
            ->createMany(array_map(function ($paymentFormId) use ($creditPrepaid) {
                return [
                    'paymentFormId' => $paymentFormId,
                    'creditPrepaidId' => $creditPrepaid->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $paymentFormIds));
    }
}
