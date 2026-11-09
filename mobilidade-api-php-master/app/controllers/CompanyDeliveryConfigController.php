<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class CompanyDeliveryConfigController extends ApiController
{
    public function actionIndex()
    {
        $this->actionCompany();
    }

    public function actionCompany()
    {
        try {
            $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

            if ($method === 'GET') {
                $sql = "SELECT cdc.id,
                               cdc.companyId,
                               cdc.releaseMenu,
                               cdc.releaseDelivery,
                               COALESCE(cdc.picture, '') AS picture,
                               c.fantasyName,
                               COALESCE(c.establishmentCollectionManagementId, 0) AS establishmentCollectionManagementId
                        FROM companyDeliveryConfig cdc
                        INNER JOIN company c ON c.id = cdc.companyId
                        WHERE cdc.deleted_at IS NULL
                        ORDER BY cdc.id DESC";
                
                $rows = GenericDao::query($sql);
                $result = [];

                foreach ($rows as $row) {
                    $result[] = [
                        'id' => (int)$row['id'],
                        'companyId' => (int)$row['companyId'],
                        'releaseMenu' => (bool)(int)$row['releaseMenu'],
                        'releaseDelivery' => (bool)(int)$row['releaseDelivery'],
                        'picture' => $row['picture'],
                        'company' => [
                            'fantasyName' => $row['fantasyName'],
                            'establishmentCollectionManagementId' => (int)$row['establishmentCollectionManagementId']
                        ]
                    ];
                }

                echo $this->returnSuccess("Configurações de delivery por empresa", $result);
                return;
            }

            // POST /companyDeliveryConfig ou POST /companyDeliveryConfig/company/{id}
            $targetCompanyId = null;
            if (isset($_GET['id']) && is_numeric($_GET['id'])) {
                $targetCompanyId = (int)$_GET['id'];
            }

            $companyId = $targetCompanyId ?: (int)($_POST['companyId'] ?? 0);
            $releaseMenu = !empty($_POST['releaseMenu']) ? 1 : 0;
            $releaseDelivery = !empty($_POST['releaseDelivery']) ? 1 : 0;
            $perfilId = (int)($_POST['establishmentCollectionManagementId'] ?? 0);

            if (!$companyId) {
                throw new Exception("Empresa obrigatória.");
            }

            // Atualiza perfil na empresa
            if ($perfilId > 0) {
                GenericDao::execute("UPDATE company SET establishmentCollectionManagementId = :perfil WHERE id = :cid", [
                    ':perfil' => $perfilId,
                    ':cid' => $companyId
                ]);
            }

            // Upload de foto se enviado
            $pictureUrl = null;
            if (isset($_FILES['picture']) && !empty($_FILES['picture']['tmp_name'])) {
                $ext = pathinfo($_FILES['picture']['name'], PATHINFO_EXTENSION);
                $filename = 'delivery_est_' . $companyId . '_' . time() . '.' . $ext;
                $destDir = __DIR__ . '/../../public/uploads/delivery';
                if (!is_dir($destDir)) {
                    @mkdir($destDir, 0777, true);
                }
                if (@move_uploaded_file($_FILES['picture']['tmp_name'], $destDir . '/' . $filename)) {
                    $pictureUrl = '/uploads/delivery/' . $filename;
                }
            }

            // Upsert na companyDeliveryConfig
            $existing = GenericDao::first("SELECT id FROM companyDeliveryConfig WHERE companyId = :cid AND deleted_at IS NULL", [':cid' => $companyId]);

            if ($existing) {
                if ($pictureUrl) {
                    GenericDao::execute("UPDATE companyDeliveryConfig 
                                         SET releaseMenu = :menu, releaseDelivery = :deliv, picture = :pic, updated_at = NOW() 
                                         WHERE companyId = :cid", [
                        ':menu' => $releaseMenu,
                        ':deliv' => $releaseDelivery,
                        ':pic' => $pictureUrl,
                        ':cid' => $companyId
                    ]);
                } else {
                    GenericDao::execute("UPDATE companyDeliveryConfig 
                                         SET releaseMenu = :menu, releaseDelivery = :deliv, updated_at = NOW() 
                                         WHERE companyId = :cid", [
                        ':menu' => $releaseMenu,
                        ':deliv' => $releaseDelivery,
                        ':cid' => $companyId
                    ]);
                }
                echo $this->returnSuccess("Configuração de delivery atualizada com sucesso");
            } else {
                GenericDao::execute("INSERT INTO companyDeliveryConfig (companyId, releaseMenu, releaseDelivery, picture, created_at, updated_at) 
                                     VALUES (:cid, :menu, :deliv, :pic, NOW(), NOW())", [
                    ':cid' => $companyId,
                    ':menu' => $releaseMenu,
                    ':deliv' => $releaseDelivery,
                    ':pic' => $pictureUrl ?: ''
                ]);
                echo $this->returnSuccess("Configuração de delivery criada com sucesso");
            }
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
