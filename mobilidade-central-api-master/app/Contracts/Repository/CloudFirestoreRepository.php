<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 18:57
 */

namespace App\Contracts\Repository;


use App\Contracts\Realtime\CloudFirestoreRealtime;
use App\Models\Config\Config;
use Google\Cloud\Firestore\FirestoreClient;

abstract class CloudFirestoreRepository extends CloudFirestoreRealtime
{
    /**
     * CloudFirestore constructor.
     * @param bool $active
     */
    public function __construct(bool $active = true)
    {
        $this->active = $active;
    }

    private function startClient()
    {
        if ($this->db instanceof FirestoreClient) {
            return;
        }

        $file = 'credentials' . DIRECTORY_SEPARATOR . env('GOOGLE_SERVICE_ACCOUNT_FILE');

        if (!file_exists($file)) {
            $file = '../' . $file;
        }

        try {
            if (!file_exists($file)) {
                $keyFile = Config::getConf('google_service_account_json');
                $this->db = $this->active ? new FirestoreClient([
                    'keyFile' => json_decode($keyFile, true),
                ]) : false;
            } else {
                $this->db = $this->active ?
                    new FirestoreClient([
                        'keyFile' =>
                        json_decode(file_get_contents($file), true)
                    ]) : false;
            }
        } catch (\Exception $e) {
            $this->db = false;
        }
    }

    public function deleteMany($fieldPath, $operator, $value)
    {
        $this->startClient();

        if (!$this->db) {
            return false;
        }

        $results = $this->db
            ->collection($this->getCollection())
            ->where($fieldPath, $operator, $value)
            ->documents()
            ->rows();

        $this->deleteWithBatch($results);

        return true;
    }

    public function delete()
    {
        $this->startClient();

        if (!$this->db) {
            return false;
        }

        $this->db
            ->collection($this->getCollection())
            ->document($this->getDocumentId())
            ->delete();

        return true;
    }

    /**
     * @param array $fields
     * @param array $options
     * @return bool|CloudFirestoreRepository
     */
    public function save($fields = [], $options = [])
    {
        $this->startClient();

        if (!$this->db) {
            return false;
        }

        $data = empty($fields) ? $this->extractData() : $fields;

        $result = $this->db
            ->collection($this->getCollection())
            ->document($this->getDocumentId())
            ->set($data, $options);

        return $result;
    }

    /**
     * @param \Google\Cloud\Firestore\DocumentSnapshot[] $documentsSnapshot
     * @return array|bool
     */
    private function deleteWithBatch(array $documentsSnapshot)
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
}
