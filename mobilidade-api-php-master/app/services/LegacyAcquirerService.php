<?php
namespace app\services;

use app\contracts\AcquirerProviderInterface;
use app\model\Acquirer;
use app\model\AcquirerMetaData;
use app\model\FinancialIntermediary;
use app\utils\Logger;

class LegacyAcquirerService implements AcquirerProviderInterface {
    public function getAcquirer(?int $cityId = null, ?int $paymentFormId = null): Acquirer
    {
        $intermediaryId = (int) FinancialIntermediary::findActiveId($cityId);
        $financialIntermediary = FinancialIntermediary::findCaptureId($intermediaryId);

        $amd = $this->findAcquirerMetaData($cityId, $intermediaryId);

        return (new Acquirer())
            ->setIntermediaryId($intermediaryId)
            ->setPaymentType("unknown")
            ->setName($financialIntermediary->name ?? null)
            ->setConfigs($this->extractConfigs($amd ?? []) ?? [])
            ->setCapture((int) $financialIntermediary->capture ?? 0)
            ->setLegacy(true);
    }

    private function extractConfigs(array $metaData): array
    {
        $configs = [];
        foreach ($metaData as $meta) {
            if (isset($meta->key, $meta->value)) {
                $configs[$meta->key] = $meta->value;
            }
        }
        return $configs;
    }

    private function findAcquirerMetaData(?int $cityId, ?int $intermediaryId)
    {
        if (!is_null($cityId)) {
            return AcquirerMetaData::getByCityId($intermediaryId, $cityId);
        } else {
            return AcquirerMetaData::getByAcquirerId($intermediaryId);
        }
    }
}