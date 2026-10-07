<?php

namespace app\services;

use app\dao\TripDao;
use app\exceptions\TripException;
use app\utils\Email;
use app\model\Config;
use Exception;
use app\model\Trip;
use app\utils\WhatsApp\WhatsAppService;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/03/2019
 * Time: 10:16
 */
class TripReceiptService
{
    private $dao;
    private $email;
    private $whatsappService;

    public function __construct()
    {
        $this->dao = new TripDao;
        $this->email = new Email('tripReceipt');
        $this->whatsappService = new WhatsAppService();
    }

    /**
     * @param $tripReference
     * @return bool
     * @throws Exception
     */
    public function sendToCustomer($tripReference)
    {
        $trip = $this->dao->find($tripReference);

        if ($trip->status != Trip::FINISHED)
            throw new TripException(210, compact('trip'));

        $this->email
            ->addValue('date', ucfirst(brazilian_FullFormat($trip->schedule->schedule ?? $trip->date)))
            ->addValue('customerName', $trip->customer->nickname)
            ->addValue('paymentForm', $trip->tripPaymentForm)
            ->addValue('driverName', $trip->driver->nickname)
            ->addValue('rated', $trip->driver->driverRating)
            ->addValue('profileImageDriver', $this->getDriverProfileImage($trip->driver->profileImage))
            ->addValue('dataCar', $this->getCarInfo($trip->driver->car))
            ->addValue('origin', $trip->origin->address)
            ->addValue('destination', $trip->destination->name)
            ->addValue('mapImage', $this->getMapImage($trip))
            ->addValue('logo_default', Config::get('logo_default') ?: 'https://via.placeholder.com/100x100/ffb136/ffffff?text=LOGO')
            ->addValue('currency', Config::get('application_currency'))
            ->addValue('total', number_format($trip->price, 2, ',', '.'));

        $app_title = Config::get('app_title');

        $whatsAppMessage = 
            $app_title . " - Detalhes da viagem\n" .
            "Data: " . $trip->date . "\n" .
            "Passageiro: " . $trip->customer->nickname . "\n" .
            "Forma de pagamento: " . $trip->tripPaymentForm . "\n" .
            "Motorista: " . $trip->driver->nickname . "\n" .
            "Avaliação: " . $trip->driver->driverRating . "\n" .
            "Veículo: " . $this->getCarInfo($trip->driver->car) . "\n" .
            "Origem: " . $trip->origin->address . "\n" .
            "Destino: " . $trip->destination->name . "\n" .
            "Valor: " . number_format($trip->price, 2, ',', '.');

        $this->whatsappService->handle($trip->customer->phone, $whatsAppMessage);

        return $this->email
            ->send($trip->customer->email, $app_title . ': Resumo da sua viagem');
    }

    private function getMapImage($tripSummary)
    {
        $markerOrigin =
            "&markers=color:green%7C{$tripSummary->origin->latitude},{$tripSummary->origin->longitude}";
        $markerDestination =
            "&markers=color:red%7C{$tripSummary->destination->latitude},{$tripSummary->destination->longitude}";

        $key = Config::get('google_api_key');

        return
            "https://maps.googleapis.com/maps/api/staticmap?size=400x200&key={$key}{$markerOrigin}{$markerDestination}";
    }

    private function getCarInfo($car)
    {
        return "{$car->brand} {$car->model} - {$car->plate}";
    }

    private function getDriverProfileImage($profileImage)
    {
        if (empty($profileImage)) {
            return 'https://via.placeholder.com/130x130/cccccc/666666?text=Motorista';
        }
        
        if (strpos($profileImage, 'http') === 0) {
            return $profileImage;
        }
        
        // Prioriza link_storage_pictures (MinIO/S3 configurado)
        $storageLink = Config::get('link_storage_pictures');
        if (!empty($storageLink)) {
            return $storageLink . 'driver/profile/compressed/' . $profileImage;
        }
        
        // Fallback: S3 via variáveis de ambiente
        $bucketName = Config::get('s3_bucket_name') ?? env('S3_BUCKET_NAME');
        $s3Url = env('S3_URL');
        
        if (empty($bucketName) || empty($s3Url)) {
            return 'https://via.placeholder.com/130x130/cccccc/666666?text=Motorista';
        }
        
        return $s3Url . $bucketName . '/driver/profile/compressed/' . $profileImage;
    }


}