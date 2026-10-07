<?php


namespace Delivery\Http\Controllers\Driver;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Repositories\Driver\DriverAttachmentTypeRepository;

class DriverAttachmentTypeController extends Controller
{
    /**
     * @var DriverAttachmentTypeRepository
     */
    private $repository;

    public function __construct(DriverAttachmentTypeRepository $repository)
    {

        $this->repository = $repository;
    }

    public function findAll()
    {
        try {
            $result = $this->repository->findAll();
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao buscar acessórios do motorista");
        }

        return ApiResponse::success($result, "Listagem de acessórios do motorista");
    }
}
