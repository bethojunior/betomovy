<?php

namespace app\dao;

use app\model\Status;
use app\utils\BaseDao;

class AppActiveModuleDao extends BaseDao
{
    protected $table = "appActiveModules";

    public function getAll()
    {
        $sql = "
            SELECT
                aam.id AS id,
                am.name AS name,
                am.name AS moduleName,
                aam.logo AS logo,
                aam.isActive AS isActive,
                aam.statusId AS statusId
            FROM {$this->table} aam
            INNER JOIN appModules am ON am.id = aam.appModuleId
                WHERE
                    aam.statusId = :statusId
                AND aam.isActive = :isActive
        ";

        $bind = [
            ':statusId' => Status::ATIVO,
            ':isActive' => true,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * Busca o isActive atual de vários módulos por nome, independente do estado
     * (ativo ou não) — diferente de getAll(), que só retorna módulos ativos.
     */
    public function findManyByModuleName(array $moduleNames)
    {
        $placeholders = [];
        $bind = [];

        foreach ($moduleNames as $index => $name) {
            $key = ':name' . $index;
            $placeholders[] = $key;
            $bind[$key] = $name;
        }

        $sql = "
            SELECT
                am.name AS moduleName,
                aam.isActive AS isActive
            FROM {$this->table} aam
            INNER JOIN appModules am ON am.id = aam.appModuleId
                WHERE
                    aam.statusId = :statusId
                AND am.name IN (" . implode(',', $placeholders) . ")
        ";

        $bind[':statusId'] = Status::ATIVO;

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}