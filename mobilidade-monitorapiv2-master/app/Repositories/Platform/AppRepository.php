<?php


namespace App\Repositories\Platform;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Platform\App;

class AppRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(App::class);
    }

    public function all()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->get(['idApp', 'name']);
    }
}
