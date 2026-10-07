<?php

namespace app\dao;

use app\model\DriverAddress;
use app\utils\BaseDao;
use app\validator\DriverAddressValidator;

class DriverAddressDao extends BaseDao
{
    protected $table = 'driverAddress';

    public function addOrUpdateDriverAddress($request)
    {
        (new DriverAddressValidator)->validateInsert($request);

        $existingAddress = $this->getDriverAddress($request->driverId);

        $driverAddressModel = new DriverAddress();
        $driverAddressModel->setIdDriver($request->driverId)
                        ->setStreet($request->street)
                        ->setNumber($request->number)
                        ->setComplement($request->complement)
                        ->setNeighborhood($request->neighborhood)
                        ->setCity($request->city)
                        ->setState($request->state)
                        ->setZipCode($request->zipCode);
        
        if ($existingAddress) {
            $this->sqlUpdate(
                ['street' => ':street', 'number' => ':number', 'complement' => ':complement', 'neighborhood' => ':neighborhood', 'city' => ':city', 'state' => ':state', 'zipCode' => ':zipCode'],
                [['driverId', '=', ':driverId']],
                [':driverId' => $request->driverId, ':street' => $request->street, ':number' => $request->number, ':complement' => $request->complement, ':neighborhood' => $request->neighborhood, ':city' => $request->city, ':state' => $request->state, ':zipCode' => $request->zipCode]
            );
        } else {
            $this->sqlInsert($driverAddressModel);
        }
        
        return $this->getDriverAddress($request->driverId);
    }


    public function getDriverAddress($idDriver)
    {

        $result = $this->sqlSelect([], [['driverId', '=', $idDriver]])->get(false);
        return $result ?: null;
    }

}
