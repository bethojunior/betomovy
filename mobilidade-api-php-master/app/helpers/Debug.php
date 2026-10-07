<?php
function dd(...$value)
{
    foreach ($value as $item) {
        echo "<pre>";
        print_r($item);
        echo "</pre>";
    }
    die();
}
