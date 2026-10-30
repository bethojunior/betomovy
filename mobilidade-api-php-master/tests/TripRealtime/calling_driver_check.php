<?php

require __DIR__ . '/../../app/realtime/TripRealtime.php';

use app\realtime\TripRealtime;

$ref = new ReflectionClass(TripRealtime::class);
$trip = $ref->newInstanceWithoutConstructor();
$prop = $ref->getProperty('callingDriver');
$prop->setAccessible(true);
$method = $ref->getMethod('parseCallingDriver');
$method->setAccessible(true);

$cases = [
    [1037, ['1037']],
    ['1037,1040', ['1037', '1040']],
    [['12', 34], ['12', '34']],
    [null, []],
];

foreach ($cases as [$raw, $expected]) {
    $prop->setValue($trip, $raw);
    $method->invoke($trip);
    $actual = $prop->getValue($trip);
    if ($actual !== $expected) {
        fwrite(STDERR, 'callingDriver inesperado: ' . json_encode($actual) . PHP_EOL);
        exit(1);
    }
}

echo "callingDriver ok\n";
