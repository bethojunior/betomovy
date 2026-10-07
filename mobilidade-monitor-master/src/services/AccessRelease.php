<?php

class AccessRelease
{
    public $group;
    public $permission;

    public function __construct()
    {
        $this->url = new Route();
//        self::findPermissionByUrl();
    }

    public function findPermissionByUrl()
    {
        $url = Route::getPath();
        $permission = array(
            'data' => [
                'trip/list' => [
                    'group' => GroupConst::VIAGEM,
                    'permission' => 'listar_basico'
                ],
                'client/list' => [
                    'group' => GroupConst::VIAGEM,
                    'permission' => 'listar_basico'
                ]
            ]
        );


        foreach ($permission as $verify){
            try{
                if($verify[$url]){
                    $here = $verify[$url];
                    $this->group = $here['group'];
                    $this->permission = $here['permission'];
                }
            }catch (Exception $exception){
                throw new Exception("Não possui permissão");
            }
        }

    }

}