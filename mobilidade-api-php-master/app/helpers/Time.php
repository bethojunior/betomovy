<?php
/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 15:08
 */

use Carbon\Carbon;

/**
 * @return string
 */
function now(?string $timezone = null)
{
    return Carbon::now($timezone)->format('Y-m-d H:i:s');
}

/**
 * @return false|string
 */
function today($timezone = null)
{
    if (is_null($timezone)) return date('Y-m-d');

    date_default_timezone_set($timezone);
    return date('Y-m-d');
}

/**
 * @return string
 */
function todayEndOfDay()
{
    return Carbon::today()->endOfDay()->format('Y-m-d H:i:s');
}

/**
 * @param $date
 * @return string
 */
function brazilian_FullFormat($date)
{
    Carbon::setLocale('pt_BR');

    return Carbon::parse($date)
        ->isoFormat('dddd, D [de] MMMM [de] YYYY, H:mm');
}

/**
 * Adicionar x dias a uma data
 * @param $startDate
 * @param int $days
 * @return string
 */
function addDays($startDate, $days)
{
    $startDate = Carbon::parse($startDate);

    $finalDate = $startDate->addDays($days);

    return $finalDate->format('Y-m-d H:i:s');
}

/**
 * @param $date 'format('Y-m-d')'
 * @param $subValue
 * @return false|string
 */
function subDays($date, $subValue)
{
    return date('Y-m-d', strtotime($date . ' -' . $subValue . ' days'));
}

/**
 * @param $date
 * @param int $secondsToAdd
 * @return false|string
 */
function addSeconds($date, int $secondsToAdd)
{
    return date('Y-m-d H:i:s', strtotime($date . ' +' . $secondsToAdd . ' seconds'));
}

/**
 * @param $date
 * @param int $minutesToAdd
 * @return false|string
 */
function addMinutes($date, int $minutesToAdd)
{
    return date('Y-m-d H:i:s', strtotime($date . ' +' . $minutesToAdd . ' minutes'));
}

/**
 * @param $date_start
 * @param $date_end
 * @param bool $absolute
 * @return mixed
 */
function diffInDays($date_start, $date_end, $absolute = false)
{
    $date_start = new DateTime($date_start);
    $date_end = new DateTime($date_end);

    return $date_start->diff($date_end, $absolute)->days;
}

/**
 * @param $date_start
 * @param $date_end
 * @param bool $absolute
 * @return float|int
 */
function diffInSeconds($date_start, $date_end, $absolute = true)
{
    $date_start = Carbon::parse($date_start);
    $date_end = Carbon::parse($date_end);

    return $date_start->diffInSeconds($date_end, $absolute);
}

/**
 * @param $date_start
 * @param $date_end
 * @param bool $absolute
 * @return float|int
 */
function diffInMinutes($date_start, $date_end, $absolute = true)
{
    $date_start = Carbon::parse($date_start);
    $date_end = Carbon::parse($date_end);

    return $date_start->diffInMinutes($date_end, $absolute);
}

function diffInYears($dateStart, $dateEnd)
{
    $year =  diffInDays($dateStart, $dateEnd) / 365;
    return $year;
}

/**
 * @param $date
 * @param $dateOfComparison
 * @return bool
 */
function dateIsBefore($date, $dateOfComparison)
{
    return Carbon::parse($date)
        ->isBefore(
            Carbon::parse($dateOfComparison));
}