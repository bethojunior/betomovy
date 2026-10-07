<?php

function formatDateMongo($date)
{
    $date = str_replace('/', '-', $date);
    return date("Y-m-d H:i:s", strtotime($date));
}
