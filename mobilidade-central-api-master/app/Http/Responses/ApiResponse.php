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
     * @return \Illuminate\Http\JsonResponse
     */
    public static function error($data = null, $message = 'Error', $status = 400)
    {
        if ($data instanceof \Exception)
            return response()->json([
                'status'    => false,
                'response'  => [
                    $data->getMessage(),
                    $data->getFile(),
                    $data->getLine(),
                ],
                'message'   => $message
            ],
            $data instanceof CustomException ? $status : 500);

        return response()->json([
            'status'    => false,
            'response'  => $data,
            'message'   => $message
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
}
