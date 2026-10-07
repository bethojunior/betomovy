<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/06/2020
 * Time: 18:00
 */

namespace App\Repositories\Company;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Company\CompanyPaymentForm;
use Illuminate\Database\Eloquent\Builder;

class CompanyPaymentFormRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CompanyPaymentForm::class);
    }

    public function findAllByCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->whereNull('deliveryPaymentForm.deleted_at')
            ->join(
                'deliveryPaymentForm', 'deliveryPaymentFormId', '=', 'deliveryPaymentForm.id')
            ->select(
                'companyPaymentForm.id',
                'deliveryPaymentForm.name',
                'companyId'
            )
            ->get();
    }
}
