<?php

namespace app\services;

use app\model\Config;

class ShareService
{
    private const KEY_PLAY_STORE = 'url_redirect_app_play_store';
    private const KEY_APP_STORE = 'url_redirect_app_app_store';

    public function getRedirectUrl(?string $userAgent): ?string
    {
        $userAgent = $userAgent ?? '';
        $playStoreUrl = Config::get(self::KEY_PLAY_STORE);

        if ($this->isIos($userAgent)) {
            $appStoreUrl = Config::get(self::KEY_APP_STORE);
            return $this->nonEmptyString($appStoreUrl) ? $appStoreUrl : $playStoreUrl;
        }

        return $playStoreUrl;
    }

    private function isIos(string $userAgent): bool
    {
        return preg_match('/iPhone|iPad|iPod/i', $userAgent) === 1;
    }

    private function nonEmptyString($value): bool
    {
        return is_string($value) && trim($value) !== '';
    }
}
