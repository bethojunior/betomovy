<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 26/06/2019
 * Time: 10:08
 */

class CustomerController extends View
{
    public function actionList(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'customer/list'
            ],
            [
                'repositories/CentralRepository',
                'modules/customer/list'
            ],
            [
                'customer/list'
            ]
        );
    }

    public function actionNew(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'customer/create'
            ],
            [
                'repositories/CentralRepository',
                'modules/customer/new'
            ],
            [
                'customer/edit'
            ]
        );
    }

    public function actionGet(){
        $this->addEvents(
            [
                'edit' => 'edit',
            ]);
    }

    public function edit(){
        $this->setTemplate(Template::defaultView());

        $customerId  = $this->params[0] ?? null;
        $user        = Session::get('user');
        $central     = Session::get('centralSelected');
        $customerData = null;

        if ($customerId && $user && $central) {
            $apiHost   = getenv('API_HOST') ?: 'http://localhost:8000/';
            $url       = rtrim($apiHost, '/') . "/central/{$central->id}/customer/{$customerId}";

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 5,
                CURLOPT_HTTPHEADER     => [
                    'Content-Type: application/json',
                    'token: '  . $user->api_token,
                    'userid: ' . $user->idUser,
                ],
            ]);
            $raw = curl_exec($ch);
            curl_close($ch);

            if ($raw) {
                $json = json_decode($raw, true);
                if (!empty($json['status']) && !empty($json['response'])) {
                    $customerData = $json['response'];
                }
            }
        }

        $this->customerData = $customerData;

        $this->layoutBuilder(
            [
                'customer/edit'
            ],
            [
                'repositories/CentralRepository',
                'modules/customer/edit'
            ],
            [
                'customer/edit'
            ]
        );
    }
}