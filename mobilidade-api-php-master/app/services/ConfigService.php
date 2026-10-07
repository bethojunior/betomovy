<?php

namespace app\services;

use app\constant\CacheKeyConst;
use app\dao\ConfigDao;
use app\utils\CacheUtils;

/**
 * Created by PhpStorm
 * Date: 16/10/2019
 * Time: 09:49
 */
class ConfigService
{
    private $dao;
    private CacheUtils $cache;

    public function __construct()
    {
        $this->dao = new ConfigDao;
        $this->cache = new CacheUtils;
    }

    public function generalConfigs()
    {
        $configs = $this->cache->remember(CacheKeyConst::GENERAL_CONFIG, env('REDIS_CACHE_TTL'), function () {
            return $this->dao
                ->findMany($this->getAllFields());
        });

        $this->cache->disconnect();

        // Sobrescreve as chaves de compatibilidade com o app legado Cordova com o
        // estado real do módulo correspondente — ver AppModuleConfigOverrideService.
        return (new AppModuleConfigOverrideService())->applyOverrides($configs);
    }

    private function getAllFields()
    {
        return [
            'appSharingCustomerMessage',
            'appSharingDriverMessage',
            'call_driver_without_credit',
            'customer_register_sms_confirmation_code',
            'customer_register_unblocked',
            'customer_terms_of_use',
            'disable_mercado_pago_app',
            'disable_phone_login_delivery',
            'driver_terms_of_use',
            'enable_account_deletion_request',
            'enable_account_menu',
            'enable_birth_date_payment_card_register',
            'enable_card_payment_type_inDriver_trip',
            'enable_client_v2',
            'enable_credit_prepaid',
            'enable_customer_open_gallery',
            'enable_delivery_confirmation_code',
            'enable_dependent',
            'enable_document_validation_confiance_bank',
            'enable_driver_open_gallery',
            'enable_driver_v2',
            'enable_facebook_login',
            'enable_favorite_customer_and_driver',
            'enable_favorite_driver_with_referral_link',
            'enable_floating_price_recalculation',
            'enable_freight_app',
            'enable_google_login',
            'enable_map_dark_driver',
            'enable_mobility_app',
            'enable_only_client_accept_offer',
            'enable_open_price_trip',
            'enable_pre-paid_commission_charging_per_period',
            'enable_route_corporate',
            'enable_security_button_options',
            'enable_share_trip_app',
            'enable_social_network',
            'enable_sound_initial_app_driver',
            'enable_taximeter',
            'enable_tip_race',
            'enable_voucher_payment_type_inDriver_trip',
            'enable_transform_km_for_mi',
            'end_trip_only_by_central',
            'google_api_key',
            'how_many_times_alert_will_be_shown',
            'lbl_powered_by',
            'link_customer_pre_register',
            'link_driver_pre_register',
            'link_storage_pictures',
            'lite_map_option',
            'load_route_automatically',
            'map_vehicle_icon_link',
            'max_amount_for_receipt_in_vehicle',
            'monetization_enabled',
            'requirement_filds_on_register',
            'show_drivers_close',
            'show_more_calcs_driver',
            'support_help_phone',
            'text_checkbox_select_app',
            'text_name_driver_custom',
            'text_the_end_trip_with_bonus',
            'title_for_home',
            'tittle_document_name',
            'travel_only_by_offer',
            'url_redirect_app_play_store',
            'url_redirect_app_app_store',
            'soundCallTrip',
            'soundCallTripScheduled',
            'soundCallTripInDriver',
            'soundCallTripServices',
            'soundCallAlertSchedule',
            'soundCallOnline',
            'soundCallOffline',
            'minimum_value_for_partner_withdraw',
            'minimum_value_for_pix',
            'enable_feature_button',
            'description_registration',
            'enable_realtime_socket',
            'enable_pix_trip_end_ipag',
            'enable_driver_qrcode_audit'
        ];
    }
}
