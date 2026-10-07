<?php

namespace app\utils;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2019
 * Time: 11:05
 */
class Command
{
    private $command_dir;

    protected $response;
    protected $conn;
    protected $params;
    protected $logCommand = false;
    protected $command;

    public function __construct($params = null)
    {
        $this->command_dir = require '../configs/commands/commands.php';
        $this->params = $params;
        $this->conn = Connection::open();
    }

    /**
     * @param $command
     * @return mixed|string
     */
    public function exec($command)
    {
        if (array_key_exists(strtolower($command), $this->command_dir))
            return $this->execByClass($command);

        return "Comando não encontrado";
    }

    /**
     * @param $command
     * @return mixed
     */
    protected function execByClass($command)
    {
        $class = $this->getClass($command);

        if ($class instanceof Command) {
            $class->handle();
            if ($class->isLogCommand())
                $this->generateLog($class, $command);
        }

        return $class instanceof Command ?
            $class->getResponse() :
            $this->response;
    }

    /**
     * @param $command
     * @return Command|null
     */
    protected function getClass($command): ?Command
    {
        $class = "app\\commands\\" . $this->command_dir[$command];
        if (class_exists($class))
            return new $class($this->params);

        $this->response = "Classe não encontrada";
        return null;
    }

    public function handle(): void
    {
        $this->response = "Nada implementado";
    }

    /**
     * @return mixed
     */
    public function getResponse()
    {
        return $this->response;
    }

    protected function generateLog(?Command $class, $command)
    {
        $fileName = str_replace([' ', '-', ':'], ['T', ''], $command . "_" . now() . ".log");

        $message = $class instanceof Command ?
            $class->getResponse() :
            $this->response;

        $dir = '..' . DIRECTORY_SEPARATOR .
            'commands' . DIRECTORY_SEPARATOR .
            'logs' . DIRECTORY_SEPARATOR .
            '' . $command;

        if (!is_dir($dir))
            mkdir($dir);

        $file = fopen($dir . DIRECTORY_SEPARATOR . $fileName, 'a+');

        fwrite($file, $message);
        fclose($file);

        $this->response = "Log gerado. Consultar log";
    }

    /**
     * @return bool
     */
    public function isLogCommand(): bool
    {
        return $this->logCommand;
    }

    /**
     * @param bool $logCommand
     */
    public function setLogCommand(bool $logCommand): void
    {
        $this->logCommand = $logCommand;
    }

}