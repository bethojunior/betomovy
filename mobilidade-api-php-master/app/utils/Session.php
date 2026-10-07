<?php

namespace app\utils;
/**
 * Class Session
 * @package utils
 */
class Session
{
    /**
     * Função para iniciar sessão
     * @param $manterConectado
     * @param $session
     * @param $valor
     */
    public static function startSession($session, $valor, $manterConectado = false)
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION[$session] = $valor;

        if ($manterConectado == true) {
            setcookie($session, $_SESSION[$session], PHP_INT_MAX);
        }
    }


    /**
     * Função para checar sessão
     * @param $nameSession
     * @return bool
     */
    public static function checkSession($nameSession)
    {
        if (isset($_COOKIE[$nameSession]) || isset($_SESSION[$nameSession])) {
            if (isset($_COOKIE[$nameSession])) {
                $_SESSION[$nameSession] = $_COOKIE[$nameSession];
            }
            return true;
        } else {
            return false;
        }
    }
}