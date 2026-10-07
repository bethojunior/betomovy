<?php

namespace app\services;

use app\exceptions\AcquirerFallbackException;
use app\model\Acquirer;
use app\utils\Admin704Apps;
use app\utils\Admin704AppsMapper;
use app\utils\RedisUtil;

class AcquirerService
{
    private const CACHE_TTL = 900;

    private ?Admin704AppsAcquirerService $adminProvider = null;
    private LegacyAcquirerService $legacyProvider;
    private RedisUtil $cache;
    private string $customerName;

    public function __construct()
    {
        $this->adminProvider = new Admin704AppsAcquirerService(new Admin704Apps());
        $this->legacyProvider = new LegacyAcquirerService();
        $this->cache = new RedisUtil();
        $this->customerName = env('ADMIN704APPS_CUSTOMER_NAME') ?: (env('APP_NAME') ?: 'default');
    }

    /**
     * Obtém o ID da adquirente ativa, priorizando o Admin704Apps.
     *
     * @param int|null $paymentFormId
     * @param int|null $cityId
     * @return int
     */
    public function getActiveAcquirerId(?int $paymentFormId = null, ?int $cityId = null): int
    {
        $data = $this->getActiveAcquirerData($paymentFormId, $cityId);
        return (int) ($data->getIntermediaryId() ?? 0);
    }

    /**
     * Obtém todos os dados da adquirente ativa, priorizando o Admin704Apps.
     * Usa cache em Redis (chave por customer + payment_type) pra evitar HTTP repetido.
     *
     * @param int|null $paymentFormId
     * @param int|null $cityId
     * @return Acquirer
     */
    public function getActiveAcquirerData(?int $paymentFormId = null, ?int $cityId = null): Acquirer
    {
        $cacheKey = $this->buildCacheKey($paymentFormId);

        $cached = $this->cache->get($cacheKey);
        if ($cached instanceof Acquirer) {
            return $cached;
        }

        try {
            $acquirer = $this->adminProvider->getAcquirer($cityId, $paymentFormId);
        } catch (AcquirerFallbackException $e) {
            $acquirer = $this->legacyProvider->getAcquirer($cityId, $paymentFormId);
        }

        $this->cache->set($cacheKey, $acquirer, self::CACHE_TTL);

        return $acquirer;
    }

    /**
     * Retorna a flag legacy do acquirer cacheado (qualquer payment_type),
     * ou null se não houver cache. Usado por fluxos sem contexto de checkout
     * (ex: webhooks) pra decidir se pulam o dispatch pro Admin704Apps.
     *
     * @return bool|null
     */
    public function isCachedAcquirerLegacy(): ?bool
    {
        foreach (['card', 'pix'] as $paymentType) {
            $cached = $this->cache->get("acquirer:{$this->customerName}:{$paymentType}");
            if ($cached instanceof Acquirer) {
                return (bool) $cached->getLegacy();
            }
        }

        return null;
    }

    private function buildCacheKey(?int $paymentFormId): string
    {
        $paymentType = Admin704AppsMapper::mapPaymentMethod($paymentFormId);
        return "acquirer:{$this->customerName}:{$paymentType}";
    }
}
