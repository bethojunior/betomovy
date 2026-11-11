<?php
$pdo = new PDO('mysql:host=movy-mysql-do-user-17937402-0.c.db.ondigitalocean.com;port=25060;dbname=movy_db', 'doadmin', 'AVNS_ODYdiYw4rvg6gfvKYOO', [
    PDO::MYSQL_ATTR_SSL_CA => true,
    PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false
]);
$stmt = $pdo->query('SELECT * FROM card ORDER BY idCard DESC LIMIT 5');
echo "=== CARDS ===\n";
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

$stmt2 = $pdo->query('SELECT * FROM cardInfo ORDER BY idCardInfo DESC LIMIT 5');
echo "=== CARD INFO ===\n";
print_r($stmt2->fetchAll(PDO::FETCH_ASSOC));
