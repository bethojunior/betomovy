<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class RewardTripType extends Model
{
    protected $table = 'rewardTripType'; 
    protected $primaryKey = 'id'; 

    public $timestamps = false;
    protected $fillable = [
        'name',     
        'statusId',  
    ];

    /**
     * Relacionamento com RewardTrip.
     */
    public function rewardTrips()
    {
        return $this->hasMany(RewardTrip::class, 'rewardTripTypeId', 'id');
    }

    /**
     * Relacionamento com RewardCampaignTrip.
     */
    public function rewardCampaignTrips()
    {
        return $this->hasMany(RewardCampaignTrip::class, 'rewardTripTypeId', 'id');
    }
}