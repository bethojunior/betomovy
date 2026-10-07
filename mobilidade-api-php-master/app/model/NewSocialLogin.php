<?php

namespace app\model;

use app\utils\BaseModel;

class NewSocialLogin extends BaseModel
{
    protected $id;
    protected $content;
    protected $expiration;
    protected $created_at;
    protected $updated_at;
    protected $table;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        $this->table = 'newLoginSocial';
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @param mixed $content
     * @return NewSocialLogin
     */
    public function setContent($content)
    {
        $this->content = $content;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExpiration()
    {
        return $this->expiration;
    }

    /**
     * @param mixed $expiration
     * @return NewSocialLogin
     */
    public function setExpiration($expiration)
    {
        $this->expiration = $expiration;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

     /**
     * @return mixed
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

}