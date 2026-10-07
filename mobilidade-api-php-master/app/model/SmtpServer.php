<?php

namespace app\model;

use app\utils\BaseModel;

class SmtpServer extends BaseModel
{

    protected $id;
    protected $mailer;
    protected $fromMailer;
    protected $fromName;
    protected $username;
    protected $password;
    protected $host;
    protected $port;
    protected $encryption;
    protected $statusId;
    protected $default;
    protected $retry;

    protected $primaryKey = 'id';

    public function __construct($obj = null)
    {
        $this->created_at = now();
        parent::__construct($obj);
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
     * @return SmtpServer
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMailer()
    {
        return $this->mailer;
    }

    /**
     * @param mixed $mailer
     * @return SmtpServer
     */
    public function setMailer($mailer)
    {
        $this->mailer = $mailer;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFromMailer()
    {
        return $this->fromMailer;
    }

    /**
     * @param mixed $fromMailer
     * @return SmtpServer
     */
    public function setFromMailer($fromMailer)
    {
        $this->fromMailer = $fromMailer;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFromName()
    {
        return $this->fromName;
    }

    /**
     * @param mixed $fromName
     * @return SmtpServer
     */
    public function setFromName($fromName)
    {
        $this->fromName = $fromName;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @param mixed $username
     * @return SmtpServer
     */
    public function setUsername($username)
    {
        $this->username = $username;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     * @return SmtpServer
     */
    public function setPassword($password)
    {
        $this->password = $password;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getHost()
    {
        return $this->host;
    }

    /**
     * @param mixed $host
     * @return SmtpServer
     */
    public function setHost($host)
    {
        $this->host = $host;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPort()
    {
        return $this->port;
    }

    /**
     * @param mixed $port
     * @return SmtpServer
     */
    public function setPort($port)
    {
        $this->port = $port;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEncryption()
    {
        return $this->encryption;
    }

    /**
     * @param mixed $encryption
     * @return SmtpServer
     */
    public function setEncryption($encryption)
    {
        $this->encryption = $encryption;
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
     * @return SmtpServer
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDefault()
    {
        return $this->default;
    }

    /**
     * @param mixed $default
     * @return SmtpServer
     */
    public function setDefault($default)
    {
        $this->default = $default;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRetry()
    {
        return $this->retry;
    }

    /**
     * @param mixed $retry
     * @return SmtpServer
     */
    public function setRetry($retry)
    {
        $this->retry = $retry;
        return $this;
    }

}