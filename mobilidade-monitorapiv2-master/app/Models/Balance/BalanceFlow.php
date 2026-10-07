<?php

namespace App\Models\Balance;

use Illuminate\Database\Eloquent\Model;
use App\Models\Trip\Trip;
use App\Models\Trip\RewardTrip;
use App\Models\Trip\RewardCampaignTrip;
use App\Models\Balance\BalanceFlowType;
use App\Models\Balance\Balance;
use App\Models\Trip\Tax;

class BalanceFlow extends Model
{
    const CREATED_AT = 'date';
    const UPDATED_AT = null;

    protected $table = 'balanceFlow';

    protected $primaryKey = 'idBalanceFlow';

    protected $fillable = [
        'balanceFlowTypeId', 'value', 'date', 'balanceId', 'responsibleUserId', 'tripId', 'rewardTripId', 'rewardCampaignTripId', 'taxId', 'observation'
    ];

    /**
     * Relacionamento com Balance.
     */
    public function balance()
    {
        return $this->belongsTo(Balance::class, 'balanceId', 'idBalance');
    }

    /**
     * Relacionamento com BalanceFlowType.
     */
    public function balanceFlowType()
    {
        return $this->belongsTo(BalanceFlowType::class, 'balanceFlowTypeId', 'idBalanceFlowType');
    }

    /**
     * Relacionamento com Trip.
     */
    public function trip()
    {
        return $this->belongsTo(Trip::class, 'tripId', 'idTrip');
    }

    /**
     * Relacionamento com RewardTrip.
     */
    public function rewardTrip()
    {
        return $this->belongsTo(RewardTrip::class, 'rewardTripId', 'idRewardTrip');
    }

    /**
     * Relacionamento com RewardCampaignTrip.
     */
    public function rewardCampaignTrip()
    {
        return $this->belongsTo(RewardCampaignTrip::class, 'rewardCampaignTripId', 'id');
    }

    /**
     * Relacionamento com Tax.
     */
    public function tax()
    {
        return $this->belongsTo(Tax::class, 'taxId', 'id');
    }
}