<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/06/2019
 * Time: 10:41
 */

namespace Api\Http\Responses;


use Common\Contracts\Exception\CustomException;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Concerns\FromArray;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ApiResponse
{
    /**
     * @param $data
     * @param string $message
     * @return JsonResponse
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
     * @param Exception|null $data
     * @param string $message
     * @param int $status
     * @param bool $paramError
     * @return JsonResponse
     */
    public static function error($data = null, $message = 'Error', $status = 400, $paramError = false)
    {
        if ($data instanceof \Throwable)
            return response()->json([
                'status'        => false,
                'response'      => self::mountErrorResponse($data),
                'message'       => $data instanceof CustomException ? $data->getMessage() : $message,
                'paramError'    => $data instanceof CustomException
            ],
            $data instanceof CustomException ? $status : 500);

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
     * @return JsonResponse
     */
    public static function success($data = null, $message = 'Sucesso')
    {
        return response()->json([
            'status'    => true,
            'response'  => $data,
            'message'   => $message
        ]);
    }

    private static function mountErrorResponse(\Throwable $exception)
    {
        $response = [$exception->getMessage()];

        if (env('APP_ENV') != 'production')
            array_push($response, $exception->getFile(), $exception->getLine());

        return $response;
    }

    /**
     * @param array $data
     * @param array|null $columns
     * @param string|null $customTitle
     * @return string
     */
    public static function simpleExcel(array $data, array $columns = null, string $customTitle = null)
    {
        $response = '';

        $isPrintHeader = false;
        foreach ($data as $row) {
            if (!$isPrintHeader) {
                $keys = $columns ?? array_keys($row);
                $response .= implode("\t", $keys) . "\n";
                $isPrintHeader = true;
            }

            $response .= implode("\t", array_values($row)) . "\n";
        }

        $title = $customTitle ?? 'export_' . time();
        $filename = $title . '.xlsx';

        header("Content-Type: application/vnd.ms-excel");
        header("Content-Disposition: attachment; filename=\"$filename\"");

        return $response;
    }

    /**
     * @param FromArray $export
     * @param string|null $customTitle
     * @param bool $isPdf
     * @return Response|BinaryFileResponse
     */
    public static function arrayExcel(FromArray $export, $isPdf = false, string $customTitle = null)
    {
        ini_set('memory_limit', '-1');
        if ($isPdf)
            return self::pdfView($export->array(), $customTitle);

        if ($customTitle)
            $customTitle = "$customTitle.xls";

        return \Excel::download($export, $customTitle ?? 'export_' . time(). '.xls');
    }


    private static function pdfView(array $data, ?string $customTitle = null)
    {
        $pdf = PDF::loadView('pdf.view', compact('data'));
        $pdf->setPaper('b3', 'landscape');

        if ($customTitle)
            $customTitle = "$customTitle.pdf";

        return $pdf->download($customTitle ?? 'export_' . time(). '.pdf');
    }
}
