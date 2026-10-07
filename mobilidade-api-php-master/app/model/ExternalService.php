<?php


namespace app\model;

use app\dao\ExternalServiceDao;
use app\utils\BaseModel;

class ExternalService extends BaseModel
{
    protected $id;
    protected $name;
    protected $externalServiceTypeId;
    protected $active;
    protected $frontEndConfigurable;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): ExternalService
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): ExternalService
    {
        $this->name = $name;
        return $this;
    }

    public function getExternalServiceTypeId(): int
    {
        return $this->externalServiceTypeId;
    }

    public function setExternalServiceTypeId(int $externalServiceTypeId): ExternalService
    {
        $this->externalServiceTypeId = $externalServiceTypeId;
        return $this;
    }

    public function getActive(): bool
    {
        return (bool)$this->active;
    }

    public function setActive(bool $active): ExternalService
    {
        $this->active = $active;
        return $this;
    }

    public function getFrontEndConfigurable(): bool
    {
        return (bool)$this->frontEndConfigurable;
    }

    public function setFrontEndConfigurable(bool $frontEndConfigurable): ExternalService
    {
        $this->frontEndConfigurable = $frontEndConfigurable;
        return $this;
    }

    public static function findActiveByType(int $externalServiceTypeId, int $cityId = null): ?int
    {
        $externalServiceDao = new ExternalServiceDao();
        $externalService = null;
        if ($cityId) $externalService = $externalServiceDao->findActiveByTypeAndCity($externalServiceTypeId, $cityId);
        if (!$externalService) $externalService = $externalServiceDao->findActiveByType($externalServiceTypeId);

        return $externalService->id ?? null;
    }
}