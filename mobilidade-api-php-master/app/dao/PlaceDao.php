<?php

namespace app\dao;

use app\exceptions\InvalidFieldPlaceException;
use app\utils\BaseDao;
use app\validator\PlaceValidator;
use app\model\Customer;
use app\model\CustomerPlaces;
use Exception;
use app\model\Place;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/10/2018
 * Time: 09:27
 */
class PlaceDao extends BaseDao
{
    protected $table = 'places';
    private $validator;

    public function __construct()
    {
        $this->validator = new PlaceValidator;
        parent::__construct();
    }

    /**
     * @param \app\model\Customer $customer
     * @param $request
     * @return Place
     * @throws InvalidFieldPlaceException
     * @throws Exception
     */
    public function attachPlaceIntoCustomerPartner(Customer $customer, $request): Place
    {
        $this->validator->validateInsertPlace($request);

        if ($customer->getPlaceId())
            throw new Exception("O parceiro já possui um ponto de trabalho");

        /** @var \app\model\Place $place */
        $place = $this->create($request);

        $customerPlace = new CustomerPlaces;
        $customerPlace
            ->setCustomerId($customer->getIdCustomer())
            ->setPlaceId($place->getIdPlace());

        (new CustomerPlacesDao)->sqlInsert($customerPlace);

        return $place;
    }
}