<?php

/**
 * @param $string
 * @return mixed
 */
function onlyCharacters($string)
{
    // Remove all characters except letters and numbers.
    return preg_replace('/[^A-Za-z0-9]/', '', $string);
}

function brazilianCash(float $value)
{
    return number_format($value, 2, ',', '.');
}
