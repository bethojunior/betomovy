<?php


namespace App\Models\ListContacts;

use Illuminate\Database\Eloquent\Model;

class ListContactsGeneral extends Model
{
    protected $table = 'list_contacts_general';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id_person',
        'name_person',
        'phone_person'
    ];
}
