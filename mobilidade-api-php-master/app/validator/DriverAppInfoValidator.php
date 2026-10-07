<?php


namespace app\validator;
use Exception;

class DriverAppInfoValidator
{
    public function validateInsert($data)
    {
        if (!isset($data->version))
            throw new Exception("Versão do app não foi enviada");

        if (!isset($data->permissionLocationBackground))
            throw new Exception("Status da permissão de localização em segundo plano não foi enviada");

        if (!isset($data->permissionGps))
            throw new Exception("Status do gps não foi enviada");

        if (!isset($data->permissionWriteExternalStorage))
            throw new Exception("Permissão de espaço externo não foi enviada");

        if (!isset($data->permissionSystemOverlay))
            throw new Exception("Permissão de sobreposição não foi enviada");

        if (!isset($data->permissionIgnoreBatteryOptimization))
            throw new Exception("Permissão para ignorar otimização da bateria não foi enviada");

        if (!isset($data->driverId))
            throw new Exception("Id do motorista não foi enviado");
    }
}