<?php

namespace app\commands;

use app\dao\CalculatedTripPriceDao;
use app\dao\PriceComparisionDao;
use app\model\PriceComparision;
use app\utils\Command;
use app\utils\GoogleMapsApi;
use app\utils\UberApi;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/05/2019
 * Time: 08:51
 */
class PriceComparisionCommand extends Command
{
    private $calculatedPriceDao;
    private $googleMapsApi;
    private $uberApi;
    private $dao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->calculatedPriceDao = new CalculatedTripPriceDao;
        $this->dao = new PriceComparisionDao;
        $this->googleMapsApi = new GoogleMapsApi;
        $this->uberApi = new UberApi;
        $this->logCommand = true;
    }

    /**
     * @throws Exception
     */
    public function handle(): void
    {
        $this->response = writeLn("Buscando preços");

        $calculatedPrices = $this->calculatedPriceDao
            ->getLastOnes();

        $this->response .= writeLn("Preços encontrados");

        foreach ($calculatedPrices as $price) {
            $priceComparision = new PriceComparision;

            $this->response .= writeLn("Comparando Preço: " .
                $price->originLatitude . ", " . $price->originLongitude . " --> " .
                $price->destinationLatitude . ", " . $price->destinationLongitude);

            $address = $this->googleMapsApi->getDistanceWithFullAddress(
                $price->originLatitude, $price->originLongitude,
                $price->destinationLatitude, $price->destinationLongitude
            );

            $this->response .= writeLn("#  Endereço encontrado: " . $address->origin . " x " . $address->destination);
            $this->response .= writeLn("#  Calculando Preço na Uber:");

            $uberPrice = $this->uberApi
                ->getPrice(
                    $price->originLatitude, $price->originLongitude,
                    $price->destinationLatitude, $price->destinationLongitude
                );

            $this->response .= writeLn("#  Preço Return: " . number_format($price->price, 2, ',', '.'));
            $this->response .= writeLn("#  Preço Uber: " . number_format($uberPrice, 2, ',', '.'));

            $priceComparision
                ->setPriceReturn($price->price)
                ->setPriceUber($uberPrice)
                ->setOriginAddress($address->origin)
                ->setDestinationAddress($address->destination)
                ->setOriginLatitude($price->originLatitude)
                ->setOriginLongitude($price->originLongitude)
                ->setDestinationLatitude($price->destinationLatitude)
                ->setDestinationLongitude($price->destinationLongitude)
                ->setId(
                    $this->dao
                        ->sqlInsert($priceComparision));

            $this->response .= writeLn("#  Preço inserido na tabela de comparação");
        }

        $this->response .= writeLn("Preços comparados");
        $this->response .= writeLn("------------------------------------");
    }
}