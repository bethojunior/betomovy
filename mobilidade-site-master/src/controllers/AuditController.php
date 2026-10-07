<?php

class AuditController extends View
{
    function actionIndex()
    {
        $js = ['controllers/HomeController', 'modulos/audit'];
        $css = ['reset', 'navbar', 'assets', 'audit', 'footer'];

        $views = [
            'preload/index',
            'nav/navBarAudit',
            'audit/index',
            'import/footerAudit'
        ];

        $seo = new stdClass();
        $seo->description = 'Sistema de auditoria e verificação de motoristas para fiscalização de trânsito';
        $seo->title = Host::getApplicationName() . ' - Auditoria de Trânsito';

        $this->layoutBuilder($views, $js, $css, $seo);
    }
}

