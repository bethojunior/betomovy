<?php

namespace App\Models\Balance;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class WithdrawSummaryView extends Model
{
    protected $table = 'withdraw_summary_view';

    protected $primaryKey = 'idWithdraw';

    protected $appends = ['recusedByUserName'];

    protected $hidden = ['recusedByUserRelation'];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function recusedByUserRelation()
    {
        return $this->belongsTo(User::class, 'recusedByUser', 'idUser')
            ->select('idUser', 'name');
    }

    public function getRecusedByUserNameAttribute()
    {
        $relation = $this->recusedByUserRelation;
        return $relation ? $relation->name : null;
    }

}
