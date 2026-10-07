<?php


namespace app\dao;

use app\utils\BaseDao;

class AddressDao extends BaseDao
{
    public function findBy($address)
    {
        $sql = "
            SELECT * FROM 
                address a
                WHERE 
                a.address = :address 
        
            LIMIT 1;
        ";

        $bind = [
            ":address" => $address,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->first();

    }
}