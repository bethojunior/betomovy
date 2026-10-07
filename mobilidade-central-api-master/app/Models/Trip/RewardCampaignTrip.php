<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class RewardCampaignTrip extends Model
{
    protected $table = 'rewardCampaignTrip';

    protected $fillable = [
        'value',
        'rewardTripTypeId',
        'tripReference'
    ];

    const UPDATED_AT = null;
}
