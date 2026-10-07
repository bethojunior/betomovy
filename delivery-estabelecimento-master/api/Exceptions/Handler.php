<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/06/2020
 * Time: 15:38
 */

namespace Api\Exceptions;


use Api\Exceptions\ApiToken\ApiTokenException;
use Api\Http\Responses\ApiResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler
{
    public static function handleApiException(Throwable $exception)
    {
        if ($exception instanceof ApiTokenException) {
            return ApiResponse::error(
                $exception->getMessage(),
                'Requisição não autorizada',
                401);
        } elseif ($exception instanceof NotFoundHttpException) {
            return ApiResponse::error(
                [],
                'Not Found',
                404,
                true);
        } else if ($exception instanceof ValidationException) {
            return ApiResponse::error(
                self::filterValidatorErrors($exception->errors()),
                'Parâmetros inválidos',
                400,
                true);
        } else if ($exception instanceof \TypeError) {
            return ApiResponse::error(
                $exception,
                'Erro interno',
                500,
                false
            );
        }

        return null;
    }

    private static function filterValidatorErrors(array $errors)
    {
        $paramMessages = [];
        foreach ($errors as $error) {
            foreach ($error as $message) {
                $paramMessages[] = $message;
            }
        }

        return $paramMessages;
    }
}
