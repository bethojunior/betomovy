<?php


namespace Delivery\Services\PaymentForm;


use Carbon\Carbon;
use Delivery\Models\PaymentForm\Card;

class CardService
{
    public function decode(Card $card)
    {
        if (!$card->userId)
            throw new \Exception();

        $keyToDecode = $this->stringTo32((string)$card->userId);

        $cardDecript = (object)[];
        $cardDecript->idCard = $card->idCard;
        $cardDecript->number = $card->number;
        $cardDecript->expirationMonth = $card->expirationMonth;
        $cardDecript->expirationYear = $card->expirationYear;
        $cardDecript->cardholderName = $card->cardholderName;
        $cardDecript->holderDocument = $card->holderDocument;
        $cardDecript->cardFlagId = $card->cardFlagId;
        $cardDecript->cvv = $card->cvv;
        $cardDecript->userId = $card->userId;
        $cardDecript->statusId = $card->statusId;
        $cardDecript->created_at = Carbon::parse($card->created_at)->format('Y-m-d H:i:s');

        $values = array_filter(get_object_vars($cardDecript));
        $this->ignoreEncryption($values);

        foreach ($values as $key => $value) {
            $cardDecript->$key = $this->safeDecrypt($value, $keyToDecode);
        }

        return $cardDecript;
    }

    function stringTo32($string)
    {
        while (strlen($string) < SODIUM_CRYPTO_SECRETBOX_KEYBYTES) {
            $string .= $string;
        }

        if (strlen($string) > SODIUM_CRYPTO_SECRETBOX_KEYBYTES)
            return substr($string, 0, SODIUM_CRYPTO_SECRETBOX_KEYBYTES);

        return $string;
    }

    private function ignoreEncryption(array &$fields)
    {
        unset($fields['userId']);
        unset($fields['mpCardInfoId']);
        unset($fields['alias']);
        unset($fields['idCard']);
        unset($fields['created_at']);
        unset($fields['cardFlagId']);
        unset($fields['cardTypeId']);
        unset($fields['statusId']);
    }

    function safeDecrypt($encrypted, $key)
    {
        $decoded = base64_decode($encrypted);
        if ($decoded === false) {
            throw new \Exception('Scream bloody murder, the encoding failed');
        }
        if (mb_strlen($decoded, '8bit') < (SODIUM_CRYPTO_SECRETBOX_NONCEBYTES + SODIUM_CRYPTO_SECRETBOX_MACBYTES)) {
            throw new \Exception('Scream bloody murder, the message was truncated');
        }
        $nonce = mb_substr($decoded, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, '8bit');
        $ciphertext = mb_substr($decoded, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, null, '8bit');

        $plain = sodium_crypto_secretbox_open(
            $ciphertext,
            $nonce,
            $key
        );
        if ($plain === false) {
            throw new \Exception('the message was tampered with in transit');
        }
        sodium_memzero($ciphertext);
        sodium_memzero($key);
        return $plain;
    }
}
