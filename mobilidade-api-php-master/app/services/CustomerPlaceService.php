<?php

namespace app\services;

use app\dao\CustomerDao;
use app\dao\CustomerPlacesDao;
use app\dao\PlaceDao;
use app\exceptions\CustomerPlaceException;
use app\utils\Headers;
use app\validator\PlaceValidator;
use app\model\Config;
use app\model\ConfigType;
use app\model\Customer;
use app\model\CustomerPlaces;
use Exception;
use app\model\Place;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/01/2019
 * Time: 18:10
 */
class CustomerPlaceService
{
    private $validator;
    private $dao;
    private $customerDao;
    private $placeDao;
    /** @var \app\model\Customer $customer */
    private $customer;

    public function __construct($feedCustomerByToken = true)
    {
        $this->dao = new CustomerPlacesDao;
        $this->placeDao = new PlaceDao;
        $this->customerDao = new CustomerDao;
        $this->validator = new PlaceValidator;

        $this->customer = $feedCustomerByToken ?
            new Customer($this->customerDao
                ->findByUser(Headers::getUserId())) :
            new Customer;
    }

    /**
     * @param $request
     * @return stdClass
     * @throws Exception
     */
    public function insert($request)
    {
        $this->validateInsertPlace($request);

        $place = $this->attachPlace($request);

        return $place->toStdClass();
    }

    /**
     * @return array|mixed
     */
    public function getAll()
    {
        if (!$this->customer || !$this->customer->getIdCustomer()) {
            return [];
        }

        return $this->dao->getByCustomer(
            $this->customer->getIdCustomer()
        );
    }

    /**
     * @param $placeId
     * @return bool
     * @throws Exception
     */
    public function delete($placeId)
    {
        $place = $this->findOne($placeId);

        if (!$place)
            throw new CustomerPlaceException(1300);

        return $this->dao
            ->delete($this->customer->getIdCustomer(), $placeId);
    }

    /**
     * @param $placeId
     * @return array|mixed
     */
    public function findOne($placeId)
    {
        return $this->dao
            ->getOne(
                $this->customer->getIdCustomer(),
                $placeId
            );
    }

    /**
     * @param $request
     * @throws Exception
     */
    private function validateInsertPlace($request)
    {
        $this->validator->validateInsertPlace($request);

        $places = $this->getAll();
        $max = $this->maxQuantityCustomerPlaces();

        if (count($places) >= $max)
            throw new CustomerPlaceException(1301, ['max' => $max, 'places' => $places]);
    }

    /**
     * @return int
     * @throws Exception
     */
    private function maxQuantityCustomerPlaces()
    {
        return (int)Config::get(
            'max_quantity_customer_places',
            ConfigType::CUSTOMER);
    }

    /**
     * @param $request
     * @return Place
     */
    private function attachPlace($request): Place
    {
        /** @var \app\model\Place $place */
        $place = $this->placeDao->create($request);

        $customerPlace = new CustomerPlaces;
        $customerPlace
            ->setCustomerId($this->customer->getIdCustomer())
            ->setPlaceId($place->getIdPlace());

        $this->dao
            ->sqlInsert($customerPlace);

        return $place;
    }
}