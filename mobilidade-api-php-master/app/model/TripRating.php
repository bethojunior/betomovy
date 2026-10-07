<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2019
 * Time: 11:38
 */
class TripRating extends BaseModel
{
    protected $idTripRating;
    protected $tripReference;
    protected $ratedUser;
    protected $userWhoEvaluated;
    protected $rating;
    protected $created_at;
    protected $updated_at;
    protected $comment;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();

        parent::__construct($obj);
        $this->updated_at = now();
    }

    /**
     * @return mixed
     */
    public function getIdTripRating()
    {
        return $this->idTripRating;
    }

    /**
     * @param mixed $idTripRating
     * @return TripRating
     */
    public function setIdTripRating($idTripRating)
    {
        $this->idTripRating = $idTripRating;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripReference()
    {
        return $this->tripReference;
    }

    /**
     * @param mixed $tripReference
     * @return TripRating
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRatedUser()
    {
        return $this->ratedUser;
    }

    /**
     * @param mixed $ratedUser
     * @return TripRating
     */
    public function setRatedUser($ratedUser)
    {
        $this->ratedUser = $ratedUser;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserWhoEvaluated()
    {
        return $this->userWhoEvaluated;
    }

    /**
     * @param mixed $userWhoEvaluated
     * @return TripRating
     */
    public function setUserWhoEvaluated($userWhoEvaluated)
    {
        $this->userWhoEvaluated = $userWhoEvaluated;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRating()
    {
        return $this->rating;
    }

    /**
     * @return mixed
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * @param mixed $rating
     * @return TripRating
     */
    public function setRating($rating)
    {
        $this->rating = $rating;
        return $this;
    }

    public function setComment($comment): TripRating
    {
        $this->comment = $comment;
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
     * @param mixed $created_at
     * @return TripRating
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param mixed $updated_at
     * @return TripRating
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

}