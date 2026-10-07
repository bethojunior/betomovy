<?php

namespace App\Repositories\App;

use App\Contracts\Repository\AbstractRepository;
use App\Models\App\AppModule;

class AppModuleRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(AppModule::class);
    }

    public function getAll()
    {
      return $this->getModel()
      ::selectRaw("
        appModules.name As name,
        appActiveModules.id,
        appActiveModules.logo,
        appActiveModules.isActive
        "
      )
      ->join('appModules', 'appModules.id', '=', 'appActiveModules.appModuleId')
      ->get();
    }

    public function updateLogo($request) {
      return $this->getModel()
      ::where('id', $request['id'])
      ->update([
        'logo' => $request['logo']
      ]);
    }

    public function updateStatus($request) {
      return $this->getModel()
      ::where('id', $request['id'])
      ->update([
        'isActive' => $request['isActive']
      ]);
    }
}