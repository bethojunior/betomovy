<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by BETHO`S BRAIN.
 */

class TripEventsDetails extends BaseModel
{
  protected $id;
  protected $tripReference;
  protected $type;
  protected $data;
  protected $created_at;
  protected $updated_at;

  protected $table = "tripEventsDetails";

  public function __construct($obj = null)
  {
    $this->updated_at = $obj->updated_at ?? now();
    $this->created_at = $obj->created_at ?? now();

    parent::__construct($obj);
  }

  public function getId()
  {
    return $this->id;
  }

  public function setId($id)
  {
    $this->id = $id;
    return $this;
  }

  public function getTripReference()
  {
    return $this->tripReference;
  }

  public function setTripReference($tripReference)
  {
    $this->tripReference = $tripReference;
    return $this;
  }

  public function getType()
  {
    return $this->type;
  }

  public function setType($type)
  {
    $this->type = $type;
    return $this;
  }

  public function getData()
  {
    return $this->data;
  }

  public function setData($data)
  {
    $this->data = $data;
    return $this;
  }
}
