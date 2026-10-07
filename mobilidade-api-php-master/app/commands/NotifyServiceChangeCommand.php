<?php


namespace app\commands;

use app\constant\MapTypeConst;
use app\dao\NotifyMapServiceAlertDao;
use app\model\Config;
use app\utils\Command;
use app\utils\PhoneMessage;

class NotifyServiceChangeCommand extends Command
{
    private $notifyMapServiceAlertDao;

    public function __construct($params = null)
    {
        parent::__construct($params);

        $this->notifyMapServiceAlertDao = new NotifyMapServiceAlertDao;
    }

    public function handle(): void
    {
        $type = $this->params[2];
        $service = $this->params[3];
        $token = $this->params[4];

        if (empty($this->notifyMapServiceAlertDao->alreadyNotified($type, $service, $token))) {
            $message = "Alerta de erro no serviço de {$service} do {$type}";

            if ($type === MapTypeConst::CRITICAL)
                $message = "🚨🚨*Erro critico* no serviço de mapa {$service} - serviço parado";

            $this->notifyMapServiceAlertDao->insert($message, $type, $service, $token);

            $phoneMessage = new PhoneMessage(Config::get('support_help_phone'), $message);
            $phoneMessage->sendOnlyWhatsApp();
        }
    }
}