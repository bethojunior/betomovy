<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 16:36
 */

namespace App\Services\Config;

use App\Constants\Cache\CacheKeyConst;
use App\Constants\Config\ConfigTypeConst;
use App\Exceptions\Config\ConfigException;
use App\Helpers\Cache\CacheHelper;
use App\Http\Requests\Config\ValidateAudioUrlRequest;
use App\Models\Config\Config;
use App\Repositories\Config\ConfigRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Storage;

class ConfigService
{
    /**
     * @var ConfigRepository
     */
    private $repository;

    public function __construct(ConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param $key
     * @return mixed
     * @throws ConfigException
     */
    public function findByKey($key)
    {
        $config = $this->repository
            ->findByKey($key);

        if (!$config)
            throw new ConfigException("Configuração não encontrada");

        return $config->value;
    }

    public function findDeliveryConfigs()
    {
        $configs = $this->repository
            ->findByType(ConfigTypeConst::DELIVERY);

        $responseConfigs = [];

        foreach ($configs as $config) {
            $responseConfigs +=
                [$config->key => $config->value];
        }

        return $responseConfigs;
    }

    public function findByType(int $idConfigType)
    {
        return $this->repository->findByType($idConfigType, null);
    }

    public function updateTerms(array $request)
    {
        if (isset($request['customer']))
            $this->uploadAndUpdate('customer_terms_of_use', $request['customer']);

        if (isset($request['driver']))
            $this->uploadAndUpdate('driver_terms_of_use', $request['driver']);

        return (isset($request['customer']) || isset($request['driver']));
    }

    private function uploadAndUpdate(string $key, UploadedFile $file)
    {
        $config = $this->repository
            ->findByKey($key);

        $path = Storage::cloud()
            ->putFile('termsOfUse', $file);

        $config->setAttribute(
            'value', Storage::cloud()->url($path));

        $this->repository->save($config);
    }

    public function updateAppSharingCustomerMessage(string $message)
    {
        $config = $this->repository->findByKey('appSharingCustomerMessage');
        $config->value = $message;
        $config->save();

        return $config;
    }

    public function updateAppSharingDriverMessage(string $message)
    {
        $config = $this->repository->findByKey('appSharingDriverMessage');
        $config->value = $message;
        $config->save();

        return $config;
    }

    public function updateBillingDate(int $day)
    {
        $config = $this->repository->findByKey('billing_date');
        $config->value = $day;
        $config->save();

        return $config;
    }

    public function updateCodePhoneCountry(int $code)
    {
        $config = $this->repository->findByKey('code_phone_country');
        $config->value = $code;
        $config->save();

        return $config;
    }

    public function updateEnableBuyVoucher(bool $enable)
    {
        $config = $this->repository->findByKey('enable_buy_voucher');
        $config->value = $enable ? 1 : 0;
        $config->save();

        return $config;
    }

    public function getAdditionalConfigs()
    {
        return $this->repository->findMany([
            'minimum_value_for_withdraw',
            'minimum_value_for_partner_withdraw',
            'max_amount_for_receipt_in_vehicle',
            'fast_finger_call',
            'time_in_seconds_to_call_driver',
            'enable_floating_price_recalculation',
            'whatsapp_message_client',
            'whatsapp_message_driver',
            'scheduled_trip_interval',
            'time_to_notify_driver_trip_scheduled',
            'time_to_call_driver_trip_scheduled_in_seconds',
            'enable_social_networks_on_monitor',
            'enable_operation_manual_and_youtube_channel',
            'time_to_cancel_trip_bid_in_seconds',
            'travel_only_by_offer',
            'title_for_home',
            'how_many_times_alert_will_be_shown',
            'show_more_calcs_driver',
            'text_the_end_trip_with_bonus',
            'text_whatsapp_trip_list_unanswered_support',
            'whatsapp_parabens_driver_message',
            'whatsapp_parabens_client_message',
            'whatsapp_zafira_validated_driver_message',
            'whatsapp_zafira_validated_client_message',
            'minimum_value_for_pix',
            'enable_pix_trip_end_ipag',
            'pulse_group'
        ]);
    }

    public function findAll(): array
    {
        $results = $this->repository
            ->getConfigs();

        return array_values(array_map(function ($configType){
            $type = is_array($configType)
                ? ($configType['type'] ?? $configType['name'] ?? null)
                : ($configType->type ?? $configType->name ?? null);

            $rawConfig = is_array($configType)
                ? ($configType['config'] ?? null)
                : ($configType->config ?? null);

            $config = is_string($rawConfig) ? json_decode($rawConfig) : $rawConfig;

            return [
                'type' => !empty($type) ? (string) $type : 'Geral',
                'config' => is_array($config) ? array_values($config) : []
            ];
        }, $results->toArray()));
    }

    /**
     * @throws ConfigException
     */
    public function updateConfig($request): array
    {
        if (empty($request))
            throw new ConfigException("Nada foi enviado para atualização");

        if (is_object($request)) {
            $request = get_object_vars($request);
        }

        $updatedAny = false;
        foreach ($request as $key => $value) {
            /** @var Config $config */
            $config = $this->repository
                ->findByKey($key);

            if (!$config) {
                continue;
            }

            // Validar URLs de áudio
            if (ValidateAudioUrlRequest::isAudioConfigKey($key)) {
                if (!blank($value)) {
                    if (!ValidateAudioUrlRequest::validateAudioUrl($value)) {
                        throw new ConfigException("URL inválida ou não acessível para o campo $key");
                    }
                }
            }

            $config->value = blank($value) ? null : $value;
            $config->save();
            $updatedAny = true;
        }

        if (!$updatedAny && count($request) === 1) {
            $singleKey = array_key_first($request);
            throw new ConfigException("A configuração $singleKey não foi encontrada");
        }

        Cache::forget(CacheHelper::processKey(CacheKeyConst::GENERAL_CONFIG));
        Cache::flush();

        return $this->findAll();
    }

    public function getTripTypesText()
    {
        $configs = Config::getConf('title_trip_types', 'description_trip_types');

        return $configs;
    }

    public function updateTripTypesText(array $request): bool
    {
        foreach ($request as $key => $value) {
            $config        = $this->repository->findByKey($key);
            $config->value = $value;
            $config->save();

            Redis::connection('default')->del(CacheHelper::apiPhpConfigCacheKey($key));
        }

        return true;
    }

    /**
     * @throws ConfigException
     */
    public function getRealtimeDatabase(): array
    {
        return ['status' => (boolean) $this->findByKey('cloud_firestore')];
    }

    public function toggleRealtimeDatabase(bool $status): bool
    {
        $config = $this->repository->findByKey('cloud_firestore');
        $config->value = $status ? 1 : 0;
        $config->save();

        return $status;
    }
}
