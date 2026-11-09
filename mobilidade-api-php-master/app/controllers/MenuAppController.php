<?php

namespace app\controllers;

use app\dao\MenuAppDao;
use app\dao\GenericDao;
use Exception;

class MenuAppController extends ApiController
{
    public function actionFindByType()
    {
        try {
            echo $this->returnSuccess((new MenuAppDao())->findByType($this->requestQuery()->type));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar MenuApp");
        }
    }

    public function actionGetPro()
    {
        try {
            $sql = "SELECT m.*, mt.name as menu_app_type_name 
                    FROM menuApp m 
                    LEFT JOIN menuAppType mt ON m.menuAppTypeId = mt.id 
                    WHERE m.deleted_at IS NULL";
            $items = GenericDao::get($sql);
            $link_storage = \app\model\Config::get('link_storage_pictures') ?? '';
            foreach ($items as &$item) {
                if (!empty($item['linkImage']) && !preg_match('/^https?:\/\//', $item['linkImage'])) {
                    $item['linkImage'] = $link_storage . $item['linkImage'];
                }
                $item['buttonsActions'] = json_decode($item['buttonsActions'] ?? '{}', true) ?: ['like' => false, 'share' => false];
                $item['buttonCta'] = json_decode($item['buttonCta'] ?? '{}', true) ?: ['link' => '', 'name' => '', 'checked' => false];
                $item['menu_app_type'] = [
                    'id' => $item['menuAppTypeId'] ?? 0,
                    'name' => $item['menu_app_type_name'] ?? ''
                ];
            }
            echo $this->returnSuccess("Menus encontrados com sucesso", $items);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar menus");
        }
    }

    public function actionTypes()
    {
        try {
            $types = GenericDao::get("SELECT id, name FROM menuAppType WHERE deleted_at IS NULL ORDER BY name ASC");
            if (empty($types)) {
                $types = [
                    ['id' => 1, 'name' => 'Link Externo'],
                    ['id' => 2, 'name' => 'Publicidade'],
                    ['id' => 3, 'name' => 'Parceiro']
                ];
            }
            echo $this->returnSuccess("Tipos encontrados com sucesso", $types);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar tipos");
        }
    }
}
