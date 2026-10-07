<?php


namespace app\model;

use app\utils\BaseModel;

class MenuApp extends BaseModel
{
    protected $table = 'menuApp';
    protected $id;
    protected $description;
    protected $link;
    protected $menuAppTypeId;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return MenuApp
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     * @return MenuApp
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLink()
    {
        return $this->link;
    }

    /**
     * @param mixed $link
     * @return MenuApp
     */
    public function setLink($link)
    {
        $this->link = $link;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMenuAppTypeId()
    {
        return $this->menuAppTypeId;
    }

    /**
     * @param mixed $menuAppTypeId
     * @return MenuApp
     */
    public function setMenuAppTypeId($menuAppTypeId)
    {
        $this->menuAppTypeId = $menuAppTypeId;
        return $this;
    }
}