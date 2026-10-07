<?php

namespace app\validator;

use app\exceptions\CheckoutCardException;
use app\validator\contracts\ICheckoutValidator;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/09/2019
 * Time: 10:46
 */
class CieloCheckoutValidator implements ICheckoutValidator
{
    private $response;

    /**
     * @param $status
     * @param $status_detail
     * @throws CheckoutCardException
     */
    public function validateTransactionResponse($status, $status_detail): void
    {
        $this->response['status'] = $status;
        $this->response['status_detail'] = $status_detail;

        switch ($status) {
            case 3:
            case 13:
            case 10:
                $this->validateStatusRejected($status_detail);
            case 0:
            case 1:
            case 12:
                throw new CheckoutCardException(1156, $this->response);
        }
    }

    /**
     * @param $status
     * @throws CheckoutCardException
     */
    private function validateStatusRejected($status)
    {
        switch ($status) {
            case "01":
            case "02":
            case "30":
            case "AF":
            case "AG":
            case "BD":
            case "BO":
            case "BP176":
            case "FA":
            case "GD":
                throw new CheckoutCardException(1163, $this->response);
            case "03":
                throw new CheckoutCardException(1164, $this->response);
            case "04":
            case "41":
            case "43":
            case "78":
            case "BN":
                throw new CheckoutCardException(1165, $this->response);
            case "05":
                throw new CheckoutCardException(1166, $this->response);
            case "06":
                throw new CheckoutCardException(1167, $this->response);
            case "07":
            case "39":
            case "FD":
                throw new CheckoutCardException(1168, $this->response);
            case "08":
            case "N7":
                throw new CheckoutCardException(1169, $this->response);
            case "12":
            case "13":
            case "14":
            case "82":
            case "AV":
            case "BM":
                throw new CheckoutCardException(1170, $this->response);
            case "15":
            case "61":
            case "91":
            case "AA":
                throw new CheckoutCardException(1171, $this->response);
            case "19":
                throw new CheckoutCardException(1172, $this->response);
            case "28":
            case "98":
            case "99":
            case "999":
                throw new CheckoutCardException(1173, $this->response);
            case "51":
            case "70":
            case "DM":
                throw new CheckoutCardException(1152, $this->response);
            case "52":
                throw new CheckoutCardException(1174, $this->response);
            case "53":
                throw new CheckoutCardException(1175, $this->response);
            case "54":
            case "BV":
                throw new CheckoutCardException(1176, $this->response);
            case "55":
            case "74":
            case "83":
                throw new CheckoutCardException(1177, $this->response);
            case "57":
            case "58":
            case "59":
            case "60":
            case "63":
            case "85":
            case "86":
            case "88":
            case "89":
            case "90":
            case "93":
            case "96":
                throw new CheckoutCardException(1150, $this->response);
            case "62":
                throw new CheckoutCardException(1178, $this->response);
            case "64":
                throw new CheckoutCardException(1179, $this->response);
            case "65":
                throw new CheckoutCardException(1180, $this->response);
            case "67":
                throw new CheckoutCardException(1181, $this->response);
            case "75":
                throw new CheckoutCardException(1159, $this->response);
            case "92":
                throw new CheckoutCardException(1182, $this->response);
            case "94":
                throw new CheckoutCardException(1183, $this->response);
            case "97":
                throw new CheckoutCardException(1184, $this->response);
            case "AC":
                throw new CheckoutCardException(1185, $this->response);
            case "AE":
            case "DS":
            case "EK":
            case "FC":
            case "FG":
                throw new CheckoutCardException(1151, $this->response);
            case "AH":
                throw new CheckoutCardException(1186, $this->response);
            case "BL":
            case "EB":
                throw new CheckoutCardException(1187, $this->response);
            case "BP":
                throw new CheckoutCardException(1188, $this->response);
            case "CF":
            case "CG":
            case "DA":
            case "DF":
            case "DQ":
            case "KA":
            case "KE":
            case "U3":
                throw new CheckoutCardException(1189, $this->response);
            case "R1":
                throw new CheckoutCardException(1190, $this->response);
            default:
                throw new CheckoutCardException(1150, $this->response);
        }
    }
}