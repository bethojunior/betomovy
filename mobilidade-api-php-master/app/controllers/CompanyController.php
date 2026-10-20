<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\services\CompanyService;
use app\services\RegisterCompanyService;
use Exception;

class CompanyController extends ApiController
{
    public function actionIndex()
    {
        try {
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

            $rows = GenericDao::query($sql, $params);
            $result = [];

            foreach ($rows as $r) {
                $r['id'] = (int)$r['id'];
                $r['idCompany'] = (int)$r['idCompany'];
                $result[] = $r;
            }

            echo $this->returnSuccess("Empresas", $result);
        } catch (Exception $e) {
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
            echo $this->returnSuccess("Status do campo",
                (new CompanyService)
                    ->fieldCheck($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao verificar o campo");
        }
    }
}
