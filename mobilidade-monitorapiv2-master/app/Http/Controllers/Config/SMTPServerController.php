<?php

namespace App\Http\Controllers\Config;

use App\Http\Requests\Config\SMTPServerRequest;
use App\Http\Requests\Config\SMTPTestRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Config\SMTPServerService;
use Illuminate\Http\Request;

class SMTPServerController
{
    private $service;

    public function __construct(SMTPServerService $service)
    {
        $this->service = $service;
    }

    public function store(SMTPServerRequest $request)
    {
        try {
            $smtpServer = $this->service->create($request->validated());
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }
        return ApiResponse::created($smtpServer);
    }

    public function findAllActive()
    {
        try {
            $smtpServer = $this->service->findAllActive();
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }
        return ApiResponse::success($smtpServer);
    }


    public function disable()
    {
        try {
            $this->service->disable();
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }
        return ApiResponse::success(null);
    }

    public function removeSmtpServer($id)
    {
        try {
            $this->service->removeSmtpServer($id);
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }
        return ApiResponse::success(null);
    }

    public function editSmtpServer($id)
    {
        try {
            $smtpServer = $this->service->find($id);
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }
        return ApiResponse::success($smtpServer);
    }

    public function updateSmtpServer($id, SMTPServerRequest $request)
    {
        try {
            $smtpServer = $this->service->updateSmtpServer($id, $request->validated());
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }
        return ApiResponse::success($smtpServer);
    }


    public function testSmtp(SMTPTestRequest $request)
    {
        try {
            $this->service->validateSmtp($request->validated());
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }
        return ApiResponse::success("Email successfully sent");
    }
}
