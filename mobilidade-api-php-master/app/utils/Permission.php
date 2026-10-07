<?php

namespace app\utils;
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 16/02/2018
 * Time: 11:20
 */
class Permission
{
    /**
     * @param $action
     * @return bool
     */
    public static function checkActionPermission($action)
    {
        $return = false;
        $actions = array(
            "actionAuthenticate",
            "actionGetUserByEmail",
            "actionLogout",
            "actionRegisterUser",
            "actionRegisterDriver",
            "actionValidateTicket",
            "actionListTicketsTwoDays",
            "actionGetCarTaxiNumber",
            "actionGetNotificationsByDriver",
            "actionGetLocationsByTaxiNumber",
            "actionUpdateImageProfile",
            "actionList");
        if (in_array($action, $actions)) {
            $return = true;
        }
        return $return;
    }
}