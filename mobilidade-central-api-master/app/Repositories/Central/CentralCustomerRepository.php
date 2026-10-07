<?php
/**
 * Created by PhpStorm.
 * User: lixo
 * Date: 21/06/2019
 * Time: 22:09
 */

namespace App\Repositories\Central;


use App\Constants\PaginationConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\Central;
use App\Models\Central\CentralCustomer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as BuilderQuery;

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
            ->with('user')
            ->first();
    }

    public function findByUserAndCentral($userId, $centralId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('centralId', $centralId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first();
    }

    public function findByCentral(Central $central, $request)
    {
        $name = $request['name'] ?? null;
        $phone = $request['phone'] ?? null;
        $document = $request['document'] ?? null;

        return $this->getModel()
            ::join(
                'customerRegisterStatus',
                'customerRegisterStatusId', '=', 'idCustomerRegisterStatus')
            ->selectRaw('
                centralCustomer.id,
                null AS customerId,
                centralCustomer.userId,
                centralCustomer.name,
                centralCustomer.phone,
                centralCustomer.document AS document,
                centralCustomer.dateOfBirth,
                centralCustomer.centralId,
                centralCustomer.isCompany,
                centralCustomer.customerRegisterStatusId,
                customerRegisterStatus.name AS customerRegister,
                centralCustomer.created_at
            ')
            ->where('centralId', $central->id)
            ->whereIn('centralCustomer.statusId', [StatusConst::INACTIVE, StatusConst::ACTIVE])
            ->when($name, function(Builder $builder, $name){
                $builder->where('centralCustomer.name', 'LIKE', "%{$name}%");
            })
            ->when($phone, function(Builder $builder, $phone){
                $builder->where('centralCustomer.phone', 'LIKE', "%{$phone}%");
            })
            ->when($document, function(Builder $builder, $document){
                $builder->where('centralCustomer.document', 'LIKE', "%{$document}%");
            })
            ->when($central->syncCustomers, function ($query) use ($central, $name, $phone, $document) {
                $query
                    ->unionAll(function (BuilderQuery $query) use ($central, $name, $phone, $document) {
                        $query
                            ->from('customer')
                            ->join('user', 'customer.userId', '=', 'user.idUser')
                            ->join(
                                'customerRegisterStatus', 'customer.customerRegisterStatusId', '=', 'customerRegisterStatus.idCustomerRegisterStatus')
                            ->leftJoin('centralCustomer AS linkedCentralCustomer', function ($join) use ($central) {
                                $join
                                    ->on('linkedCentralCustomer.userId', '=', 'user.idUser')
                                    ->where('linkedCentralCustomer.centralId', '=', $central->id)
                                    ->where('linkedCentralCustomer.statusId', '=', StatusConst::ACTIVE);
                            })
                            ->where('user.statusId', StatusConst::ACTIVE)
                            ->whereNull('linkedCentralCustomer.id')
                            ->selectRaw("
                        null AS id,
                        customer.idCustomer AS customerId,
                        user.idUser AS userId,
                        user.name,
                        REGEXP_REPLACE(user.phone, '[^0-9A-Za-z]', '') AS phone,
                        REGEXP_REPLACE(user.document, '[^0-9A-Za-z]', '') AS document,
                        user.dateOfBirth,
                        null AS centralId,
                        0 AS isCompany,
                        customer.customerRegisterStatusId,
                        customerRegisterStatus.name AS customerRegister,
                        user.created_at
                    ")
                            ->when($name, function(BuilderQuery $builder, $name){
                                $builder
                                    ->where('user.name', 'LIKE', "%{$name}%");
                            })
                            ->when($phone, function(BuilderQuery $builder, $phone){
                                $sanitized = preg_replace('/[^0-9A-Za-z]/', '', $phone);
                                $builder
                                    ->whereRaw(
                                        "REGEXP_REPLACE(user.phone, '[^0-9A-Za-z]', '') LIKE ?",
                                        ["%{$sanitized}%"]
                                    );
                            })
                            ->when($document, function(BuilderQuery $builder, $document){
                                $sanitized = preg_replace('/[^0-9A-Za-z]/', '', $document);
                                $builder
                                    ->whereRaw(
                                        "REGEXP_REPLACE(user.document, '[^0-9A-Za-z]', '') LIKE ?",
                                        ["%{$sanitized}%"]
                                    );
                            });
                    });
            })
            ->orderByDesc('created_at')
            ->paginate(PaginationConst::LIMIT_PER_PAGE);
    }
}
