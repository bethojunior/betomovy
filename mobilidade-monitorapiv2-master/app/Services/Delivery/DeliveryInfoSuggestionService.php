<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/08/2019
 * Time: 11:10
 */

namespace App\Services\Delivery;


use App\Constants\StatusConst;
use App\Helpers\Config\ConfigHelper;
use App\Models\Delivery\DeliveryInfoSuggestion;
use App\Repositories\Delivery\DeliveryInfoSuggestionRepository;
use App\Repositories\Delivery\TripItemTypeRepository;

class DeliveryInfoSuggestionService
{
    /**
     * @var DeliveryInfoSuggestionRepository
     */
    private $suggestionRepository;
    /**
     * @var TripItemTypeRepository
     */
    private $tripItemTypeRepository;
    /**
     * @var ConfigHelper
     */
    private $configHelper;

    public function __construct(DeliveryInfoSuggestionRepository $suggestionRepository,
                                TripItemTypeRepository $tripItemTypeRepository,
                                ConfigHelper $configHelper)
    {
        $this->suggestionRepository = $suggestionRepository;
        $this->tripItemTypeRepository = $tripItemTypeRepository;
        $this->configHelper = $configHelper;
    }

    public function all()
    {
        $tripItemType = $this->tripItemTypeRepository
            ->all();

        $deliveryInfoSuggestion =
            $this->suggestionRepository
                ->findActive();

        return compact('tripItemType', 'deliveryInfoSuggestion');
    }

    /**
     * @param $request
     * @return DeliveryInfoSuggestion
     * @throws \Exception
     */
    public function insert($request)
    {
        try {
            \DB::beginTransaction();

            /** @var DeliveryInfoSuggestion $oldDeliveryInfoSuggestion */
            $oldDeliveryInfoSuggestion =
                $this->suggestionRepository
                    ->findActive();

            $oldDeliveryInfoSuggestion
                ->statusId = StatusConst::REMOVED;

            $this->suggestionRepository
                ->save($oldDeliveryInfoSuggestion);

            $deliveryInfoSuggestion = new DeliveryInfoSuggestion([
                'obsOrigin' => $request['obsOrigin'] ?? null,
                'obsDestination' => $request['obsDestination'] ?? null,
                'obs' => $request['obs'] ?? null,
            ]);

            $this->suggestionRepository
                ->save($deliveryInfoSuggestion);

            \DB::commit();

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $deliveryInfoSuggestion;
    }
}
