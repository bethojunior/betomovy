<?php


namespace app\dao;

use app\utils\BaseDao;
use app\model\Config;

class MenuAppDao extends BaseDao
{
    public $table = 'menuApp';

    public function findByType($menuAppTypeId)
    {
        $results = $this->sqlSelect(
            [],
            [['active', '=', ':active', ' and '], ['menuAppTypeId', '=', ':menuAppTypeId']]
        )
            ->bind([':active' => true, ':menuAppTypeId' => $menuAppTypeId])
            ->get(true);
        $link_storage_pictures = Config::get('link_storage_pictures');
        foreach ($results as $result) {
            if ($result->linkImage && !preg_match('/^https?:\/\//', $result->linkImage)) {
                $result->linkImage = $link_storage_pictures . $result->linkImage;
            }
            $result->buttonsActions = json_decode($result->buttonsActions, true);
            $result->buttonCta = json_decode($result->buttonCta, true);
        }
        return $results[0] ?? [];
    }
}