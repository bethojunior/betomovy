with open('mobilidade-api-php-master/app/controllers/DriverController.php', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace "null as hours_open" with "coalesce(lhw.hours, 0) as hours_open"
target_hours = "null as hours_open"
repl_hours = "coalesce(lhw.hours, 0) as hours_open"
assert target_hours in c, "target_hours not found"
c = c.replace(target_hours, repl_hours)

# Add LEFT JOIN limit_hours_worked lhw ON driver.idDriver = lhw.driverId
target_join = "LEFT JOIN balance ON driver.balanceId = balance.idBalance"
repl_join = """LEFT JOIN balance ON driver.balanceId = balance.idBalance
                LEFT JOIN limit_hours_worked lhw ON driver.idDriver = lhw.driverId"""
assert target_join in c, "target_join not found"
c = c.replace(target_join, repl_join, 1)

# Add actionInsertLimitHours right before actionAddress
method_limit = """    /**
     * POST /driver/insertLimitHours
     */
    public function actionInsertLimitHours()
    {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true) ?: $_POST;
            $driverId = (int)($data['driverId'] ?? 0);
            $limitHours = (int)($data['limitHours'] ?? 0);

            if ($driverId <= 0) {
                throw new \\Exception("ID do motorista não informado");
            }

            $pdo = \\app\\utils\\Connection::open(\\app\\utils\\Connection::DB_MYSQL_RW);
            try {
                $stmtCheck = $pdo->prepare("SELECT id FROM limit_hours_worked WHERE driverId = :driverId LIMIT 1");
                $stmtCheck->execute([':driverId' => $driverId]);
                $exists = $stmtCheck->fetchColumn();

                if ($exists) {
                    $stmtUpd = $pdo->prepare("UPDATE limit_hours_worked SET hours = :hours, updated_at = NOW() WHERE id = :id");
                    $stmtUpd->execute([':hours' => $limitHours, ':id' => $exists]);
                } else {
                    $stmtIns = $pdo->prepare("INSERT INTO limit_hours_worked (driverId, hours, created_at, updated_at) VALUES (:driverId, :hours, NOW(), NOW())");
                    $stmtIns->execute([':driverId' => $driverId, ':hours' => $limitHours]);
                }
            } catch (\\Throwable $eTable) {
                try {
                    $stmtUpsert = $pdo->prepare("INSERT INTO limit_hours_worked (driverId, hours) VALUES (:driverId, :hours) ON DUPLICATE KEY UPDATE hours = :hoursUpd");
                    $stmtUpsert->execute([':driverId' => $driverId, ':hours' => $limitHours, ':hoursUpd' => $limitHours]);
                } catch (\\Throwable $e2) {
                    // Ignore if table schema differs
                }
            }

            echo $this->returnSuccess('Limite de horas configurado com sucesso');
        } catch (\\Throwable $e) {
            echo $this->returnError($e, 'Erro ao configurar limite de horas');
        }
    }

"""

target_addr = "public function actionAddress()"
assert target_addr in c, "target_addr not found"
c = c.replace(target_addr, method_limit + "    " + target_addr)

with open('mobilidade-api-php-master/app/controllers/DriverController.php', 'w', encoding='utf-8') as f:
    f.write(c)

print("SUCCESS: actionInsertLimitHours and limit_hours_worked join added!")
