<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/07/2019
 * Time: 19:16
 */

namespace App\Repositories\Trip\ChatTrip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\ChatTrip\MessagesChatTrip;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class MessagesChatTripRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(MessagesChatTrip::class);
    }

    public function getMessagesByTrip(string $tripReference): Collection
    {
        return $this->getQuery()
            ->join('user', 'messagesChatTrip.userId', '=', 'user.idUser')
            ->join('chatTrip', 'messagesChatTrip.chatTripId', '=', 'chatTrip.idChatTrip')
            ->leftJoin('driver', 'user.idUser', '=', 'driver.userId')
            ->where('tripReference', $tripReference)
            ->orderBy('messagesChatTrip.date')
            ->select([
                'user.name',
                'user.nickname',
                'messagesChatTrip.message',
                'messagesChatTrip.userId',
                'messagesChatTrip.date',
                DB::raw('CASE WHEN driver.idDriver IS NULL THEN false ELSE true END AS isDriver'),
                'messagesChatTrip.isAudio',
            ])
            ->get();
    }
}
