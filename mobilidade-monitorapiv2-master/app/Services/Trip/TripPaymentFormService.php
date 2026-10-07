<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:11
 */

namespace App\Services\Trip;


use App\Constants\StatusConst;
use App\Http\Requests\Trip\TripPaymentFormRequest;
use App\Models\Trip\TripPaymentForm;
use App\Repositories\Trip\TripPaymentFormRepository;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Stmt\TryCatch;

class TripPaymentFormService
{
    /**
     * @var TripPaymentFormRepository|Model
     */
    private $repository;

    public function __construct(TripPaymentFormRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository
            ->all();
    }

    public function insert(array $request)
    {
        $tripPaymentForm = new TripPaymentForm($request);

        $this->repository->save($tripPaymentForm);

        return $tripPaymentForm ;
    }


    public function delete($id)
    {
        $result= $this->repository->find($id);
        $result
        ->statusId = StatusConst::REMOVED;

        $this->repository->save($result);

        return true;

    }


    public function edit($id,array $params)
    {
        Try{
            $result = $this->repository->find($id);

            $result->update($params);


        }catch (\Exception $exception){
            throw $exception;
        }
         return $result;


    }

    public function enable($id){
        $result = $this->repository-> find($id);
        $result
            ->active = 1;
        $this->repository->save($result);

        return $result;


    }

    public function disable($id)

    {
        $result = $this-> repository -> find($id);
        $result
           ->active = 0;
        $this->repository->save($result);

        return $result;

    }

}
