<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/06/2019
 * Time: 17:06
 */

namespace App\Services\User;

use App\Constants\StatusConst;
use App\Exceptions\User\RefusedDriverException;
use App\Repositories\User\BlockDriverRepository;
use App\Repositories\User\DriverRepository;

class DriverService
{
    /**
     * @var DriverRepository
     */
    private $repository;
    private $blockDriverRepository;

    public function __construct(DriverRepository $repository, BlockDriverRepository $blockDriverRepository)
    {
        $this->repository = $repository;
        $this->blockDriverRepository = $blockDriverRepository;
    }

    public function findPosition($id)
    {
        return $this->repository
            ->findPosition($id);
    }

    public function blockDriver($request)
    {
        $alreadyBlocked = $this->blockDriverRepository
            ->findBlocked($request['idCentral'], $request['idDriver']);

        if($alreadyBlocked['statusId'] == StatusConst::ACTIVE) {
            throw new RefusedDriverException('Motorista já está bloqueado');
        }

        return $this->blockDriverRepository
                ->insert($request);
    }

    public function unblockDriver($id)
    {
        return $this->blockDriverRepository
            ->updateStatus($id, StatusConst::REMOVED);
    }
}
