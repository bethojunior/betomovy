<?php

namespace app\validator;

use app\exceptions\RequestValidatorException;
use app\exceptions\TripRatingException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2019
 * Time: 11:55
 */
class TripRatingValidator
{
    /**
     * @param $request
     * @return bool
     * @throws RequestValidatorException
     * @throws TripRatingException
     */
    public function validateInsert($request)
    {
        if (count(get_object_vars($request)) < 1)
            throw new RequestValidatorException(1100);

        $this->ratingIsValid($request->rating ?? '');
        $this->tripReferenceIsValid($request->tripReference ?? '');

        return true;
    }

    /**
     * @param $rating
     * @throws TripRatingException
     */
    private function ratingIsValid($rating)
    {
        if (strlen($rating) < 1)
            throw new TripRatingException(1200);
    }

    /**
     * @param $tripReference
     * @throws TripRatingException
     */
    private function tripReferenceIsValid($tripReference)
    {
        if (strlen($tripReference) < 1)
            throw new TripRatingException(1201);
    }
}