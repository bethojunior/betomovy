<?php
namespace app\services;

use app\constant\FinancialIntermediaryConst;
use app\contracts\AcquirerProviderInterface;
use app\dao\LogDao;
use app\exceptions\AcquirerFallbackException;
use app\exceptions\Admin704AppsException;
use app\model\Acquirer;
use app\utils\Admin704Apps;
use app\utils\Admin704AppsMapper;

class Admin704AppsAcquirerService implements AcquirerProviderInterface {
    private Admin704Apps $admin;

    public function __construct(Admin704Apps $admin)
    {
        $this->admin = $admin;
    }

    public function getAcquirer(?int $cityId = null, ?int $paymentFormId = null): Acquirer
    {
        try {
            $paymentType = Admin704AppsMapper::mapPaymentMethod($paymentFormId);
            $response = $this->admin->getCustomerAcquirer($paymentType);

            if (!isset($response) || !isset($response['name'])) {
                throw new AcquirerFallbackException('Adquirente não encontrada.');
            }

            $intermediaryId = $this->mapIntermediaryNameToConst(
                $this->normalizeAcquirerName($response['name'])
            );

            if ($intermediaryId === 0) {
                throw new AcquirerFallbackException('Id da adquirente não mapeado.');
            }

            return (new Acquirer())
                ->setIntermediaryId($intermediaryId)
                ->setAcquirerId($response['id'])
                ->setCustomerId($response['customer_id'])
                ->setPaymentType($paymentType)
                ->setName($response['name'])
                ->setConfigs($this->extractConfigs($response['acquirer_meta_data'] ?? []))
                ->setCapture($response['capture'] ?? 0)
                ->setLegacy(false);
        } catch (Admin704AppsException | \Throwable $e) {
            (new LogDao)->logException($e);
            throw new AcquirerFallbackException('Erro ao obter adquirente Admin704Apps.');
        }
    }

    private function normalizeAcquirerName(string $name): string
    {
        return strtoupper(str_replace(' ', '_', trim($name)));
    }

    private function extractConfigs(array $metaData): array
    {
        $configs = [];
        foreach ($metaData as $meta) {
            if (isset($meta['key'], $meta['value'])) {
                $configs[$meta['key']] = $meta['value'];
            }
        }
        return $configs;
    }

    private function mapIntermediaryNameToConst(string $name): int
    {
        $map = [
            '704_PAY' => FinancialIntermediaryConst::PAY704,
            'FIREBANKING' => FinancialIntermediaryConst::FIREBANKING,
            'EPAG' => FinancialIntermediaryConst::EPAG,
            'CIELO' => FinancialIntermediaryConst::CIELO,
            'MERCADO_PAGO' => FinancialIntermediaryConst::MERCADO_PAGO,
            'YUMEPAY' => FinancialIntermediaryConst::YUMEPAY,
        ];
        return $map[$name] ?? 0;
    }
}