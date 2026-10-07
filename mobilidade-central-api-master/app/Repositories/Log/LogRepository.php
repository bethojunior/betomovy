<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/07/2019
 * Time: 14:52
 */

namespace App\Repositories\Log;


use App\Constants\AppConst;
use App\Contracts\Repository\AbstractODMRepository;
use App\Documents\Log;

class LogRepository extends AbstractODMRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Log::class);
    }

    /**
     * @param array $data
     * @param $message
     * @param null $userId
     * @param null $idReference
     * @return \Illuminate\Database\Eloquent\Model|\Jenssegers\Mongodb\Eloquent\Builder|\Jenssegers\Mongodb\Eloquent\Model
     */
    public function insert(array $data, $message, $userId = null, $idReference = null)
    {
        return $this->getModel()
            ::create([
                'data' => $data,
                'message' => $message,
                'userId' => $userId,
                'idReference' => $idReference,
                'app' => AppConst::CENTRAL,
                'date' => now()->toDateTimeString()
            ]);
    }
}
