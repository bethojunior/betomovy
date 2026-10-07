<?php

namespace App\Contracts\Realtime;

use Google\Cloud\Firestore\FirestoreClient;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 18:58
 */
abstract class CloudFirestoreRealtime
{
    /** @var bool|FirestoreClient $db */
    protected $db;

    /** @var bool */
    protected $active;

    protected $documentId;

    protected $collection;

    /**
     * @return array
     */
    public function extractData()
    {
        $data = get_object_vars($this);

        unset($data['db']);
        unset($data['active']);
        unset($data['collection']);
        unset($data['documentId']);

        return $data;
    }

    /**
     * @param mixed $documentId
     * @return $this
     */
    public function setDocumentId($documentId)
    {
        $this->documentId = $documentId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDocumentId()
    {
        return $this->documentId;
    }

    /**
     * @return mixed
     */
    public function getCollection()
    {
        return $this->collection;
    }
}
