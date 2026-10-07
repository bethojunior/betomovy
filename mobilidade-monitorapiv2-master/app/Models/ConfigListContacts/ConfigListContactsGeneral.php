<?php


namespace App\Models\ConfigListContacts;

use Illuminate\Database\Eloquent\Model;

class ConfigListContactsGeneral extends Model
{
    protected $table = 'config_list_contacts_general';
    protected $primaryKey = 'id';

    protected $fillable = [
        'messageContacts'
    ];
}
