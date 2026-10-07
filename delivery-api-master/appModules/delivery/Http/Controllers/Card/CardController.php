<?php

namespace Delivery\Http\Controllers\Card;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Repositories\Card\CardFlagRepository;

class CardController extends Controller
{
    public function __construct(CardFlagRepository $repository)
    {

        $this->repository = $repository;
    }

    public function listCardFlags(){
        try {
            $result = $this->repository->listFlags();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar as bandeiras de cartões");
        }

        return ApiResponse::success($result);
    }
}
