<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 10:15
 */

namespace App\Repositories\User;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\BlockDriver;

class BlockDriverRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(BlockDriver::class);
    }

    public function findBlocked($centralId, $driverId)
    {
        return $this->getModel()
        ::where('centralId', $centralId)
        ->where('driverId', $driverId)
        ->first();
    }

    public function findById($id)
    {
        return $this->getModel()
        ::where('id', $id)
        ->first();
    }

    public function insert($request)
    {
        return $this->getModel()
        ::create([
            'customerId' => null, 
            'driverId' => $request->idDriver,
            'centralId' => $request->idCentral,
            'statusId' => StatusConst::ACTIVE,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function updateStatus($id, $status)
    {
        return $this->getModel()
            ::where('id', $id)
            ->update([
                'statusId' => $status,
                'updated_at' => now()
            ]);
    }
}
