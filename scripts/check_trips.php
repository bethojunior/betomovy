<?php
try {
    $pdo = new PDO('mysql:host=movy-prod.c3iqg048s8l7.us-east-1.rds.amazonaws.com;dbname=movy', 'admin', 'MovyMob2024#');
    $stmt = $pdo->query('SELECT tripReference, driverId, status, callingDriver, date, userId FROM trip ORDER BY id DESC LIMIT 5');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
