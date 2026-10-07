<?php

namespace app\services;

use app\dao\DriverBlockRequestAvaliationDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\TripDao;
use app\dao\TripRatingDao;
use app\exceptions\RequestValidatorException;
use app\exceptions\TripRatingException;
use app\utils\Headers;
use app\validator\TripRatingValidator;
use app\model\Config;
use app\model\ConfigType;
use Exception;
use app\model\Log;
use app\model\LogCriticalType;
use app\model\LogType;
use stdClass;
use app\model\TripRating;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2019
 * Time: 11:49
 */
class TripRatingService
{
    private $validator;
    private $dao;
    private $tripDao;
    private $userRatingService;
    private $tripCustomerUserService;

    public function __construct()
    {
        $this->dao = new TripRatingDao;
        $this->tripDao = new TripDao;
        $this->userRatingService = new UserRatingService;
        $this->tripCustomerUserService = new TripCustomerUserService;
        $this->validator = new TripRatingValidator;
    }

    /**
     * @param $request
     * @return stdClass
     * @throws RequestValidatorException
     * @throws TripRatingException
     * @throws Exception
     */
    public function rate($request)
    {
        $this->validator->validateInsert($request);

        $tripRating = $this->create($request->tripReference, $request->rating, $request->comment ?? null);

        $this->updateUserRating($tripRating->getRatedUser());

        $this->createLog(
            $tripRating->toStdClass(),
            $tripRating->getTripReference(),
            $tripRating->getRatedUser(),
            "USUÁRIO AVALIOU A VIAGEM"
        );
        
        if($request->reprovedPhoto && $request->driverId) {
            $this->checkAndBlockPhotoIfNeeded($request->tripReference,$request->driverId);
        }

        return $tripRating->toStdClass();
    }

    public function findByTrip($tripReference)
    {
        return $this->dao
            ->findByTrip($tripReference);
    }

    public function checkAndBlockPhotoIfNeeded($tripReference,$idDriver)
    {
        $driverDao = new DriverDao;
        $driverBlockAvaliation = new DriverBlockRequestAvaliationDao;

        $driverBlockAvaliation->createRequestBlockDriverAvaliation($tripReference, $idDriver);
        
        $count = $driverBlockAvaliation->getRequestBlockDriverAvaliation($idDriver);

        $requestByClientKey = Config::get('number_request_avaliation_photo_for_block_driver');

        if ($requestByClientKey > 0 && $count >= $requestByClientKey) {
            $driverDao->reprovedPhotoProfile($idDriver);
            $driverBlockAvaliation->deleteAllRegisterByDriver($idDriver);
        }
    }

    /**
     * @param $tripReference
     * @param $rating
     * @return \app\model\\app\model\TripRating
     * @throws Exception
     */
    private function create($tripReference, $rating, $comment = null): TripRating
    {
        $userThatIsRatingId = Headers::getUserId();

        $this->verifyIfAlreadyRated($tripReference, $userThatIsRatingId);

        $tripRating = new TripRating;
        $tripRating
            ->setTripReference($tripReference)
            ->setRating($rating)
            ->setUserWhoEvaluated($userThatIsRatingId)
            ->setComment($comment)
            ->setRatedUser(
                $this->getRatedUserByTrip($tripReference, $userThatIsRatingId)
            )
            ->setIdTripRating(
                $this->dao
                    ->sqlInsert($tripRating)
            );

        return $tripRating;
    }

    /**
     * @param $tripReference
     * @param $userThatIsRatingId
     * @throws TripRatingException
     */
    private function verifyIfAlreadyRated($tripReference, $userThatIsRatingId): void
    {
        $tripRatings = $this->findByTrip($tripReference);

        foreach ($tripRatings as $tripRating) {
            if ($tripRating->userWhoEvaluated == $userThatIsRatingId)
                throw new TripRatingException(1202, $tripRating);
        }
    }

    /**
     * @param $tripReference
     * @param $userThatIsRatingId id do usuário que está enviando a avaliação
     * @return mixed
     * @throws Exception
     */
    private function getRatedUserByTrip($tripReference, $userThatIsRatingId)
    {
        $trip = $this->tripDao->find($tripReference, false);

        if ($userThatIsRatingId == $trip->driver->userId) {
            return $this->tripCustomerUserService->resolveUserId($trip);
        }

        return $trip->driver->userId;
    }

    /**
     * @param $userId
     * @return float|int
     * @throws Exception
     */
    private function updateUserRating($userId)
    {
        $newUserRating = $this->calculateNewAverage($userId);

        $this->userRatingService
            ->update($userId, $newUserRating);

        return $newUserRating;
    }

    /**
     * @param $userId
     * @return float|int
     * @throws Exception
     */
    private function calculateNewAverage($userId)
    {
        $limit = Config::get('limit_trip_for_rating_average', ConfigType::RATING);
        $average = $this->dao
            ->getAverageRating($userId, $limit)
            ->avg;

        $ratingActual = $this->userRatingService
            ->get($userId);

        return ($average + $ratingActual) / 2;
    }

    /**
     * @param $data
     * @param $idReference
     * @param $userId
     * @param $message
     * @param string $level
     * @return bool
     * @throws Exception
     */
    private function createLog($data, $idReference, $userId, $message, $level = LogCriticalType::INFORMACAO): bool
    {
        $log = new Log(LogType::PROCESS, $level);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }
}