<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/06/2019
 * Time: 10:41
 */

namespace App\Http\Responses;


use App\Contracts\Exception\CustomException;

class ApiResponse
{
    /**
     * @param $data
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    public static function created($data = null, $message = 'Criado com sucesso')
    {
        return response()->json([
            'status'    => true,
            'response'  => $data,
            'message'   => $message
        ], 201);
    }

    /**
     * @param \Exception|null $data
     * @param string $message
     * @param int $status
     * @param bool $paramError
     * @return \Illuminate\Http\JsonResponse
     */
    public static function error($data = null, $message = 'Error', $status = 400, $paramError = false)
    {
        if ($data instanceof \Exception) {
            $response = [
                'status'        => false,
                'response'      => self::mountErrorResponse($data),
                'message'       => $data instanceof CustomException ? $data->getMessage() : $message,
                'paramError'    => $data instanceof CustomException
            ];

            if (env('APP_ENV') != 'production')
                $response += ['debug' => ['file' => $data->getFile(), 'line' => $data->getLine()]];

            return response()->json($response, $data instanceof CustomException ? $status : 500);
        }

        return response()->json([
            'status'        => false,
            'response'      => $data,
            'message'       => $message,
            'paramError'    => $paramError
        ], $status);
    }

    /**
     * @param $data
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    public static function success($data = null, $message = 'Sucesso')
    {
        return response()->json([
            'status'    => true,
            'response'  => $data,
            'message'   => $message
        ]);
    }

    private static function mountErrorResponse(\Exception $exception)
    {
        return [$exception->getMessage()];
    }
}
