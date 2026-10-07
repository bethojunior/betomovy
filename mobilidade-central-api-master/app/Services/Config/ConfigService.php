<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 16:36
 */

namespace App\Services\Config;


use App\Exceptions\Config\ConfigException;
use App\Repositories\Config\ConfigRepository;

class ConfigService
{
    /**
     * @var ConfigRepository
     */
    private $repository;

    public function __construct(ConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param $key
     * @return mixed
     * @throws ConfigException
     */
    public function findByKey($key)
    {
        $config = $this->repository
            ->findByKey($key);

        if (!$config)
            throw new ConfigException("Configuração não encontrada");

        return $config->value;
    }
}
