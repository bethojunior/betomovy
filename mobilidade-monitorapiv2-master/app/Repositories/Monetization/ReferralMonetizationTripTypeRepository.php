<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/10/2019
 * Time: 09:53
 */

namespace App\Repositories\Monetization;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Monetization\ReferralMonetizationTripType;

class ReferralMonetizationTripTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(ReferralMonetizationTripType::class);
    }
}
