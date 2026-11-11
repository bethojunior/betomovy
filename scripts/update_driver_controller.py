import re

with open('mobilidade-api-php-master/app/controllers/DriverController.php', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update actionIndex to handle DELETE
target1 = """            // If a specific ID is requested in route (e.g. /driver/123)
            $driverId = $_GET['id'] ?? null;
            if ($driverId && is_numeric($driverId)) {
                $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
                if ($method === 'PUT') {
                    $this->handleUpdateDriver($pdo, (int)$driverId);
                    return;
                }
                $driver = $this->findDriverDetail($pdo, (int)$driverId);
                echo $this->returnSuccess('Motorista encontrado', $driver);
                return;
            }"""

replacement1 = """            // If a specific ID is requested in route (e.g. /driver/123)
            $driverId = $_GET['id'] ?? null;
            if ($driverId && is_numeric($driverId)) {
                $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
                if ($method === 'PUT') {
                    $this->handleUpdateDriver($pdo, (int)$driverId);
                    return;
                }
                if ($method === 'DELETE') {
                    $this->handleDeleteDriver($pdo, (int)$driverId);
                    return;
                }
                $driver = $this->findDriverDetail($pdo, (int)$driverId);
                echo $this->returnSuccess('Motorista encontrado', $driver);
                return;
            }"""

# 2. Add password & observation support in handleUpdateDriver
target2 = """        if (isset($data['name'])) {"""

replacement2 = """        if (!empty($data['password'])) {
            $userUpdates[] = "password = :pwd";
            $userParams[':pwd'] = base64_encode((string)$data['password']);
        }
        if (array_key_exists('observation', $data)) {
            $userUpdates[] = "observation = :observation";
            $userParams[':observation'] = $data['observation'] !== null ? trim((string)$data['observation']) : null;
        }

        if (isset($data['name'])) {"""

# 3. Add handleDeleteDriver
target3 = """    /**
     * POST /driver/:id/address
     */
    public function actionAddress()"""

replacement3 = """    /**
     * DELETE /driver/:id
     */
    private function handleDeleteDriver(PDO $pdo, int $driverId)
    {
        $stmtDriver = $pdo->prepare("SELECT idDriver, userId, balanceId FROM driver WHERE idDriver = :id LIMIT 1");
        $stmtDriver->execute([':id' => $driverId]);
        $driver = $stmtDriver->fetch(PDO::FETCH_ASSOC);

        if (!$driver) {
            throw new \\Exception("Motorista não encontrado");
        }

        $userId = (int)$driver['userId'];

        // 1. Marcar usuário como deletado (statusId = 2) conforme regra da listagem
        $stmtU = $pdo->prepare("UPDATE user SET statusId = 2, updated_at = NOW() WHERE idUser = :userId");
        $stmtU->execute([':userId' => $userId]);

        // 2. Desativar motorista (offline, app fechado, status bloqueado)
        $stmtD = $pdo->prepare("
            UPDATE driver 
            SET status = 0, 
                appIsOpen = 0, 
                preAvailable = 0, 
                driverRegisterStatusId = 3 
            WHERE idDriver = :id
        ");
        $stmtD->execute([':id' => $driverId]);

        // 3. Marcar veículos do motorista como deletados
        try {
            $pdo->prepare("UPDATE car SET deleted_at = NOW() WHERE driverId = :driverId AND deleted_at IS NULL")
                ->execute([':driverId' => $driverId]);
        } catch (\\Throwable $e) {}

        // 4. Marcar endereços como deletados
        try {
            $pdo->prepare("UPDATE driverAddress SET deleted_at = NOW() WHERE driverId = :driverId AND deleted_at IS NULL")
                ->execute([':driverId' => $driverId]);
        } catch (\\Throwable $e) {}

        // 5. Desativar sessões/dispositivos
        try {
            $pdo->prepare("UPDATE userDevice SET status = 0 WHERE userId = :userId")
                ->execute([':userId' => $userId]);
        } catch (\\Throwable $e) {}

        // 6. Remover de caches ou Redis se existir
        try {
            (new \\app\\utils\\RedisDriverCalled())->deleteDriver($driverId);
        } catch (\\Throwable $e) {}

        echo $this->returnSuccess('Motorista excluído com sucesso');
    }

    /**
     * POST /driver/:id/address
     */
    public function actionAddress()"""

# Normalize \r\n to \n for replacement
c_norm = content.replace('\r\n', '\n')
t1_norm = target1.replace('\r\n', '\n')
t2_norm = target2.replace('\r\n', '\n')
t3_norm = target3.replace('\r\n', '\n')

assert t1_norm in c_norm, "Target 1 not found"
assert t2_norm in c_norm, "Target 2 not found"
assert t3_norm in c_norm, "Target 3 not found"

c_norm = c_norm.replace(t1_norm, replacement1.replace('\r\n', '\n'))
c_norm = c_norm.replace(t2_norm, replacement2.replace('\r\n', '\n'))
c_norm = c_norm.replace(t3_norm, replacement3.replace('\r\n', '\n'))

with open('mobilidade-api-php-master/app/controllers/DriverController.php', 'w', encoding='utf-8') as f:
    f.write(c_norm)

print("SUCCESS: DriverController.php updated cleanly!")
