<?php

/**
 * @param $string
 * @return mixed
 */
function onlyCharacters($string)
{
    return str_replace([
        '-','_','.',',','/','+','(',')',' ',
    ], '', $string);
}
