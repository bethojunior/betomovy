<?php


namespace App\Http\Controllers\CancellationReasons;


use App\Http\Controllers\Controller;
use App\Services\CancellationReasons\CancellationReasonsTypeService;

class CancellationReasonsTypeController extends Controller
{
    /**
     * @var CancellationReasonsTypeService
     */
    private $service;

    /**
     * CancellationReasonsTypeController constructor.
     * @param CancellationReasonsTypeService $service
     */
    public function __construct(CancellationReasonsTypeService $service)
    {
        $this->service = $service;
    }
}
