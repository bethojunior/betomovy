<?php

function backgroundTask($command, ...$params)
{
    $params = implode(" ", $params);
    $consolePath = realpath(__DIR__ . '/../../console') ?: '/var/www/html/console';
    $php = (PHP_BINARY && is_file(PHP_BINARY)) ? escapeshellarg(PHP_BINARY) : 'php';

    exec(
        "cd {$consolePath} && nohup {$php} command.php {$command} {$params} > /dev/null 2>&1 & echo $!"
    );
}

function backgroundTaskDev($command, ...$params)
{
    $params = implode(" ", $params);
    $consolePath = realpath(__DIR__ . '/../../console') ?: '/var/www/html/console';
    $php = (PHP_BINARY && is_file(PHP_BINARY)) ? escapeshellarg(PHP_BINARY) : 'php';
    exec(
        "cd {$consolePath} && {$php} command.php {$command} {$params} > /dev/tty 2>&1 & echo $!"
    );
}
