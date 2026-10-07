<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * DAO para a tabela externalServiceActiveChannel
 */
class ExternalServiceActiveChannelDao extends BaseDao
{
    protected $table = 'externalServiceActiveChannel';

    /**
     * Verifica se o canal (tipo de serviço) está ativo para a ação
     * @param int $externalServiceActionId
     * @param int $externalServiceTypeId 1=SMS, 2=WhatsApp
     * @return bool
     */
    public function isChannelActive(int $externalServiceActionId, int $externalServiceTypeId): bool
    {
        $sql = "
            SELECT status
            FROM {$this->table}
            WHERE externalServiceActionId = :actionId
              AND externalServiceTypeId = :typeId
            ORDER BY id DESC
            LIMIT 1
        ";
        $bind = [':actionId' => $externalServiceActionId, ':typeId' => $externalServiceTypeId];
        $result = $this->sqlRawSelect($sql, $bind)->first();
        return isset($result->status) && (int)$result->status === 1;
    }
}
