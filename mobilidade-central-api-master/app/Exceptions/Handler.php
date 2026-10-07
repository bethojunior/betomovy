<?php

namespace App\Exceptions;

use App\Contracts\Exception\CustomException;
use App\Exceptions\ApiToken\ApiTokenException;
use App\Http\Responses\ApiResponse;
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\MassAssignmentException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        if (get_parent_class($exception) == CustomException::class) {
            return ApiResponse::error(
                $exception,
                'Ocorreu um erro na operação');
        } else if ($exception instanceof ValidationException) {
            return ApiResponse::error(
                $exception->errors(),
                'Parâmetros inválidos');
        } else if ($exception instanceof MethodNotAllowedHttpException) {
            return ApiResponse::error(
                $exception->getMessage(),
                'Método HTTP não permitido',
                405);
        } else if ($exception instanceof ApiTokenException) {
            return ApiResponse::error(
                $exception->getMessage(),
                'Requisição não autorizada',
                401);
        } else if ($exception instanceof \ErrorException) {
            return ApiResponse::error(
                $exception,
                'Erro interno',
                500);
        } else if ($exception instanceof MassAssignmentException) {
            return ApiResponse::error(
                $exception,
                'Erro interno',
                500);
        } else if ($exception instanceof QueryException) {
            return ApiResponse::error(
                $exception,
                'Erro interno',
                500);
        } else if ($exception instanceof InvalidArgumentException) {
            return ApiResponse::error(
                $exception,
                'Erro interno',
                500);
        } else if ($exception instanceof \BadMethodCallException) {
            return ApiResponse::error(
                $exception,
                'Erro interno',
                500);
        } else if ($exception instanceof NotFoundHttpException) {
            return \App\Http\Responses\ApiResponse::error(
                [], 'Not Found', 404);
        }

        return parent::render($request, $exception);
    }

    /**
     * Convert an authentication exception into a response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return $request->expectsJson()
            ? ApiResponse::error(
                $exception->getMessage(),
                'Requisição não autorizada',
                401)
            : redirect()->guest($exception->redirectTo() ?? route('login'));
    }
}
