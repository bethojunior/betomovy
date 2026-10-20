<?php

namespace app\controllers;
use app\services\CompanyService;
use app\services\RegisterCompanyService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/07/2019
 * Time: 17:21
 */
class CompanyController extends ApiController
{
    public function actionIndex()
    {
        try {
            $dao = new \app\utils\BaseDao();
            $cityId = isset($_GET['cityId']) && !empty($_GET['cityId']) ? (int)$_GET['cityId'] : null;

            $where = ["c.statusId = 1"];
            $params = [];

            if ($cityId) {
                $where[] = "(c.cityId = :cityId OR c.cityId IS NULL)";
                $params[':cityId'] = $cityId;
            }

            $whereStr = implode(" AND ", $where);
            $sql = "SELECT c.idCompany AS id, c.idCompany, c.name, c.fantasyName, c.cnpj, c.phone, c.statusId, c.cityId 
                    FROM company c 
                    WHERE {$whereStr} 
                    ORDER BY c.idCompany DESC 
                    LIMIT 200";

            $rows = $dao->sqlRawSelect($sql, $params)->get();
            $result = is_array($rows) ? $rows : [];

            foreach ($result as &$r) {
                $r['id'] = (int)$r['id'];
                $r['idCompany'] = (int)$r['idCompany'];
            }

            echo $this->returnSuccess("Empresas", $result);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRegister()
    {
        try {
            echo $this->returnSuccess("Empresa registrada com sucesso",
                (new RegisterCompanyService)
                    ->register($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao cadastrar empresa");
        }
    }

    public function actionFieldCheck()
    {
        try {
            echo $this->returnSuccess("Campo permitido",
                (new CompanyService)->fieldCheck($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro na verificação do campo");
        }
    }
}