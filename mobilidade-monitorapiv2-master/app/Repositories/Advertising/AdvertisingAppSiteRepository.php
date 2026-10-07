<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/10/2019
 * Time: 17:40
 */

namespace App\Repositories\Advertising;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Advertising\AdvertisingAppSite;

class AdvertisingAppSiteRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(AdvertisingAppSite::class);
    }
}
