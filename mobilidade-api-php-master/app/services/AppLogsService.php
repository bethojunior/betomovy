<?php

namespace app\services;

use app\dao\AppLogsDao;
use app\model\AppLogs;
use InvalidArgumentException;

class AppLogsService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new AppLogsDao;
    }

    public function insert($request, $userId)
    {
      foreach ($request as $data) {
        $this->validateData($data);
      }

      foreach ($request as $data) {
        $this->save($data, $userId);
      }

      return true;
    }

    private function save($data, $userId)
    {
      $tripReference = !empty($data->tripReference) ? $data->tripReference : null;
      $appLogs = new AppLogs();
      $appLogs
          ->setCount($data->count)
          ->setUserId($userId)
          ->setTripReference($tripReference)
          ->setKey($data->key)
          ->setLat($data->lat)
          ->setLng($data->lng)
          ->setDate($data->date)
          ->setId($this->dao->sqlInsert($appLogs));
    }

    private function validateData($data)
    {
      if (
        !isset($data->count) ||
        !isset($data->key) ||
        !isset($data->lat) ||
        !isset($data->lng) ||
        !isset($data->date)
      ) {
        throw new \InvalidArgumentException("Todos os campos 'count', 'key', 'lat', 'lng' e 'date' são obrigatórios.");
    }

    $tripReference = !empty($data->tripReference) ? $data->tripReference : null;

    if ($tripReference !== null && strlen($tripReference) > 40) {
        throw new \InvalidArgumentException("O campo 'tripReference' deve ter no máximo 40 caracteres.");
    }

    if (!is_int($data->count)) {
        throw new \InvalidArgumentException("O campo 'count' deve ser um número inteiro.");
    }
    
    return true;
    }
}
