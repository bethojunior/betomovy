<?php

namespace app\commands;

use app\services\UserPenaltyService;
use app\utils\Command;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/05/2019
 * Time: 17:44
 */
class ClearUserPenaltyCommand extends Command
{
    private $service;

    public function __construct($params = null)
    {
        $this->response = writeLn("Iniciando conexão");
        parent::__construct($params);
        $this->response .= writeLn("Conexão aberta");
        $this->service = new UserPenaltyService;
        $this->logCommand = true;
    }

    public function handle(): void
    {
        $this->response .= writeLn("Buscando motoristas");
        $penalties = $this->service
            ->getAllActives();

        $this->response .= writeLn(count($penalties) . " motoristas encontrados");
        $this->response .= writeLn(" ---------------------------------- ");

        if (empty($penalties)) {
            $this->response .= writeLn("Nenhuma penalidade a ser liberada.");
            return;
        }

        $this->response .= writeLn("Filtrando ID's");

        $ids = array_map(function ($penalty) {
            $this->response .= writeLn("ID do motorista: " . $penalty->name . " de " . $penalty->diffInHours . " horas");
            return $penalty->idUserPenalty;
        }, $penalties);

        $this->response .= writeLn(" ---------------------------------- ");
        $this->response .= writeLn("Removendo penalidades");

        try {
            $this->service->invalidateMany($ids);
        } catch (Exception $e) {
            $this->response .= writeLn("################################");
            $this->response .= writeLn("# Falha ao remover penalidades #");
            $this->response .= writeLn("################################");
            $this->response .= writeLn("ERRO: " . $e->getMessage());
            $this->response .= writeLn("Arquivo: " . $e->getFile());
            $this->response .= writeLn("Linha: " . $e->getLine());
            $this->response .= writeLn("Trace: " . $e->getTraceAsString());
            return;
        }

        $this->response .= writeLn("#####################################");
        $this->response .= writeLn("# Penalidades removidas com sucesso #");
        $this->response .= writeLn("#####################################");
    }
}