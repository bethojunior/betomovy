<?php

function backgroundTask($command, ...$params)
{
    $params = implode(" ", $params);
    $consolePath = realpath(__DIR__ . '/../../console') ?: '/var/www/html/console';

    exec(
        "cd {$consolePath} && nohup /usr/bin/php command.php {$command} {$params} > /dev/null 2>&1 & echo $!"
    );
}

function backgroundTaskDev($command, ...$params)
{
    $params = implode(" ", $params);
    $consolePath = realpath(__DIR__ . '/../../console') ?: '/var/www/html/console';
    exec(
        "cd {$consolePath} && /usr/bin/php command.php {$command} {$params} > /dev/tty 2>&1 & echo $!"
    );
}
