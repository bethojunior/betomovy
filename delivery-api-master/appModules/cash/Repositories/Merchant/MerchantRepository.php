<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/03/2020
 * Time: 15:21
 */

namespace Cash\Repositories\Merchant;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Merchant\Merchant;

class MerchantRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Merchant::class);
    }
}
