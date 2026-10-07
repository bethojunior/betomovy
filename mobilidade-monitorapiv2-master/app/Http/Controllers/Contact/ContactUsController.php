<?php


namespace App\Http\Controllers\Contact;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Contact\ContactUsService;
use Illuminate\Http\Request;

class ContactUsController extends Controller
{
    private $service;

    public function __construct(ContactUsService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $data = $this->service->findAll($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
