<?php

namespace app\controllers;

use app\utils\BaseDao;
use Exception;

class SmtpServerController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $dao = new BaseDao();

            if ($method === 'GET') {
                $sql = "SELECT id, mailer, fromMailer, fromName, username, host, port, encryption, statusId, `default`, retry, created_at, updated_at 
                        FROM smtpServer 
                        WHERE statusId = 1 
                        ORDER BY id DESC";
                $result = $dao->sqlRawSelect($sql)->get();
                if (!is_array($result)) {
                    $result = [];
                } else {
                    foreach ($result as &$r) {
                        $r['id'] = (int)$r['id'];
                        $r['default'] = (int)$r['default'];
                        $r['statusId'] = (int)$r['statusId'];
                    }
                }

                echo $this->returnSuccess("Servidores SMTP", $result);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $mailer = $data->mailer ?? ($data->host ?? 'smtp.office365.com');
                $fromMailer = $data->fromMailer ?? ($data->emailRemetent ?? '');
                $fromName = $data->fromName ?? ($data->nameRemetent ?? '');
                $host = $data->host ?? '';
                $port = (string)($data->port ?? '587');
                $username = $data->username ?? '';
                $password = $data->password ?? '';
                $encryption = $data->encryption ?? ($data->cryptography ?? 'tls');
                $default = !empty($data->default) ? 1 : 0;

                if ($default) {
                    $dao->sqlRawSelect("UPDATE smtpServer SET `default` = 0");
                }

                $dao->sqlRawSelect("INSERT INTO smtpServer (mailer, fromMailer, fromName, host, port, username, password, encryption, statusId, `default`, created_at, updated_at) 
                                    VALUES (:mailer, :fromMailer, :fromName, :host, :port, :username, :password, :encryption, 1, :default, NOW(), NOW())", [
                    ':mailer' => $mailer,
                    ':fromMailer' => $fromMailer,
                    ':fromName' => $fromName,
                    ':host' => $host,
                    ':port' => $port,
                    ':username' => $username,
                    ':password' => $password,
                    ':encryption' => $encryption,
                    ':default' => $default
                ]);

                echo $this->returnSuccess("Servidor SMTP cadastrado com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao processar serviço SMTP");
        }
    }

    public function actionDisable()
    {
        try {
            $dao = new BaseDao();
            $dao->sqlRawSelect("UPDATE smtpServer SET `default` = 0 WHERE statusId = 1");
            echo $this->returnSuccess("Padrão desativado com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdate()
    {
        try {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            $data = $this->request(false);
            if (!$id && isset($data->id)) {
                $id = (int)$data->id;
            }

            if (!$id) {
                throw new Exception("ID do serviço SMTP não informado.");
            }

            $dao = new BaseDao();
            $mailer = $data->mailer ?? ($data->host ?? null);
            $fromMailer = $data->fromMailer ?? ($data->emailRemetent ?? null);
            $fromName = $data->fromName ?? ($data->nameRemetent ?? null);
            $host = $data->host ?? null;
            $port = isset($data->port) ? (string)$data->port : null;
            $username = $data->username ?? null;
            $password = $data->password ?? null;
            $encryption = $data->encryption ?? ($data->cryptography ?? null);
            $default = isset($data->default) ? (!empty($data->default) ? 1 : 0) : null;

            if ($default === 1) {
                $dao->sqlRawSelect("UPDATE smtpServer SET `default` = 0");
            }

            $fields = ["updated_at = NOW()"];
            $params = [':id' => $id];

            if ($mailer !== null) { $fields[] = "mailer = :mailer"; $params[':mailer'] = $mailer; }
            if ($fromMailer !== null) { $fields[] = "fromMailer = :fromMailer"; $params[':fromMailer'] = $fromMailer; }
            if ($fromName !== null) { $fields[] = "fromName = :fromName"; $params[':fromName'] = $fromName; }
            if ($host !== null) { $fields[] = "host = :host"; $params[':host'] = $host; }
            if ($port !== null) { $fields[] = "port = :port"; $params[':port'] = $port; }
            if ($username !== null) { $fields[] = "username = :username"; $params[':username'] = $username; }
            if (!empty($password)) { $fields[] = "password = :password"; $params[':password'] = $password; }
            if ($encryption !== null) { $fields[] = "encryption = :encryption"; $params[':encryption'] = $encryption; }
            if ($default !== null) { $fields[] = "`default` = :default"; $params[':default'] = $default; }

            $sql = "UPDATE smtpServer SET " . implode(", ", $fields) . " WHERE id = :id";
            $dao->sqlRawSelect($sql, $params);

            echo $this->returnSuccess("Serviço SMTP atualizado com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRemove()
    {
        try {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) {
                throw new Exception("ID do serviço SMTP não informado.");
            }

            $dao = new BaseDao();
            $dao->sqlRawSelect("UPDATE smtpServer SET statusId = 2, updated_at = NOW() WHERE id = :id", [':id' => $id]);

            echo $this->returnSuccess("Serviço deletado com sucesso!");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
