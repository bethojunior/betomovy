<?php 

    class MailChimpController {
        
        public function actionIntegrateMailChimp() {
            
            $email = json_decode(file_get_contents('php://input'))->email;
    
            if(registerMailChimp($email)) {
                echo json_encode(['status' => true, 'message' => 'Email registrado com sucesso!']);
                return;
            }

            echo json_encode(['status' => false, 'message' => 'Erro ao tentar registrar o email!']);
            return;
        
        }
    }
?>