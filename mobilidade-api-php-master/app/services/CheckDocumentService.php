<?php

namespace app\services;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/11/2018
 * Time: 09:52
 */
class CheckDocumentService
{
    public function sqlCheckDocument($document, $userTypeId, ?string $ignore = null)
    {
        $bind = [
            ':statusId' => Status::ATIVO,
            ':document' => $this->clearDocument($document)
        ];

        $sql_ignore = '';

        if ($ignore) {
            $bind[':ignore'] = $this->clearDocument($ignore);
            $sql_ignore = " AND REPLACE(REPLACE(u.document, '.', ''), '-', '') NOT LIKE :ignore";
        }

        $sql = "
            SELECT
                u.document
            FROM user u
              INNER JOIN levelAccess la ON la.userId = u.idUser
            WHERE 
              la.userTypeId IN ({$userTypeId}) AND 
              REPLACE(REPLACE(u.document, '.', ''), '-', '') LIKE :document AND
              u.statusId = :statusId
              {$sql_ignore}
              LIMIT 1
        ";

        return [
            'sql' => $sql,
            'bind' => $bind
        ];
    }

    public function sqlCheckDocumentAppPartner($document, $keyAppPartner, ?string $ignore = null)
    {
        $bind = [
            ':statusId' => Status::ATIVO,
            ':document' => $this->clearDocument($document),
        ];

        $sql_ignore = '';

        if ($ignore) {
            $bind[':ignore'] = $this->clearDocument($ignore);
            $sql_ignore = " AND REPLACE(REPLACE(u.document, '.', ''), '-', '') NOT LIKE :ignore";
        }

        $sql = "
            SELECT
                u.document,
                u.key_app_partner
            FROM user u
            WHERE  
              REPLACE(REPLACE(u.document, '.', ''), '-', '') LIKE :document AND
              u.statusId = :statusId
              {$sql_ignore}
              LIMIT 1
        ";

        if (!empty($keyAppPartner)) {
            $sql = str_replace(
                'u.statusId = :statusId',
                'u.statusId = :statusId AND u.key_app_partner = :appPartner',
                $sql
            );
            $bind[':appPartner'] = $keyAppPartner;
        }

        return [
            'sql' => $sql,
            'bind' => $bind
        ];
    }

    private function clearDocument($document)
    {
        $document = str_replace('.', '', $document);
        return str_replace('-', '', $document);
    }
}
