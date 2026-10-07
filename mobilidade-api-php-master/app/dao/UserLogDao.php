<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;
use app\model\Log;
use app\model\LogApp;
use app\model\LogType;
use stdClass;

/**
 * Created by PhpStorm.
 * Date: 30/08/2018
 * Time: 11:44
 */
class UserLogDao extends BaseDao
{

    /**
     * @param $data
     * @return bool
     * @throws Exception
     */
    public function logLogin($data)
    {
        try {
            $log = new Log(new stdClass, LogType::PROCESS);
            $log->setApp(LogApp::PWA);
            $log->setMessage("Login Efetuado");
            $log->setIdReference($data->idUser);
            $log->setUserId($data->idUser);
            $log->setData(json_encode($data));

            return $this->noSqlInsert($log->toStdClass());
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $data
     * @param string $message
     * @return bool
     * @throws Exception
     */
    public function logError($data, $message = "ERROR")
    {
        try {
            $log = new Log(new stdClass, LogType::ERROR);
            $log->setMessage(
                $data instanceof Exception ?
                    $data->getMessage() :
                    $message
            );
            $log->setDir(
                $data instanceof Exception ?
                    "File:" . $data->getFile() . " Line:" . $data->getLine() :
                    null
            );
            $log->setData(json_encode($data));
            $log->setApp(LogApp::PWA);

            return $this->noSqlInsert($log->toStdClass());
        } catch (Exception $e) {
            throw $e;
        }
    }
}
