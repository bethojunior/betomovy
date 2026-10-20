<?php

class WhatsAppController extends View
{
    private function isWhatsappEnabled(): bool
    {
        $user    = Session::get('user');
        $apiHost = getenv('API_HOST');

        if (!$user || !$apiHost) {
            return false;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, rtrim($apiHost, '/') . '/config/enable_whatsapp_central');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'token: ' . $user->api_token,
            'userid: ' . $user->idUser,
            'Content-Type: application/json',
        ]);
        $response = curl_exec($ch);
        curl_close($ch);

        if (!$response) {
            return false;
        }

        $config = json_decode($response);
        return $config && $config->status && $config->response !== '0';
    }

    public function actionList(){
        $this->actionManagement();
    }

    public function actionGroups(){
        if (!$this->isWhatsappEnabled()) {
            $this->redirectController('');
            return;
        }

        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'whatsapp/groups'
            ],
            [
                'repositories/TripRepository',
                'repositories/TripPaymentFormRepository',
                'repositories/KeyRepository',
                'utils/whatsappSession',
                'repositories/whatsappRepository',
                'repositories/ConfigRepository',
                'modules/whatsapp/group'
            ],
            [
                'whatsapp/groups',
                'whatsapp/management'
            ]
        );
    }

    public function actionManagement(){
        if (!$this->isWhatsappEnabled()) {
            $this->redirectController('');
            return;
        }

        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'whatsapp/management'
            ],
            [
                'repositories/TripRepository',
                'repositories/TripPaymentFormRepository',
                'repositories/KeyRepository',
                'utils/whatsappSession',
                'repositories/whatsappRepository',
                'repositories/ConfigRepository',
                'modules/whatsapp/management'
            ],
            [
                'whatsapp/management'
            ]
        );
    }
}