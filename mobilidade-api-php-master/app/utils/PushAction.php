<?php

namespace app\utils;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/11/2018
 * Time: 17:13
 */
class PushAction
{
    private $icon;
    private $title;
    private $callback;
    private $foreground;
    private $inline;
    private $replyLabel;

    public function __construct()
    {
        // Default values
        $this->foreground = false;
    }

    /**
     * @return mixed
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param mixed $icon
     * @return PushAction
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     * @return PushAction
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCallback()
    {
        return $this->callback;
    }

    /**
     * @param mixed $callback
     * @return PushAction
     */
    public function setCallback($callback)
    {
        $this->callback = $callback;
        return $this;
    }

    /**
     * @return bool
     */
    public function isForeground(): bool
    {
        return $this->foreground;
    }

    /**
     * @param bool $foreground
     * @return PushAction
     */
    public function setForeground(bool $foreground): PushAction
    {
        $this->foreground = $foreground;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getInline()
    {
        return $this->inline;
    }

    /**
     * @param mixed $inline
     * @return PushAction
     */
    public function setInline($inline)
    {
        $this->inline = $inline;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getReplyLabel()
    {
        return $this->replyLabel;
    }

    /**
     * @param mixed $replyLabel
     * @return PushAction
     */
    public function setReplyLabel($replyLabel)
    {
        $this->replyLabel = $replyLabel;
        return $this;
    }

    public function extract()
    {
        return get_object_vars($this);
    }
}