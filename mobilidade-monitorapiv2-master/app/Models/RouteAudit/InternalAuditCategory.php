<?php


namespace App\Models\RouteAudit;


use Illuminate\Database\Eloquent\Model;

class InternalAuditCategory extends Model
{
    protected $table = 'internalAuditCategory';
    protected $fillable = [
        'name',
        'path',
        'description',
        'content'
    ];
    public $timestamps = false;
}
