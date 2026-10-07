<?php

namespace app\commands;

use app\dao\TripDao;
use app\services\TripCardPaymentService;
use app\utils\Command;

class TripRefundCardPaymentCommand extends Command
{
    private $tripDao;
    private $tripCardPaymentService;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->tripDao = new TripDao;
        $this->tripCardPaymentService = new TripCardPaymentService;
    }

    public function handle(): void
    {
        $tripReference = $this->params[2];
        $tripCardPayment = $this->tripCardPaymentService->cancelPayment($this->tripDao->findObject($tripReference));
        echo json_encode([
            'idTripCardPayment' => $tripCardPayment->getIdTripCardPayment(),
            'tripReference' => $tripCardPayment->getTripReference(),
            'transactionId' => $tripCardPayment->getTransactionId(),
            'status' => $tripCardPayment->getStatus(),
            'statusDetail' => $tripCardPayment->getStatusDetail(),
        ]);
    }
}