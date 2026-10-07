<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/02/2020
 * Time: 10:16
 */

namespace Cash\Services\Sale;


use App\Constants\Balance\CustomerViewBalanceConst;
use App\Constants\Balance\MerchantBalanceConst;
use App\Constants\Sale\SaleStatusConst;
use App\Exceptions\Sale\SaleException;
use App\Models\Balance\Balance;
use App\Models\Merchant\Merchant;
use App\Models\Package\PackageFee;
use App\Models\Sale\Sale;
use App\Models\User;
use Cash\Constants\Merchant\MerchantStatusConst;
use Cash\Repositories\Balance\BalanceFlowRepository;
use Cash\Repositories\Balance\BalanceRepository;
use Cash\Repositories\Balance\SaleBalanceFlowRepository;
use Cash\Repositories\Customer\CustomerViewRepository;
use Cash\Repositories\Merchant\MerchantRepository;
use Cash\Repositories\Package\PackageFeeRepository;
use Cash\Repositories\Sale\SalePaymentFormRepository;
use Cash\Repositories\Sale\SaleRepository;
use Cash\Repositories\Sale\SaleStatusRepository;
use Ramsey\Uuid\Uuid;

class PaySaleService
{
    /**
     * @var SaleRepository
     */
    private $repository;
    /**
     * @var CustomerViewRepository
     */
    private $customerViewRepository;
    /**
     * @var BalanceRepository
     */
    private $balanceRepository;
    /**
     * @var MerchantRepository
     */
    private $merchantRepository;
    /**
     * @var PackageFeeRepository
     */
    private $packageFeeRepository;
    /**
     * @var BalanceFlowRepository
     */
    private $balanceFlowRepository;
    /**
     * @var SaleBalanceFlowRepository
     */
    private $saleBalanceFlowRepository;
    /**
     * @var SaleStatusRepository
     */
    private $saleStatusRepository;

    public function __construct(SaleRepository $repository,
                                CustomerViewRepository $customerViewRepository,
                                BalanceRepository $balanceRepository,
                                MerchantRepository $merchantRepository,
                                PackageFeeRepository $packageFeeRepository,
                                BalanceFlowRepository $balanceFlowRepository,
                                SaleBalanceFlowRepository $saleBalanceFlowRepository,
                                SaleStatusRepository $saleStatusRepository)
    {
        $this->repository = $repository;
        $this->customerViewRepository = $customerViewRepository;
        $this->balanceRepository = $balanceRepository;
        $this->merchantRepository = $merchantRepository;
        $this->packageFeeRepository = $packageFeeRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
        $this->saleBalanceFlowRepository = $saleBalanceFlowRepository;
        $this->saleStatusRepository = $saleStatusRepository;
    }

