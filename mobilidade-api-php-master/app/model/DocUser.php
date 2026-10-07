<?php

namespace app\model;

use app\utils\BaseModel;
use app\utils\File;
use app\utils\Photo;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 10:48
 */
class DocUser extends BaseModel
{
    protected $id;
    protected $docId;
    protected $userId;
    protected $text;
    protected $image;
    protected $pdf;
    protected $docStatusId;
    protected $statusId;
    protected $created_at;
    protected $updated_at;

    protected $primaryKey = 'id';

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);

        $this->updated_at = now();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return DocUser
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDocId()
    {
        return $this->docId;
    }

    /**
     * @param mixed $docId
     * @return DocUser
     */
    public function setDocId($docId)
    {
        $this->docId = $docId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     * @return DocUser
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * @param mixed $text
     * @return DocUser
     */
    public function setText($text)
    {
        $this->text = $text;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getImage()
    {
        return $this->fixImageUrl($this->image);
    }

    /**
     * Corrige URLs com barras duplas
     */
    private function fixImageUrl($url)
    {
        if (!$url) return $url;
        
        // Remove barras duplas, mas preserva o protocolo (https://)
        return preg_replace('/([^:])\/\/+/', '$1/', $url);
    }

    /**
     * @param mixed $image
     * @return DocUser
     * @throws Exception
     */
    public function setImage($image)
    {
        $photo = new Photo;
        
        $userId = $this->userId ?? '';
        $prefix = $userId ? $userId . 'doc-' : 'doc-';

        $this->image =
            $photo->save(
                $image, "user/{$userId}/docs/", $prefix);

        return $this;
    }

    public function getPdf()
    {
        return $this->fixImageUrl($this->pdf);
    }

    public function setPdf($pdf)
    {
        $file = new File;
        
        $userId = $this->userId ?? '';
        $prefix = $userId ? $userId . 'doc-' : 'doc-';

        $this->pdf =
            $file->save(
                $pdf, "user/{$userId}/docs/", $prefix);

        return $this;
    }

    /**
     * @return mixed
     */
    public function getDocStatusId()
    {
        return $this->docStatusId;
    }

    /**
     * @param mixed $docStatusId
     * @return DocUser
     */
    public function setDocStatusId($docStatusId)
    {
        $this->docStatusId = $docStatusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusId()
    {
        return $this->statusId;
    }

    /**
     * @param mixed $statusId
     * @return DocUser
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param false|string $created_at
     * @return DocUser
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param false|string $updated_at
     * @return DocUser
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return array
     */
    public function extract()
    {
        $array = get_object_vars($this);

        unset($array['table']);
        unset($array['primaryKey']);

        return $array;
    }

    public function setImagePath(string $path): void
    {
        $this->image = $path;
    }

    public function setPdfPath(string $path): void
    {
        $this->pdf = $path;
    }
}