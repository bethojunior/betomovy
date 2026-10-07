<?php

namespace App\Console\Commands;

use App\Constants\Delivery\DeliveryOrderStatusConst;
use App\Constants\Driver\DriverCalledConst;
use App\Models\Driver\DriverCalled;
use App\Utils\Push;
use Delivery\Helpers\Config\DeliveryCallConfigHelper;
use Delivery\Helpers\Config\PushConfigHelper;
use Delivery\Models\Driver\DriversCloseDeliveryOrder;
use Delivery\Models\Order\DeliveryOrder;
use Delivery\Realtimes\Order\OrderRealtime;
use Delivery\Repositories\Config\PushConfigRepository;
use Delivery\Repositories\Driver\DriverCalledRepository;
use Delivery\Repositories\Driver\DriversCloseDeliveryOrderRepository;
use Delivery\Repositories\Order\DeliveryOrderRepository;
use Illuminate\Console\Command;
use Illuminate\Foundation\Inspiring;

class OrderCallCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order:call {deliveryOrder}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Realizar chamado de um pedido';

    /**
     * @var DriversCloseDeliveryOrderRepository
     */
    private $driversCloseDeliveryOrderRepository;

    /**
     * @var DeliveryOrderRepository
     */
    private $deliveryOrderRepository;

    /**
     * @var DriverCalledRepository
     */
    private $driverCalledRepository;

    /**
     * @var DeliveryCallConfigHelper
     */
    private $deliveryCallConfigHelper;

    /**
     * @var OrderRealtime
     */
    private $orderRealtime;

    /**
     * @var Push
     */
    private $push;

    private $pushConfigHelper;

    /**
     * @var array
     */
    private $deliveryCallConfig;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        DriversCloseDeliveryOrderRepository $driversCloseDeliveryOrderRepository,
        DeliveryOrderRepository             $deliveryOrderRepository,
        DriverCalledRepository              $driverCalledRepository,
        PushConfigHelper                    $pushConfigHelper,
        DeliveryCallConfigHelper            $deliveryCallConfigHelper,
        OrderRealtime                       $orderRealtime,
        Push                                $push

    )
    {
        parent::__construct();

        $this->driversCloseDeliveryOrderRepository = $driversCloseDeliveryOrderRepository;
        $this->deliveryOrderRepository = $deliveryOrderRepository;
        $this->driverCalledRepository = $driverCalledRepository;
        $this->deliveryCallConfigHelper = $deliveryCallConfigHelper;
        $this->orderRealtime = $orderRealtime;
        $this->push = $push;
        $this->pushConfigHelper = $pushConfigHelper;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $orderId = $this->argument('deliveryOrder');

        $this->deliveryCallConfig = $this->deliveryCallConfigHelper->get(
            'time_in_seconds_to_call_driver',
            'time_in_seconds_to_pass_driver_call',
            'max_renew_list',
            'max_renew_all_drivers_list',
            'drivers_number_to_call_list'
        );

        $this->mountPush();

        $order = $this->deliveryOrderRepository->findOrFail($orderId);

        $this->callDrivers($order);

        $this->comment(Inspiring::quote());

        return null;
    }

    private function callDrivers(DeliveryOrder $deliveryOrder): void
    {
        $deliveryOrder = $this->callDriversOneByOne($deliveryOrder);

        $this->callAllDriversAtOnce($deliveryOrder);
    }

    private function callDriversOneByOne(DeliveryOrder $deliveryOrder)
    {
        $drivers_number_to_call_list = $this->deliveryCallConfig['drivers_number_to_call_list']['value'];

        $drivers = $this->driversCloseDeliveryOrderRepository
            ->findDriversClose($deliveryOrder, $drivers_number_to_call_list);

        $this->info('Iniciando chamamento com ' . $drivers->count() . ' entregadores');

        $countRenews = 0;
        $quantityDriversOnList = 0;
        $driversNotAnswered = [];

        while ($drivers->isNotEmpty() &&
            $countRenews <= ((int)$this->deliveryCallConfig['max_renew_list']['value'])) {

            $driver = $drivers->first();

            if (!$driver) {
                $this->info("Chamado encerrado");
                exit();
            }

            $driverCalled = $this->updateStatusOnCallOrder($deliveryOrder, $driver);

            $order = $this->deliveryOrderRepository
                ->findFully($deliveryOrder->id);

            $this->info('enviando pedido para o realtime');
            $this->sendToRealtime($order);

            $this->notify($drivers->toArray());

            $this->waitDriverAnswer($driverCalled);

            sleep((int)$this->deliveryCallConfig['time_in_seconds_to_pass_driver_call']['value']);

            $driverCalled = $this->syncStatusDriverCalled($driverCalled);

            if ($driverCalled->status == DriverCalledConst::ACCEPTED)
                break;

            if ($driverCalled->status == DriverCalledConst::CALLING)
                $this->driverCalledRepository
                    ->updateById($driverCalled->id, ['status' => DriverCalledConst::NOT_ANSWERED]);

            $driversNotAnswered[] = $driverCalled->driverId;

            $quantityDriversOnList++;
            $renewedList = false;

            if ($quantityDriversOnList >= (int)$drivers_number_to_call_list) {
                $this->info("Chamando lista novamente");
                $countRenews++;
                $quantityDriversOnList = 0;
                $driversNotAnswered = [];
                $renewedList = true;
            }

            $drivers = $this->driversCloseDeliveryOrderRepository
                ->findDriversClose(
                    $deliveryOrder,
                    $drivers_number_to_call_list,
                    $driversNotAnswered
                );

            if ($drivers->isEmpty() && !$renewedList) {
                $this->info("Chamando lista novamente");
                $countRenews++;
                $quantityDriversOnList = 0;
                $driversNotAnswered = [];
                $drivers = $this->driversCloseDeliveryOrderRepository
                    ->findDriversClose($deliveryOrder, $drivers_number_to_call_list);
            }

            $this->comment($drivers->count() . ' novos motoristas encontrados');
            $this->comment($countRenews . 'º renovação da lista');
            $this->comment($quantityDriversOnList . ' motoristas chamados na lista');
            $this->comment(count($driversNotAnswered) . ' motoristas que recusaram/não atenderam');
            $this->comment(implode(",", $driversNotAnswered));
        }

        $this->info("Nenhum motorista aceitou no chamado individual!");
        $this->info("Chamando todos no chamado dedo rápido");

        return $deliveryOrder;
    }

    private function updateStatusOnCallOrder(
        DeliveryOrder $deliveryOrder, DriversCloseDeliveryOrder $driversCloseDeliveryOrder, bool $updateDeliveryOrder = true
    ): DriverCalled
    {
        $driverCalled = DriverCalled::firstOrCreate([
            'deliveryOrderId' => $deliveryOrder->id,
            'driverId' => $driversCloseDeliveryOrder->idDriver
        ], [
            'status' => DriverCalledConst::CALLING,
            'proximity' => $driversCloseDeliveryOrder->proximity
        ]);

        if ($driverCalled->status == DriverCalledConst::NOT_ANSWERED) {
            $driverCalled->status = DriverCalledConst::CALLING;
            $driverCalled->save();
        }

        if ($updateDeliveryOrder) {
            $deliveryOrder->callingDriver = $driversCloseDeliveryOrder->idDriver;
            $deliveryOrder->save();
        }

        return $driverCalled;
    }

    public function arguments($key = null)
    {
        if (is_null($key)) {
            return $this->input->getArguments();
        }

        return $this->input->getArgument($key);
    }

    private function mountPush(): void
    {
        $pushConfig = $this->pushConfigHelper
            ->get('call_driver');

        $this->push
            ->setTitle($pushConfig['title'])
            ->setBody($pushConfig['message'])
            ->setAction($pushConfig['action'])
            ->setTag($pushConfig['tag'])
            ->setForceStart($pushConfig['forceStart'])
            ->setPriority($pushConfig['priority'])
            ->setIcon($pushConfig['icon'])
            ->setSoundname($pushConfig['soundName']);
    }

    private function sendToRealtime(DeliveryOrder $deliveryOrder)
    {
        if ($deliveryOrder->callingDriver)
            $deliveryOrder->callingDriver = explode(',', $deliveryOrder->callingDriver);

        return $this->orderRealtime
            ->update([
                'id' => $deliveryOrder->id
            ], $deliveryOrder->toArray());
    }

    private function notify(array $drivers)
    {
        $deviceTokens = array();

        $deviceTokens[] = $drivers[0]['deviceToken'];

        if (isset($drivers[1]))
            $deviceTokens[] = $drivers[1]['deviceToken'];

        $deviceTokens = array_filter($deviceTokens);

        $this->push->notificationAllWithData($deviceTokens);

        return true;
    }

    private function waitDriverAnswer(DriverCalled $driverCalled): void
    {
        $timeActual = 1;

        while ($timeActual <= (int)$this->deliveryCallConfig['time_in_seconds_to_call_driver']['value']) {
            $driver = $this->driverCalledRepository
                ->getStatusDriver($driverCalled->id);

            if ($driver->status <> DriverCalledConst::CALLING)
                break;

            $this->comment(" chamando motorista " . $driver->id . " time: " . $timeActual);

            sleep(1);

            $timeActual++;
        }
    }

    private function syncStatusDriverCalled(DriverCalled $driverCalled): DriverCalled
    {
        $driverCalled = $this->driverCalledRepository
            ->find($driverCalled->id);

        return $driverCalled;
    }

    private function callAllDriversAtOnce(DeliveryOrder $deliveryOrder)
    {
        $drivers = $this->driversCloseDeliveryOrderRepository
            ->findDriversClose($deliveryOrder, 0);

        $countRenews = 0;

        while ($drivers->isNotEmpty() &&
            $countRenews <= ((int)$this->deliveryCallConfig['max_renew_all_drivers_list'])) {

            $driversId = array_map(function ($driver) {
                return $driver['idDriver'];
            }, $drivers->toArray());

            $deliveryOrder->callingDriver = implode(",", $driversId);
            $deliveryOrder->save();

            $driversCalled = collect();

            foreach ($drivers as $driver) {
                $driverCalled = $this->updateStatusOnCallOrder($deliveryOrder, $driver, false);
                $driversCalled->push($driverCalled);
            }

            $deliveryOrder = $this->deliveryOrderRepository
                ->findFully($deliveryOrder->id);

            $this->sendToRealtime($deliveryOrder);

            $deviceTokens = array_map(function ($driver) {
                return $driver['deviceToken'];
            }, $drivers->toArray());

            $this->push->notificationAllWithData($deviceTokens);

            $driverWhoAccepted = $this->waitAllDriverAnswer($deliveryOrder);

            if ($driverWhoAccepted && $driverWhoAccepted->status == DriverCalledConst::ACCEPTED)
                break;

            $this->driverCalledRepository
                ->updateStatusByDriverAndDeliveryOrder(
                    $deliveryOrder->id,
                    DriverCalledConst::NOT_ANSWERED,
                    DriverCalledConst::CALLING
                );

            $this->info("Chamando motorista novamente");
            $drivers = $this->driversCloseDeliveryOrderRepository
                ->findDriversClose($deliveryOrder, 0);

            $countRenews++;
        }

        if ($drivers->isNotEmpty()) {
            $deliveryOrder->callingDriver = null;
            $deliveryOrder->save();
            $this->info("Nenhum motorista aceitou no chamado dedo rápido");
        } else {
            $deliveryOrder->deliveryOrderStatusId = DeliveryOrderStatusConst::IN_PREPARATION;
        }

        $this->sendToRealtime($deliveryOrder);

        $this->info("Chamado encerrado\n");
    }

    private function waitAllDriverAnswer(DeliveryOrder $deliveryOrder): DriverCalled
    {
        $timeActual = 1;
        $driverWhoAccepted = null;

        while ($timeActual <= (int)$this->deliveryCallConfig['time_in_seconds_to_call_driver']['value']) {
            $drivers = $this->driverCalledRepository
                ->getAllDriversByDeliveryOrder($deliveryOrder->id);

            $stop = false;

            foreach ($drivers as $driver) {
                if ($driver->status == DriverCalledConst::ACCEPTED) {
                    $stop = false;
                    $driverWhoAccepted = $driver;
                    break;
                }
            }

            if ($stop)
                break;

            $this->comment(" chamando {$driver->count()} motorista. Time: " . $timeActual);
            sleep(1);

            $timeActual++;
        }

        return $driverWhoAccepted;
    }
}
