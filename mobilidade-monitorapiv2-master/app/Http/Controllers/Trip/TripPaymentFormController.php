<?php

namespace App\Http\Controllers\Trip;

use App\Http\Requests\Trip\TripPaymentFormRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Trip\TripPaymentFormService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TripPaymentFormController extends Controller
{
    /**
     * @var TripPaymentFormService
     */
    private $service;

    public function __construct(TripPaymentFormService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $tripPaymentForms = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar as formas de pagamento");
        }

        return ApiResponse::success($tripPaymentForms, "Formas de pagamento encontradas");
    }

    public function insert(TripPaymentFormRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir a forma de pagamento");
        }

        return ApiResponse::created($result, "Forma de pagamento criado com sucesso");
    }

    public function edit($id , TripPaymentFormRequest  $request)
    {
        try{
            $result = $this->service
                ->edit($id,$request->all());
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Erro ao editar a forma de pagamento");
        }

        return ApiResponse::success($result);
    }


    public function delete($id)
    {

        try {
            $result = $this -> service
                ->delete($id);

        }catch(\Exception $e){

            return ApiResponse::error($e, "Erro ao deletar a forma de pagamento");
        }

        return ApiResponse::success($result,"Forma de pagamento excluida com sucesso");

        }

    public function enable($id)
    {

        try {
            $result = $this -> service
                ->enable($id);

        }catch(\Exception $e){

            return ApiResponse::error($e, "Erro ao habilitar a forma de pagamento");
        }

        return ApiResponse::success($result);

    }

    public function disable($id)
    {

        try{

            $result = $this -> service
                -> disable($id);

        }catch (\Exception $e){

            return ApiResponse::error($e, "Erro ao desabilitar a forma de pagamento");
        }

        return ApiResponse::success($result);

        }



}
