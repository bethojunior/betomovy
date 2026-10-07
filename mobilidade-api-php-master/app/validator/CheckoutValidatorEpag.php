<?php

namespace app\validator;

use app\constant\EPCheckoutStatusConst;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\validator\contracts\ICheckoutValidator;

class CheckoutValidatorEpag implements ICheckoutValidator
{
    private $response;

    /**
     * @throws CheckoutCardException
     */
    public function validateTransactionResponse($status, $status_detail)
    {
      $this->response['status'] = $status;
      $this->response['status_detail'] = $status_detail;

      switch ($status) {
          case EPCheckoutStatusConst::STATUS_PRE_CAPTURE:
            break;
          case EPCheckoutStatusConst::STATUS_CAPTURE:
            break;
          case EPCheckoutStatusConst::STATUS_REJECTED:
            $this->validateStatusRejected($status_detail);
          default:
              throw new CheckoutCardException(1156, $this->response);
      }
    }

    /**
     * @throws CheckoutCardException
     */
    private function validateStatusRejected($errorCode)
    {
        switch ($errorCode) {
            case 'ECDI0001':
                throw new CheckoutCardException(1150, $this->response);
            case 'ECDI0002':
                throw new CheckoutCardException(1151, $this->response);
            case 'ECDI0003':
                throw new CheckoutCardException(1152, $this->response);
            case 'ECDI0004':
                throw new CheckoutCardException(1153, $this->response);
            case 'ECDI0005':
                throw new CheckoutCardException(1154, $this->response);
            case 'ECDI0006':
                throw new CheckoutCardException(1155, $this->response);
            case 'ECDI0007':
                throw new CheckoutCardException(1156, $this->response);
            case 'ECDI0008':
                throw new CheckoutCardException(1157, $this->response);
            case 'ECDI0009':
                throw new CheckoutCardException(1158, $this->response);
            case 'ECDI0010':
                throw new CheckoutCardException(1159, $this->response);
            case 'ECDI0011':
                throw new CheckoutCardException(1160, $this->response);
            case 'ECDI0012':
                throw new CheckoutCardException(1161, $this->response);
            case 'ECDI0013':
                throw new CheckoutCardException(1162, $this->response);
            case 'ECDI0014':
                throw new CheckoutCardException(1163, $this->response);
            case 'ECDI0015':
                throw new CheckoutCardException(1164, $this->response);
            case 'ECDI0016':
                throw new CheckoutCardException(1165, $this->response);
            case 'ECDI0017':
                throw new CheckoutCardException(1166, $this->response);
            case 'ECDI0018':
                throw new CheckoutCardException(1167, $this->response);
            case 'ECDI0019':
                throw new CheckoutCardException(1168, $this->response);
            case 'ECDI0020':
                throw new CheckoutCardException(1169, $this->response);
            case 'ECDI0021':
                throw new CheckoutCardException(1170, $this->response);
            case 'ECDI0022':
                throw new CheckoutCardException(1171, $this->response);
            case 'ECDI0023':
                throw new CheckoutCardException(1172, $this->response);
            case 'ECDI0024':
            case 'ESRI0006':
                throw new CheckoutCardException(1173, $this->response);
            case 'ECDI0025':
                throw new CheckoutCardException(1174, $this->response);
            case 'ECDI0026':
                throw new CheckoutCardException(1175, $this->response);
            case 'ECDI0027':
                throw new CheckoutCardException(1176, $this->response);
            case 'ECDI0028':
                throw new CheckoutCardException(1177, $this->response);
            case 'ECDI0029':
                throw new CheckoutCardException(1178, $this->response);
            case 'ECDI0030':
                throw new CheckoutCardException(1179, $this->response);
            case 'ECDI0031':
                throw new CheckoutCardException(1180, $this->response);
            case 'ECDI0032':
                throw new CheckoutCardException(1181, $this->response);
            case 'ECDI0033':
                throw new CheckoutCardException(1182, $this->response);
            case 'ECDI0034':
                throw new CheckoutCardException(1183, $this->response);
            case 'ECDI0035':
                throw new CheckoutCardException(1184, $this->response);
            case 'ECDI0036':
                throw new CheckoutCardException(1185, $this->response);
            case 'ECDI0037':
                throw new CheckoutCardException(1186, $this->response);
            case 'ECDI0038':
                throw new CheckoutCardException(1187, $this->response);
            case 'ECDI0039':
                throw new CheckoutCardException(1188, $this->response);
            case 'ECDI0040':
                throw new CheckoutCardException(1189, $this->response);
            case 'ECDI0041':
                throw new CheckoutCardException(1190, $this->response);
            case 'ECDI0042':
                throw new CheckoutCardException(1191, $this->response);
            case 'ECDI0043':
                throw new CheckoutCardException(1192, $this->response);
            case 'ECDI0044':
                throw new CheckoutCardException(1193, $this->response);
            case 'ECDI0045':
                throw new CheckoutCardException(1194, $this->response);
            case 'ECDI0046':
                throw new CheckoutCardException(1195, $this->response);
            case 'ECDI0047':
                throw new CheckoutCardException(1196, $this->response);
            case 'ECDI0048':
                throw new CheckoutCardException(1197, $this->response);
            case 'ECDI0049':
                throw new CheckoutCardException(1191, $this->response);
            case 'ESRI0001':
                throw new CheckoutServiceException(150, $this->response);
            case 'ESRI0002':
                throw new CheckoutServiceException(151, $this->response);
            case 'ESRI0003':
                throw new CheckoutServiceException(153, $this->response);
            case 'ESRI0004':
                throw new CheckoutServiceException(154, $this->response);
            case 'ESRI0005':
                throw new CheckoutServiceException(155, $this->response);
            case 'EPX0001':
                throw new CheckoutServiceException(156, $this->response);
            case 'ECDI0050':
                throw new CheckoutServiceException(1199, $this->response);
            default:
                throw new CheckoutCardException(1191, $this->response);
        }
    }
}
