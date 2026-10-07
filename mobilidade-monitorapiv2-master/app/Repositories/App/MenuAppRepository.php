<?php


namespace App\Repositories\App;

use App\Contracts\Repository\AbstractRepository;
use App\Models\App\MenuApp;
use Illuminate\Support\Facades\DB;

class MenuAppRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(MenuApp::class);
    }

    public function disableMenuActiveByType(int $menuAppTypeId)
    {
        return $this->getModel()
            ::where('menuAppTypeId', $menuAppTypeId)
            ->where('active', true)
            ->update(['active' => false]);
    }

    public function disableMenuApp(int $menuAppId)
    {
        return $this->getModel()
            ::where('id', $menuAppId)
            ->update(['active' => false]);
    }

    public function findActives()
    {
        return $this->getModel()
            ::where('active', true)
            ->with(["menuAppType"])
            ->get();
    }
    public function findActivesPro()
    {
        $actives = $this->getModel()
            ::where('active', true)
            ->with(["menuAppType"])
            ->get();

        $actives->transform(function ($item) {
            $item->buttonsActions = json_decode($item->buttonsActions, true);
            $item->buttonCta = json_decode($item->buttonCta, true);

            if (!is_null($item->linkImage) && !preg_match('/^https?:\/\//', $item->linkImage)) {
                $linkStoragePictures = DB::table('config')
                    ->where('key', 'link_storage_pictures')
                    ->value('value');
                $item->linkImage = $linkStoragePictures . $item->linkImage;
            }
            return $item;
        });

        return $actives;
    }
}
