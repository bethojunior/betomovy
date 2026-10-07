<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/06/2019
 * Time: 22:09
 */

namespace App\Repositories\Central;


use App\Constants\PaginationConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralCustomer;
use Illuminate\Database\Eloquent\Builder;

class CentralCustomerRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CentralCustomer::class);
    }

    public function findWithCentralLogo($id)
    {
        return $this->getModel()
            ::where('centralCustomer.id', $id)
            ->join('central', 'centralId', '=', 'central.id')
            ->select([
                'centralCustomer.id',
                'centralCustomer.name',
                'centralCustomer.phone',
                'centralCustomer.name AS nickname',
                'central.logo AS profileImage',
            ])
            ->first();
    }

    public function findByPhoneAndCentral($phone, $centralId)
    {
        return $this->getModel()
            ::where(
                'phone',
                '=',
                str_replace(['-',' ','(',')','.'],'', $phone))
            ->where('centralId', $centralId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first();
    }

    public function findByCentral($centralId, $request)
    {
        $name = $request['name'] ?? null;
        $phone = $request['phone'] ?? null;
        $document = $request['document'] ?? null;

        return $this->getModel()
            ::join(
                'customerRegisterStatus',
                'customerRegisterStatusId', '=', 'idCustomerRegisterStatus')
            ->select([
                'id',
                'centralCustomer.name',
                'phone',
                'document',
                'dateOfBirth',
                'centralId',
                'customerRegisterStatusId',
                'customerRegisterStatus.name AS customerRegister',
                'created_at',
            ])
            ->where('centralId', $centralId)
            ->where('statusId', StatusConst::ACTIVE)
            ->when($name, function(Builder $builder, $name){
                $builder->where('centralCustomer.name', 'LIKE', "%{$name}%");
            })
            ->when($phone, function(Builder $builder, $phone){
                $builder->where('phone', 'LIKE', "%{$phone}%");
            })
            ->when($document, function(Builder $builder, $document){
                $builder->where('document', 'LIKE', "%{$document}%");
            })
            ->orderByDesc('created_at')
            ->paginate(PaginationConst::LIMIT_PER_PAGE);
    }
}
