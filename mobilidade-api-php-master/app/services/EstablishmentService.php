<?php

namespace app\services;

use app\dao\EstablishmentDao;
use app\dao\UserDao;
use app\model\ExternalServiceMetaData;
use app\utils\Email;
// use app\utils\MiltoServiceEmailApi;
use app\utils\Pagination;
use app\model\Balance;
use app\model\City;
use app\model\Customer;
use app\model\Destination;
use app\model\Driver;
use app\model\Establishment;
use app\model\Estate;
use Exception;
use app\model\Station;
use app\model\Trip;
use app\model\User;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 11/09/2018
 * Time: 17:51
 */
class EstablishmentService
{
    const EMAIL_TO_SEND_REQUEST_BALANCE = "financeiro@eassessotaxi.com.br";

    /**
     * @param $request
     * @return array
     */
    public function getWhereForGetTrips($request)
    {
        $tripTable = (new Trip)->getTableName();

        $where = [['establishmentId', '=', ':establishmentId']];
        $bind = [':establishmentId' => $request->establishmentId];

        if (isset($request->status)) {
            if (is_string($request->status)) {
                $where[count($where) - 1][] = 'AND';
                $where[] = [$tripTable . '.status', '=', ':status'];
                $bind[':status'] = $request->status;
            }

            if (is_array($request->status)) {
                $where[count($where) - 1][] = 'AND';
                foreach ($request->status as $key => $status) {
                    $or = end($request->status) == $status ? ')' : 'OR';
                    $start = $request->status[0] == $status ? '(' : '';

                    $where[] = [$start . $tripTable . '.status', '=', ':status' . $key, $or];
                    $bind[':status' . $key] = $status;
                }
            }
        }

        if (isset($request->date)) {
            $where[count($where) - 1][] = 'AND';
            $where[] = ['DATE_FORMAT(date, \'%Y-%m-%d\')', '<=', ':start_day', 'AND'];
            $where[] = ['DATE_FORMAT(date, \'%Y-%m-%d\')', '>=', ':end_day'];
            $bind[':start_day'] = today();
            $bind[':end_day'] = subDays(today(), $request->date);
        }

        return ['where' => $where, 'bind' => $bind];
    }

    public function getSqlForGetTrips($totalRows, $where, $page)
    {
        $tripTable = (new Trip)->getTableName();
        $establishmentTable = (new Establishment)->getTableName();
        $stationTable = (new Station)->getTableName();
        $destinationTable = (new Destination)->getTableName();
        $estateTable = (new Estate)->getTableName();
        $cityTable = (new City)->getTableName();
        $driverTable = (new Driver)->getTableName();
        $userTable = (new User)->getTableName();
        $customerTable = (new Customer)->getTableName();

        $pagination = new Pagination($totalRows, $page);

        $whereString = $this->getWhereLikeString($where);

        $sql = "
            SELECT
                {$userTable}.name AS driverName,
                {$customerTable}.name AS customerName,
                {$establishmentTable}.fantasyName AS establishmentName,
                CONCAT(
                    {$establishmentTable}.address, ' - ',
                    {$establishmentTable}.neighborhood, ', ',
                    {$cityTable}.nome, ' - ', {$estateTable}.sigla,
                    ' ', {$establishmentTable}.zipcode
                ) AS originAddress,
                CASE
                  WHEN 
                    {$tripTable}.stationId IS NOT NULL THEN s.name
                  ELSE dest.address
                END AS destinyAddress,
                {$tripTable}.status,
                DATE_FORMAT({$tripTable}.date, \"%d de %M de %Y - %H:%i\") AS dateFormatted,
                {$tripTable}.date,
                {$tripTable}.endDate,
                {$tripTable}.price,
                {$tripTable}.establishmentId,
                {$tripTable}.customerId,
                {$tripTable}.stationId,
                {$tripTable}.destinationId
            FROM {$tripTable}
                INNER JOIN {$driverTable} ON {$driverTable}.idDriver = {$tripTable}.driverId
                INNER JOIN {$userTable} ON {$userTable}.idUser = driver.userId
                INNER JOIN {$customerTable} ON {$customerTable}.idCustomer = {$tripTable}.customerId
                INNER JOIN {$establishmentTable} ON {$establishmentTable}.idEstablishment = {$tripTable}.establishmentId
                INNER JOIN {$cityTable} ON {$cityTable}.id = {$establishmentTable}.cityId
                INNER JOIN {$estateTable} ON {$estateTable}.id = {$establishmentTable}.estateId
                LEFT JOIN {$stationTable} s ON s.idStation = {$tripTable}.stationId
                LEFT JOIN {$destinationTable} dest ON dest.idDestination = {$tripTable}.destinationId
            WHERE {$whereString} ORDER BY date DESC LIMIT {$pagination->getLimit()};
        ";

        return ['sql' => $sql, 'paginationInfo' => $pagination->getPaginationInfo()];
    }

    private function getWhereLikeString($where)
    {
        return implode(" ", array_map(function ($uniqueWhere) {
            return implode(" ", $uniqueWhere);
        }, $where));
    }

    /**
     * Returns a array with one key called 'sql' and another called 'bind'
     * @param $idEstablishment
     * @param $idUser
     * @return array
     */
    public function getSqlForFindWithUser($idEstablishment, $idUser)
    {
        $balanceTable = (new Balance)->getTableName();
        $establishmentTable = (new Establishment)->getTableName();
        $userTable = (new User)->getTableName();

        $sql = "
            SELECT
              e.idEstablishment,
              e.balanceId,
              e.fantasyName,
              e.latitude,
              e.longitude,
              ba.tripBalance,
              ba.pendingBalanceWithdraw,
              ba.blockedBalance,
              u.idUser,
              u.name AS nameUser,
              u.email
            FROM {$establishmentTable} e
              INNER JOIN {$balanceTable} ba ON e.balanceId = ba.idBalance
              INNER JOIN {$userTable} u ON u.idUser = :idUser
              WHERE e.idEstablishment = :idEstablishment
        ";

        $bind[':idEstablishment'] = $idEstablishment;
        $bind[':idUser'] = $idUser;

        return ['sql' => $sql, 'bind' => $bind];
    }

    /**
     * @param $request
     * @return string
     * @throws Exception
     */
    public function sendRequestBalance($request)
    {
        $establishment = (new EstablishmentDao)
            ->find($request->establishmentId);

        $user = (new UserDao)
            ->find($request->idUser);

        $message = "
            O Estabelecimento {$establishment->idEstablishment} - {$establishment->fantasyName} solicitou <br>
            R$ {$request->value} em Voucher. <br>
            Pagamento em: {$request->paymentForm} <br>
            Solicitado por: {$user->idUser} - {$user->name}. Email: {$user->email} <br>
            Data da Solicitação: " . now();

        return Email::sendMail(
            self::EMAIL_TO_SEND_REQUEST_BALANCE,
            'SOLICITAÇÃO DE VOUCHER',
            'SOLICITAÇÃO DE VOUCHER',
            $message
        );
    }
}