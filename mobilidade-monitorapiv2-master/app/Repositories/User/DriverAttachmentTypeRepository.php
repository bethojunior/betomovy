<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/07/2020
 * Time: 10:19
 */

namespace App\Repositories\User;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver\DriverAttachmentType;

class DriverAttachmentTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DriverAttachmentType::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::orderByDesc('created_at')
            ->get();
    }
}
