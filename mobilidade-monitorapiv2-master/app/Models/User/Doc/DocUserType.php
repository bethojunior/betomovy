<?php

namespace App\Models\User\Doc;

use App\Models\User\UserType;
use Illuminate\Database\Eloquent\Model;

class DocUserType extends Model
{
    protected $table = 'docUserType';

    protected $fillable = ['docId', 'userTypeId'];

    public function userType()
    {
        return $this->belongsTo(UserType::class, 'userTypeId');
    }

    public function doc()
    {
        return $this->belongsTo(Doc::class, 'docId');
    }
}
