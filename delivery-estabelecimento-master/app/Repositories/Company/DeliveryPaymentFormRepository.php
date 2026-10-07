<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/06/2020
 * Time: 18:24
 */

namespace App\Repositories\Company;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Company\Company;
use App\Models\Company\DeliveryPaymentForm;
use Illuminate\Database\Eloquent\Builder;

class DeliveryPaymentFormRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryPaymentForm::class);
    }

    public function findAvailableForCompany(Company $company)
    {
        return $this->getModel()
            ::whereDoesntHave('companyPaymentForms', function (Builder $query) use ($company) {
                $query
                    ->where('companyId', $company->id);
            })
            ->get();
    }
}
