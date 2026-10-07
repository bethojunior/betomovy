<?php

function backgroundTask($command, ...$params)
{
    $params = implode(" ", $params);

    exec(
        "nohup php ../console/command.php {$command} {$params} > /dev/null 2>&1 & echo $! ");
}

function backgroundTaskDev($command, ...$params)
{
    $params = implode(" ", $params);
    exec(
        "php ../console/command.php {$command} {$params} > /dev/tty 2>&1 & echo $!"
    );
}
