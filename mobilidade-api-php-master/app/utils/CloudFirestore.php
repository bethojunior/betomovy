<?php

namespace app\utils;

use app\dao\LogDao;
use app\model\Config;
use Google\Cloud\Core\Exception\GoogleException;
use Google\Cloud\Firestore\CollectionReference;
use Google\Cloud\Firestore\DocumentSnapshot;
use Google\Cloud\Firestore\FirestoreClient;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/04/2019
 * Time: 10:47
 */
abstract class CloudFirestore
{
    /** @var bool|FirestoreClient $db */
    protected $db;
    /** @var string $collection */
    protected $collection;

    protected $documentId;
    /**
     * @var bool
     */
    protected $active;

    /**
     * CloudFirestore constructor.
     * @param bool $active
     */
    public function __construct(bool $active = true)
    {
        $this->collection =
            $this->collection ??
            strtolower(str_replace('Realtime', '', get_class($this)));

        $this->active = $active;
        $this->db = false;
    }

    private function startClient()
    {
        if ($this->db instanceof FirestoreClient) {
            return;
        }

        try {
            if ($this->active) {
                if (file_exists('../configs/env/env.json')) {
                    $this->db = new FirestoreClient([
                        'keyFile' =>
                            json_decode(
                                file_get_contents('../configs/env/env.json'),
                            true),
                    ]);
                } else {
                    $keyFile = Config::get('google_service_account_json');
                    $this->db = new FirestoreClient([
                        'keyFile' => json_decode($keyFile, true),
                    ]);
                }
            }
        } catch (GoogleException $e) {
            (new LogDao)->logException($e);
            $this->db = false;
        }
    }

    /**
     * @return array|bool
     */
    public function getAll()
    {
        $this->startClient();

        if (!$this->db)
            return false;

        $documents = $this->db
            ->collection($this->collection)
            ->documents()
            ->rows();

        $results = [];

        foreach ($documents as $documentSnapshot) {
            $results[] = $documentSnapshot->data();
        }

        return $results;
    }

    public function deleteMany($fieldPath, $operator, $value)
    {
        $this->startClient();

        if (!$this->db)
            return false;

        $results = $this->db
            ->collection($this->collection)
            ->where($fieldPath, $operator, $value)
            ->documents()
            ->rows();

        $this->deleteWithBatch($results);

        return true;
    }

    public function delete()
    {
        $this->startClient();

        if (!$this->db)
            return false;

        $this->db
            ->collection($this->collection)
            ->document($this->documentId)
            ->delete();

        $data = $this->extractData();

        foreach ($data as $key => $value) {
            $this->$key = null;
        }

        return true;
    }

    /**
     * @return CollectionReference
     */
    protected function getCollectionReference()
    {
        $this->startClient();

        return $this->db
            ->collection($this->collection);
    }

    /**
     * @param array $fields
     * @param array $options
     * @return bool|CloudFirestore
     */
    public function save($fields = [], $options = [])
    {
        $this->startClient();

        if (!$this->db)
            return false;

        $data = empty($fields) ?
            $this->extractData() :
            $fields;

        $this->db
            ->collection($this->collection)
            ->document($this->documentId)
            ->set($data, $options);

        return $this;
    }

    public function update($fields = [])
    {
        $this->startClient();

        if (!$this->db)
            return false;

        $data = empty($fields) ?
            $this->extractData() :
            $fields;

        $update = array();

        // Monta o array de updates para o Firestore
        foreach ($data as $key => $value) {
            if ($key === 'blockedDrivers') {
                // Sempre envia blockedDrivers, mesmo se vazio
                $update[] = [
                    'path' => $key,
                    'value' => $value ?? [],
                ];
            } else if ($key === 'driverId' || $key === 'driver') {
                // Sempre envia driverId/driver, mesmo null (ex: motorista cancelou e a viagem ficou sem motorista)
                $update[] = [
                    'path' => $key,
                    'value' => $value,
                ];
            } else if (!$value) {
                continue;
            } else {
                $update[] = [
                    'path' => $key,
                    'value' => $value,
                ];
            }
        }

        $this->db
            ->collection($this->collection)
            ->document($this->documentId)
            ->update($update);

        return $this;
    }

    /**
     * @param DocumentSnapshot[] $documentsSnapshot
     * @return array|bool
     */
    protected function deleteWithBatch(array $documentsSnapshot)
    {
        $this->startClient();

        if (empty($documentsSnapshot) || !$this->db)
            return false;

        $batch = $this->db->batch();

        foreach ($documentsSnapshot as $documentSnapshot) {
            $batch->delete($documentSnapshot->reference());
        }

        return $batch->commit();
    }

    /**
     * @return array
     */
    private function extractData()
    {
        $data = get_object_vars($this);

        unset($data['db']);
        unset($data['collection']);
        unset($data['documentId']);
        unset($data['active']);
        
        // Garante que blockedDrivers seja sempre um array
        if (isset($data['blockedDrivers'])) {
            if (!is_array($data['blockedDrivers'])) {
                $data['blockedDrivers'] = [];
            }
        }

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
}