<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class RewardCampaignTrip extends Model
{
    protected $table = 'rewardCampaignTrip';

    public function rewardTripType()
    {
        return $this->belongsTo(RewardTripType::class, 'rewardTripTypeId', 'id');
    }
}
