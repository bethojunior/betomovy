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

abstract class CloudFirestoreRepository
{
    /** @var bool|FirestoreClient $db */
    protected $db;

    /**
     * @var CloudFirestoreRealtime $realtime
     */
    protected $realtime;

    /**
     * @var bool
     */
    protected $active;

    /**
     * CloudFirestore constructor.
     * @param CloudFirestoreRealtime $realtime
     * @param bool $active
     */
    public function __construct(CloudFirestoreRealtime $realtime, bool $active = true)
    {
        $this->realtime = $realtime;
        $this->active = $active;
    }

    private function startClient()
    {
        if ($this->db instanceof FirestoreClient) {
            return;
        }

        $file = 'credentials'. DIRECTORY_SEPARATOR .env('GOOGLE_SERVICE_ACCOUNT_FILE');

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
            ->collection(
                $this->realtime
                    ->getCollection())
            ->where($fieldPath, $operator, $value)
            ->documents()
            ->rows();

        $this->deleteWithBatch($results);

        return true;
    }

    /**
     * @return \Google\Cloud\Firestore\CollectionReference
     */
    protected function getRealtimeCollection()
    {
        $this->startClient();

        return $this->db
            ->collection($this->realtime->getCollection());
    }

    public function delete()
    {
        $this->startClient();

        if (!$this->db) {
            return false;
        }

        $this->db
            ->collection(
                $this->realtime
                    ->getCollection())
            ->document(
                $this->realtime
                    ->getDocumentId())
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

        $data = empty($fields) ?
            $this->realtime
                ->extractData() : $fields;

        $result = $this->db
            ->collection(
                $this->realtime
                    ->getCollection())
            ->document(
                $this->realtime
                    ->getDocumentId())
            ->set($data, $options);

        return $result;
    }

    /**
     * @param CloudFirestoreRealtime[] $items
     * @param array $fields
     * @param array $options
     * @return array|bool
     */
    public function saveMany(array $items, $fields = [], $options = [])
    {
        $this->startClient();

        if (!$this->db) {
            return false;
        }

        $batch = $this->db->batch();

        foreach ($items as $item) {
            $docRef = $this->db
                ->collection(
                    $this->realtime
                        ->getCollection())
                ->document($item->getDocumentId());

            $batch->set(
                $docRef,
                empty($fields) ? $item->extractData(): $fields,
                $options);
        }

        return $batch->commit();
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

    /**
     * @return CloudFirestoreRealtime
     */
    public function getRealtime(): CloudFirestoreRealtime
    {
        return $this->realtime;
    }

    /**
     * @param CloudFirestoreRealtime $realtime
     * @return CloudFirestoreRepository
     */
    public function setRealtime(CloudFirestoreRealtime $realtime): CloudFirestoreRepository
    {
        $this->realtime = $realtime;
        return $this;
    }

    public function deleteAll()
    {
        $this->startClient();

        if (!$this->db)
            return false;

        $collectionReference = $results = $this->db
            ->collection(
                $this->realtime
                    ->getCollection());

        $documents = $collectionReference->documents();

        while (!$documents->isEmpty()) {
            foreach ($documents as $document) {
                $document->reference()->delete();
            }
            $documents = $collectionReference->limit(0)->documents();
        }

        return true;
    }
}
