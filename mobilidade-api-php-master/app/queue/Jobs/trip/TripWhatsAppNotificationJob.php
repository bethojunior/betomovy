<?php

namespace app\queue\Jobs\trip;

use app\dao\ManagmentWppGroupNotificationDao;
use app\dao\TripDao;
use app\queue\JobInterface;
use app\utils\WhatsApp\WhatsAppService;

class TripWhatsAppNotificationJob implements JobInterface
{
  public function handle(array $payload): void
  {
    try {
      echo "\nJob inserido na fila com sucesso para o evento: [TripWhatsAppNotificationJob] com referência: {$payload['tripReference']}\n";

      $trip = (new TripDao())->findForScheduleNotification($payload['tripReference']);
      $tripDriverNetPrice = (new TripDao())->findDriverNetPrice($payload['tripReference'])->driverValue ?? 0;
      $appName = env('APP_NAME');
      $appScheme = str_replace('-', '', $appName);
      $date = date(
        'd/m/Y \à\s H:i',
        strtotime($trip->scheduleDate ?: $trip->date)
      );

      $createdAt = date(
        'd/m/Y \à\s H:i',
        strtotime($trip->date)
      );

      $url = "https://" . $appName . ".toptecnologiaapps.com.br/share?scheme=" . $appScheme;

      $fetchGroupActive = (new ManagmentWppGroupNotificationDao())->findBestMatchByReference(
        'scheduled_trip_notification',
        $trip->cityId,
        $trip->tripTypeId
      );

      if (!$fetchGroupActive) {
        echo "Nenhum grupo de notificações do WhatsApp ativo para esta viagem (cidade/tipo de chamado). Verifique a configuração e tente novamente.\n";
        return;
      }

      $message = "🚗 *Nova Corrida Disponivel!* Verifique se está disponivel para você \n\n"
        . "*Tipo:* {$trip->tripType}\n\n"
        . "*Passageiro:* {$trip->customerName}\n\n"
        . "*Origem:* {$trip->originAddress} - {$trip->originNeighborhood}\n\n"
        . "*Destino:* {$trip->destinationAddress} - {$trip->destinationNeighborhood}\n\n"
        . "*Distância em km:* " . number_format($trip->distance, 1, '.', '') . " km\n\n"
        . "*Tempo médio de viagem:* {$trip->estimatedTripTime} min\n\n"
        . "*Horário:* {$date}\n\n"
        . "*Valor:* R$ " . number_format($tripDriverNetPrice, 2, ',', '.') . " (Líquido)\n\n"
        . "*Pagamento:* {$trip->tripPaymentForm}\n\n"
        . "*Abra clicando aqui :* {$url}\n";

      if ($trip->scheduleDate) {
        $message = "🕔🚗 *Corrida Agendada* 🕔🚗\n\n"
          . "*Tipo:* {$trip->tripType}\n\n"
          . "*Passageiro:* {$trip->customerName}\n\n"
          . "*Origem:* {$trip->originAddress} - {$trip->originNeighborhood}\n\n"
          . "*Destino:* {$trip->destinationAddress} - {$trip->destinationNeighborhood}\n\n"
          . "*Distância em km:* " . number_format($trip->distance, 1, '.', '') . " km\n\n"
          . "*Criado em :* {$createdAt}\n\n"
          . "*Agendado para :* {$date}\n\n"
          . "*Valor:* R$ " . number_format($tripDriverNetPrice, 2, ',', '.') . "\n\n"
          . "*Pagamento:* {$trip->tripPaymentForm}\n\n"
          . "*Referência:* {$trip->tripReference}\n";
      }

      $whatsAppService = new WhatsAppService();

      $whatsAppService->handleGroupId($message, $fetchGroupActive->group_id);
    } catch (\Throwable $th) {
      echo "ERROR \n" . $th->getMessage() . "\n";
    }
  }
}
