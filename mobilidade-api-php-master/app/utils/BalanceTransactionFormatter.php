<?php

namespace app\utils;

use DateTime;
use Exception;

/**
 * Utilitário para formatação de transações financeiras
 * Remove formatações do MySQL e centraliza no PHP
 * 
 * Created by PhpStorm.
 * User: System
 * Date: 2025-11-20
 */
class BalanceTransactionFormatter
{
    /**
     * Formata uma lista de transações para o extrato filtrado
     * Saída usa - para débitos e + para créditos
     * 
     * @param array $transactions
     * @return array
     */
    public static function formatTransactions(array $transactions): array
    {
        return array_map(function ($transaction) {
            return self::formatSingleTransaction($transaction, true);
        }, $transactions);
    }

    /**
     * Formata uma lista de transações para últimas transações
     * Saída: débitos sem sinal, créditos com +
     * 
     * @param array $transactions
     * @return array
     */
    public static function formatLastTransactions(array $transactions): array
    {
        return array_map(function ($transaction) {
            return self::formatSingleTransaction($transaction, false);
        }, $transactions);
    }

    /**
     * Formata uma única transação
     * 
     * @param object $transaction
     * @param bool $includeNegativeSign - Se true, adiciona sinal negativo para saídas
     * @return object
     */
    private static function formatSingleTransaction($transaction, bool $includeNegativeSign = true): object
    {
        // Formata o valor
        $value = floatval($transaction->value ?? 0);
        
        if ($transaction->flow === 'saida') {
            $transaction->value = $includeNegativeSign ? '-' . $value : (string)$value;
        } else {
            $transaction->value = '+' . $value;
        }

        // Formata a data
        if (isset($transaction->date) && !empty($transaction->date)) {
            $transaction->date = self::formatTransactionDate($transaction->date);
        }

        return $transaction;
    }

    /**
     * Formata a data da transação para o formato brasileiro
     * 
     * @param string $date
     * @return string
     */
    public static function formatTransactionDate(string $date): string
    {
        try {
            $dateTime = new DateTime($date);
            return $dateTime->format('d/m/Y - H:i') . 'h';
        } catch (Exception $e) {
            return $date;
        }
    }

    /**
     * Formata o período do driverInfo
     *
     * @param object $driverInfo
     * @param object $date_interval
     * @return object
     */
    public static function formatDriverInfoPeriod($driverInfo, $date_interval): object
    {
        if (!isset($date_interval->date_start) || !isset($date_interval->date_end)) {
            $driverInfo->period = '';
            return $driverInfo;
        }

        try {
            $dateStart = new DateTime($date_interval->date_start);
            $dateEnd = new DateTime($date_interval->date_end);
            $driverInfo->period = $dateStart->format('d/m/Y') . ' até ' . $dateEnd->format('d/m/Y');
        } catch (Exception $e) {
            $driverInfo->period = '';
        }

        return $driverInfo;
    }
}

