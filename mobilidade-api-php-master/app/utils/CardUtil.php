<?php


namespace app\utils;
class CardUtil
{
    public static function getFlag($numberBard)
    {
        $numberBard = preg_replace("/[^0-9]/", "", $numberBard);

        switch ($numberBard) {
            case (bool)preg_match('/^(5067|4576|4011)/', $numberBard):
            case (bool)preg_match('/^(636368|438935|504175|451416|636297)/', $numberBard) :
                return 'Elo';

            case (bool)preg_match('/^(3841)/', $numberBard):
            case (bool)preg_match('/^(60)/', $numberBard):
            case (bool)preg_match('/^(606282)/', $numberBard) :
                return 'Hipercard';

            case (bool)preg_match('/^(34|37)/', $numberBard) :
                return 'Amex';

            case (bool)preg_match('/^(4)/', $numberBard) :
                return 'Visa';

            case (bool)preg_match('/^(5)/', $numberBard) :
                return 'Mastercard';
            default:
                return null;
        }
    }
}