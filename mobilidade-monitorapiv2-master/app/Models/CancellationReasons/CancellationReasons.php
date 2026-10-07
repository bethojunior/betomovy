<?php


namespace App\Models\CancellationReasons;


use Illuminate\Database\Eloquent\Model;

class CancellationReasons extends Model
{
    protected $table = 'cancellationReasons';

    protected $primaryKey = 'idCancellationReasons';

    protected $fillable = [
        'name',
        'cancellationReasonsTypeId',
        "reports",
        "monetized"
    ];

    protected $dates = ['created_at', 'updated_at'];

    protected $casts = [
        'created_at' => 'datetime:d-m-Y h:i:s',
        'updated_at' => 'datetime:d-m-Y h:i:s',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cancellationReasonsType()
    {
        return $this->belongsTo(CancellationReasonsType::class, 'cancellationReasonsTypeId');
    }

}
