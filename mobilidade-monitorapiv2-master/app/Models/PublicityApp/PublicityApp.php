<?php

namespace App\Models\PublicityApp;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PublicityApp extends Model
{
    protected $table = 'publicities_app';

    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_name',
        'company_type',
        'company_email',
        'company_phone',
        'company_whatsapp',
        'link',
        'opening_hours',
        'opening_hours2',
        'benefit1',
        'benefit2',
        'benefit3',
        'responsible_manager',
        'email_report',
        'title',
        'subtitle',
        'text_button_cta',
        'link_button_cta',
        'image_passenger_screen',
        'image_passenger_transit',
        'image_driver_initial',
        'image_driver_transit',
        'gender',
        'min_age',
        'max_age',
        'min_distance',
        'max_distance',
        'activities',
        'passenger_screen',
        'passenger_transit',
        'start_date',
        'end_date',
        'start_hour',
        'end_hour',
        'days_of_week',
        'driver_charge_initial',
        'passenger_charge_screen',
        'driver_charge_screen',
        'passenger_address_bar'
    ];
}
