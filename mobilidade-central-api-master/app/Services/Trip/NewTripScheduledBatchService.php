<?php

namespace App\Services\Trip;

use App\Models\User\User;
use App\Utils\UUID;
use Illuminate\Support\Facades\DB;
use Throwable;

class NewTripScheduledBatchService
{
    /**
     * @var NewTripService
     */
    private $newTripService;

    public function __construct(NewTripService $newTripService)
    {
        $this->newTripService = $newTripService;
    }

    /**
     * Cria uma viagem agendada independente por data informada em $request['schedules'].
     * Cada viagem é criada via NewTripService::newTrip(), então tem seu próprio ID,
     * status e ciclo de vida — não existe vínculo/recorrência entre elas.
     *
     * @param array $request
     * @param User $user
     * @return array
     */
    public function createBatch(array $request, User $user): array
    {
        $schedules = $request['schedules'];
        unset($request['schedules']);

        // Resolve o cliente uma única vez e reaproveita o id em todas as viagens
        // do lote — do contrário, cada viagem chamaria findOrCreateCustomer()
        // de novo e duplicaria o cadastro do cliente sem um "id" já definido.
        $customer = $this->newTripService->resolveCustomer($request['tripCustomer'], $request['centralId']);
        $request['tripCustomer'] = ['id' => $customer->id];

        // Identifica as viagens criadas nesta mesma chamada de lote — só para
        // organização/gerenciamento (ex.: editar todas de uma vez). Não cria
        // nenhum vínculo de recorrência entre elas: cada uma é independente.
        // Só faz sentido quando há mais de uma data — uma viagem sozinha não é "lote".
        $scheduledBatchId = count($schedules) > 1 ? UUID::v4() : null;

        // Resolve uma única vez os dados idênticos entre todas as viagens do
        // lote (mesma origem/destino/cidade/tipo de viagem) — evita repetir
        // as mesmas consultas/inserts uma vez por viagem.
        try {
            $sharedContext = $this->newTripService->resolveSharedBatchContext($request);
        } catch (Throwable $e) {
            return array_map(function ($entry) use ($e) {
                return [
                    'success' => false,
                    'schedule' => $entry['schedule'],
                    'error' => $e->getMessage(),
                ];
            }, $schedules);
        }

        $results = [];

        foreach ($schedules as $entry) {
            $tripRequest = array_merge($request, [
                'schedule' => $entry['schedule'],
                'scheduleUTC' => $entry['scheduleUTC'],
                'scheduledBatchId' => $scheduledBatchId,
            ]);

            $transactionLevel = DB::transactionLevel();

            try {
                $trip = $this->newTripService->newTrip($tripRequest, $user, true, $sharedContext);

                $results[] = [
                    'success' => true,
                    'schedule' => $entry['schedule'],
                    'trip' => $trip,
                ];
            } catch (Throwable $e) {
                // NewTripService::newTrip() só faz rollback em CustomException; qualquer outra
                // exceção deixaria a transação aberta e vazaria pro próximo item do lote.
                while (DB::transactionLevel() > $transactionLevel) {
                    DB::rollBack();
                }

                $results[] = [
                    'success' => false,
                    'schedule' => $entry['schedule'],
                    'error' => $e->getMessage(),
                ];
            }
        }

        // TODO: sendToRealtime() e TripGroupNotificationWpp (dentro de newTrip()) hoje disparam
        // uma vez por viagem — no lote isso vira N chamadas. Otimização futura: suprimir esses
        // disparos por item e enviar UM único realtime + notificação aqui, avisando "X viagens
        // agendadas novas" (payload ainda a definir).

        return $results;
    }
}
