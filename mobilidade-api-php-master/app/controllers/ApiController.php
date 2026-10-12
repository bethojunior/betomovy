<?php

namespace app\controllers;

use app\exceptions\ApiTokenException;
use app\exceptions\RequestValidatorException;
use app\utils\BaseException;
use Google\Cloud\Core\Exception\ServiceException;
use PDO;
use PDOException;
use Throwable;

/**
 * Class ApiController
 * @package utils
 */
class ApiController
{
    /**
     * @param bool $stdObject
     * @param bool $isFormData
     * @return mixed|object
     * @throws RequestValidatorException
     */
    protected function request($stdObject = true, $isFormData = false)
    {
        $json = !$isFormData ?
            json_decode(file_get_contents('php://input')) :
            (object)array_map(function ($item) {
                return json_decode($item);
            }, $_POST);

        $object = $stdObject ? $this->getJson($json) : $json;

        $object = $this->prepareRequest($object);

        if ($isFormData)
            if (count(get_object_vars($object)) < 1)
                throw new RequestValidatorException(1100);

        return $object;
    }

    protected function requestQuery()
    {
        return (object)$_GET;
    }

    public function prepareRequest($request)
    {

        if (!is_object($request)) {
            return $request;
        }

        $property = get_object_vars($request);

        foreach ($property as $key => $value) {
            if (is_object($request->$key)) {
                $request->$key = $this->prepareRequest($request->$key);
                continue;
            }

            if (!is_string($request->$key))
                continue;

            $request->$key = strip_tags($value);
        }

        return $request;
    }

    protected function postRequest($index, $isJson = true)
    {
        return $isJson ? json_decode($_POST[$index]) : ($_POST[$index] ?? null);
    }

    public function returnSuccess($message, $data = [])
    {
        header('Content-Type: application/json');
        return json_encode([
            'status' => true,
            'message' => $message,
            'data' => $data,
            'response' => $data,
            'errors' => null
        ]);
    }

    public function onlyReturn($data)
    {
        header('Content-Type: application/json');
        return json_encode($data);
    }


    public function returnError($exception = null, $paramMessage = "", $status = 200, $data = null, $errors = [])
    {
        $message = $paramMessage != "" ?
            $paramMessage :
            (empty($exception) ?
                $paramMessage :
                $exception->getMessage());

        if ($exception instanceof ApiTokenException)
            header('HTTP/1.0 401 Unauthorized');
        else
            header("HTTP/1.0 {$status}");

        header('Content-Type: application/json');

        if ($paramMessage == "" && $exception instanceof PDOException)
            $message = 'Falha de comunicação. Cód: [50]';

        if ($paramMessage == "" && $exception instanceof ServiceException)
            $message = 'Falha de comunicação. Cód: [40]';

        $data = method_exists($exception, 'getData') ? $exception->getData() : $data;

        return json_encode([
            'status' => false,
            'message' => $message,
            'data' => $exception instanceof ApiTokenException ? null : $data,
            'response' => is_array($data) ? $data : [$message],
            'errors' => $exception instanceof Throwable ? [
                'code' => $exception instanceof BaseException ? $exception->getCode() : 0,
                'exception_code' => $exception->getCode(),
                'message' => $exception->getMessage(),
                'file' => !(env("ENV") == 'production') ? $exception->getFile() : null,
                'line' => !(env("ENV") == 'production') ? $exception->getLine() : null,
                'trace' => !(env("ENV") == 'production')? $exception->getTraceAsString() : null,
            ] : $errors
        ]);
    }

    private function getJson($json)
    {
        $obj = $json->stdObject;

        if (count($obj) > 1)
            return $obj;

        return $obj[0];
    }
}