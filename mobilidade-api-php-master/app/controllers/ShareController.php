<?php

namespace app\controllers;

use app\services\ShareService;

class ShareController extends ApiController
{
    private const FALLBACK_URL = 'https://play.google.com/store';

    public function actionIndex()
    {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
        $shareService = new ShareService();
        $redirectUrl = $shareService->getRedirectUrl($userAgent);
        $targetUrl = (is_string($redirectUrl) && trim($redirectUrl) !== '')
            ? trim($redirectUrl)
            : self::FALLBACK_URL;
        if (!filter_var($targetUrl, FILTER_VALIDATE_URL) || stripos($targetUrl, 'https://') !== 0) {
            $targetUrl = self::FALLBACK_URL;
        }
        header('Location: ' . $targetUrl, true, 302);
        exit;
    }
}
