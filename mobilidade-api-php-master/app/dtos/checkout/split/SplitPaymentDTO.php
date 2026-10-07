<?php

namespace app\dtos\checkout\split;

class SplitPaymentDTO
{
    private int $company_id;
    private string $merchant_type;
    private string $type;
    private bool $charge_fee;
    private int $amount;

    public function __construct(
        int $company_id,
        string $merchant_type,
        string $type,
        bool $charge_fee,
        int $amount
    )
    {
        $this->company_id = $company_id;
        $this->merchant_type = $merchant_type;
        $this->type = $type;
        $this->charge_fee = $charge_fee;
        $this->amount = $amount;
    }

    public function getCompanyId(): int
    {
        return $this->company_id;
    }

    public function setCompanyId(int $company_id): SplitPaymentDTO
    {
        $this->company_id = $company_id;
        return $this;
    }

    public function getMerchantType(): string
    {
        return $this->merchant_type;
    }

    public function setMerchantType(string $merchant_type): SplitPaymentDTO
    {
        $this->merchant_type = $merchant_type;
        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): SplitPaymentDTO
    {
        $this->type = $type;
        return $this;
    }

    public function isChargeFee(): bool
    {
        return $this->charge_fee;
    }

    public function setChargeFee(bool $charge_fee): SplitPaymentDTO
    {
        $this->charge_fee = $charge_fee;
        return $this;
    }

    public function getAmount(): int
    {
        return $this->amount;
    }

    public function setAmount(int $amount): SplitPaymentDTO
    {
        $this->amount = $amount;
        return $this;
    }

    public function toArray(): array
    {
        return [
            'company_id' => $this->getCompanyId(),
            'merchant_type' => $this->getMerchantType(),
            'type' => $this->getType(),
            'charge_fee' => $this->isChargeFee(),
            'amount' => $this->getAmount()
        ];
    }
}