<?php

require __DIR__ . '/../../app/utils/PushData.php';

use app\utils\PushData;

$encoded = PushData::stringify([
    'tag' => 'rideRequest',
    'additionalData' => [
        'tripReference' => 'TRIP-1',
        'userId' => 4634,
        'tripCallTypeId' => 1,
    ],
    'empty' => null,
]);

if (($encoded['tag'] ?? '') !== 'rideRequest') {
    fwrite(STDERR, "tag nao preservada\n");
    exit(1);
}

$extra = json_decode($encoded['additionalData'] ?? '', true);
if (!is_array($extra) || (int)$extra['userId'] !== 4634 || $extra['tripReference'] !== 'TRIP-1') {
    fwrite(STDERR, "additionalData nao serializado como JSON\n");
    exit(1);
}

if (array_key_exists('empty', $encoded)) {
    fwrite(STDERR, "campo nulo nao deveria ser enviado\n");
    exit(1);
}

echo "PushData ok\n";