    /**
     * @param $secondaryId
     * @param array $request
     * @return bool
     * @throws SaleException
     * @throws \Exception
     */
    public function pay($secondaryId, array $request)
    {
        $customerBalance = $this->findCustomerBalance($request['userId']);

        /** @var Sale $sale */
        $sale = $this->repository
            ->findBySecondaryId($secondaryId);

        $sale->salePaymentFormId = $request['salePaymentFormId'];
        $sale->buyerId = $request['userId'];

        if ($customerBalance->balance < $sale->value)
            throw new SaleException("Sem saldo suficiente para efetuar o pagamento");

        if ($sale->saleStatusId != SaleStatusConst::WAITING_PAYMENT)
            throw new SaleException(
                "Venda não permite pagamento, pois a mesma está: ".
                $this->saleStatusRepository
                    ->findNameById($sale->saleStatusId));

        $sale->saleStatusId = SaleStatusConst::FINISHED;

        try {
            \DB::beginTransaction();

            $this->repository->save($sale);

            $this->debitCustomerBalance($customerBalance, $sale);

            $this->increaseSellerBalance($sale);

            \DB::commit();

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return true;
    }

    /**
     * @param array $request
     * @param User $user
     * @return Sale
     * @throws SaleException
     */
    public function companyPay(array $request, User $user): Sale
    {
        /** @var Merchant $merchant */
        $merchant =
            $this->merchantRepository
                ->findOrFail($request['merchantId']);

        $customerBalance = $this->findCustomerBalance($user->idUser);

        if ($merchant->merchantStatusId != MerchantStatusConst::ACTIVE)
            throw new SaleException("Status do estabelecimento não permite pagamento");

        if ($customerBalance->balance < $request['value'])
            throw new SaleException("Sem saldo suficiente para efetuar o pagamento");

        /** @var PackageFee $packageFee */
        $packageFee = $this->packageFeeRepository
            ->findActiveByPackage($merchant->packageId);

        \DB::beginTransaction();

        try {
            $sale = new Sale;
            $sale->value = $request['value'];
            $sale->totalSum = $request['value'];
            $sale->buyerId = $user->idUser;
            $sale->secondaryId = Uuid::uuid4();
            $sale->date = now();
            $sale->merchantId = $request['merchantId'];
            $sale->packageFeeId = $packageFee->id ?? null;
            $sale->saleStatusId = SaleStatusConst::FINISHED;
            $sale->salePaymentFormId = $request['salePaymentFormId'];
            $sale->discountValue = 0;
            $sale->save();

            $this->debitCustomerBalance($customerBalance, $sale);

            $this->increaseSellerBalance($sale);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $sale;
    }

    /**
     * @param $userId
     * @return Balance
     */
    private function findCustomerBalance(int $userId): Balance
    {
        $customer = $this->customerViewRepository
            ->find($userId);

        /** @var Balance $balance */
        $balance = $this->balanceRepository
            ->find($customer->balanceId);

        return $balance;
    }

    /**
     * @param Balance $balance
     * @param Sale $sale
     * @return Balance
     */
    private function debitCustomerBalance(Balance $balance, Sale $sale): Balance
    {
        $this->balanceRepository
            ->decrement($balance->idBalance, 'balance', $sale->value);

        $balanceFlow = $this->balanceFlowRepository
            ->create([
                'balanceFlowTypeId' => CustomerViewBalanceConst::DEBIT_BALANCE_SALE,
                'value' => $sale->value,
                'balanceId' => $balance->idBalance,
            ]);

        $this->saleBalanceFlowRepository->create([
            'saleId' => $sale->id,
            'balanceFlowId' => $balanceFlow->idBalanceFlow
        ]);

        return $balance;
    }

    /**
     * @param Sale $sale
     */
    private function increaseSellerBalance(Sale $sale) : void
    {
        /** @var Merchant $merchant */
        $merchant = $this->merchantRepository
            ->find($sale->merchantId);

        $fee = $this->calculateSaleFee($sale->packageFeeId, $sale->value);

        $this->balanceRepository
            ->increment($merchant->balanceId, 'balance', ($sale->value - $fee));

        $saleFinishedBalanceFlow = $this->balanceFlowRepository->create([
            'balanceFlowTypeId' => MerchantBalanceConst::SALE_FINISHED_BALANCE,
            'value' => $sale->value,
            'balanceId' => $merchant->balanceId,
        ]);

        $saleBalanceFlows = [[
            'saleId' => $sale->id,
            'balanceFlowId' => $saleFinishedBalanceFlow->idBalanceFlow
        ]];

        if ($fee > 0) {
            $saleFeeBalanceFlow = $this->balanceFlowRepository->create([
                'balanceFlowTypeId' => MerchantBalanceConst::SALE_FINISHED_BALANCE,
                'value' => $sale->value,
                'balanceId' => $merchant->balanceId,
            ]);

            $saleBalanceFlows[] = [
                'saleId' => $sale->id,
                'balanceFlowId' => $saleFeeBalanceFlow->idBalanceFlow
            ];
        }

        $this->saleBalanceFlowRepository->createMany($saleBalanceFlows);
    }

    /**
     * @param int $packageFeeId
     * @param float $saleValue
     * @return float
     */
    private function calculateSaleFee(int $packageFeeId, float $saleValue): float
    {
        /** @var PackageFee $packageFee */
        $packageFee = $this->packageFeeRepository
            ->find($packageFeeId);

        return $packageFee->valueType == '%' ?
            ($packageFee->value / 100) * $saleValue :
            $packageFee->value;
    }
}
