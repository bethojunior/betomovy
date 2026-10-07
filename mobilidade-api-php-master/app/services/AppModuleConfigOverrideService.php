<?php

namespace app\services;

/**
 * Sobrescreve, na leitura, o value das 3 chaves legadas (enable_*_app) com o estado
 * real do módulo correspondente — appActiveModules é a fonte de verdade, o Cordova
 * legado só sabe ler config/general (showTab() em www/webfiles/js/modulos/tabs/index.js).
 */
class AppModuleConfigOverrideService
{
    /** Mapa config.key => appModules.name, só pras chaves com módulo equivalente. */
    private const CONFIG_KEY_TO_MODULE = [
        'enable_mobility_app' => 'Mobilidade',
        'enable_freight_app' => 'Frete',
        'enable_share_trip_app' => 'Rotas',
    ];

    private $moduleService;

    public function __construct(AppActiveModuleService $moduleService = null)
    {
        $this->moduleService = $moduleService ?? new AppActiveModuleService();
    }

    /**
     * @param array $configs Lista de objetos {key, value} vinda de ConfigDao::findMany().
     * @return array Mesma lista, com o value das 3 chaves mapeadas sobrescrito pelo
     *               estado real do módulo correspondente.
     */
    public function applyOverrides(array $configs): array
    {
        $moduleNames = [];
        foreach ($configs as $config) {
            if (isset(self::CONFIG_KEY_TO_MODULE[$config->key])) {
                $moduleNames[] = self::CONFIG_KEY_TO_MODULE[$config->key];
            }
        }

        if (empty($moduleNames)) {
            return $configs;
        }

        $modulesByName = [];
        foreach ($this->moduleService->findManyByModuleName($moduleNames) as $module) {
            $modulesByName[$module->moduleName] = $module;
        }

        foreach ($configs as $config) {
            $moduleName = self::CONFIG_KEY_TO_MODULE[$config->key] ?? null;
            if ($moduleName === null || !isset($modulesByName[$moduleName])) {
                continue;
            }

            $config->value = ((int) $modulesByName[$moduleName]->isActive === 1) ? '1' : '0';
        }

        return $configs;
    }
}
