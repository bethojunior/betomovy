<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/10/2019
 * Time: 14:30
 */

namespace App\Repositories\Company;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Helpers\PhoneHelper;
use App\Helpers\CnpjHelper;
use App\Helpers\CityAuthorizationHelper;
use App\Models\Company\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class CompanyRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Company::class);
    }

    public function findAll($user, array $request = [], $cityId = null)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->when(!$user->role->support, function (Builder $query) use ($cityId) {
                CityAuthorizationHelper::restrictToCity($query, $cityId, 'cityId');
            })
            ->orderByDesc('created_at')
            ->when(isset($request['fantasyName']), function (Builder $query) use ($request) {
                $query
                    ->where('fantasyName', 'LIKE', "%".$request['fantasyName']."%");
            })
            ->when(isset($request['document']), function (Builder $query) use ($request) {
                $validatedCnpj = CnpjHelper::validateCnpj($request['document']);
                $query->whereRaw(
                    'REPLACE(REPLACE(REPLACE(document, \'.\', \'\'), \'-\', \'\'), \'\/\', \'\') LIKE ?',
                    '%' . $validatedCnpj . '%'
                );
            })
            ->when(isset($request['email']), function (Builder $query) use ($request) {
                $query
                    ->where('email', 'LIKE', "%".$request['email']."%");
            })
            ->when(isset($request['phone']), function (Builder $query) use ($request) {
                $validatedPhone = PhoneHelper::normalizePhone($request['phone']);
                $query->whereRaw(
                    'REPLACE(REPLACE(REPLACE(phone, \'.\', \'\'), \'-\', \'\'), \'\/\', \'\') LIKE ?',
                    '%' . $validatedPhone . '%'
                );
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('cityId', $request['cityId']);
            })
            ->when(isset($request['companyRegisterStatusId']), function (Builder $query) use ($request) {
                $query
                    ->where('companyRegisterStatusId', $request['companyRegisterStatusId']);
            })
            ->with([
                'companyRegisterStatus',
                'balance' => function ($query) {
                    $query
                        ->select('idBalance', 'tripBalance');
                }
            ])
            ->when((isset($request['paginate']) && $request['paginate'] == 1),
                function (Builder $query){
                    return
                        $query->paginate();
                },
                function (Builder $query) {
                    return
                        $query->get();
            });
    }
    public function findFully($id)
    {
        return $this->getModel()
            ::where('company.statusId', StatusConst::ACTIVE)
            ->leftJoin('city', 'city.id', 'company.cityId')
            ->select(
                'company.*',
                'city.estado as stateId'
            )
            ->with('companyRegisterStatus', 'balance')
            ->find($id);
    }

    public function getAllActives()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
