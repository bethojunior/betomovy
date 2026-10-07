<?php

namespace app\dao;

use app\utils\BaseDao;

class CallGroupsTripTypeLinkedDao extends BaseDao
{
    protected $table = "callGroupsTripTypeLinked";

    public function getCallsGroupsTripTypeLinked($idTripType)
    {
        $sql = "
            SELECT
                cgttl.id,
                cgttl.tripTypeId,
                cgttl.call_group_id,
                cg.id,
                cg.name,
                cg.image,
                cg.weight
            FROM {$this->table} cgttl
            LEFT JOIN call_group cg ON cg.id = cgttl.call_group_id
            WHERE cgttl.tripTypeId = :tripTypeId
        ";

        $bind = [
            ':tripTypeId' => $idTripType 
        ];

        $responseCallGroup = $this->sqlRawSelect($sql, $bind)->get(false);

        return $responseCallGroup;
    }
}
