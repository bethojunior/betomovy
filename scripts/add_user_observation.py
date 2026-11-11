with open('mobilidade-api-php-master/app/controllers/UserController.php', 'r', encoding='utf-8') as f:
    c = f.read()

method = """    /**
     * PUT /user/:id/observation
     */
    public function actionObservation()
    {
        try {
            $userId = (int)($_GET['id'] ?? 0);
            if ($userId <= 0) {
                throw new \\Exception("ID do usuário não informado");
            }

            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true);
            if (!is_array($data)) {
                $data = $_POST;
            }

            $observation = isset($data['observation']) ? (string)$data['observation'] : '';

            $pdo = \\app\\utils\\Connection::open(\\app\\utils\\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE user SET observation = :obs, updated_at = NOW() WHERE idUser = :userId");
            $stmt->execute([
                ':obs' => $observation,
                ':userId' => $userId
            ]);

            echo $this->returnSuccess('Anotação salva com sucesso', ['observation' => $observation]);
        } catch (\\Throwable $e) {
            echo $this->returnError($e, 'Erro ao salvar anotação');
        }
    }
}
"""

# Replace the closing brace of UserController
idx = c.rfind('}')
if idx != -1:
    new_c = c[:idx] + method
    with open('mobilidade-api-php-master/app/controllers/UserController.php', 'w', encoding='utf-8') as f:
        f.write(new_c)
    print("SUCCESS: actionObservation added to UserController.php")
else:
    print("FAILED: closing brace not found")
