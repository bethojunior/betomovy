<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 13/08/2018
 * Time: 09:45
 */
class CardFlagDao extends BaseDao
{
    protected $table = "cardFlag";

    /**
     * @return array|mixed
     * @throws Exception
     */
    public function getAll()
    {
        try {
            return $this->sqlSelect()->get();
        } catch (Exception $e) {
            throw $e;
        }
    }
}