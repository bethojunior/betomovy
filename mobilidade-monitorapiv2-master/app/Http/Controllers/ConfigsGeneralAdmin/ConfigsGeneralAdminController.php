<?php

namespace App\Http\Controllers\ConfigsGeneralAdmin;

use App\Http\Controllers\Controller;
use App\Utils\Admin704Apps\Admin704Apps;

class ConfigsGeneralAdminController extends Controller
{
    /**
     * @var Admin704Apps
     */
    private $admin704Apps;

    public function __construct(Admin704Apps $admin704Apps)
    {
        $this->admin704Apps = $admin704Apps;
    }

    public function getConfigsGeneralAdmin(string $key)
    {
        return $this->admin704Apps->getInformationsConfigGeneralByKey($key);
    }
}
