<?php

namespace app\services;

use app\constant\CustomerPartnerConst;
use app\dao\CustomerPartnerDao;
use app\exceptions\InvalidFieldCustomerPartnerException;
use app\model\ExternalServiceMetaData;
use app\utils\Email;
// use app\utils\MiltoServiceEmailApi;
use app\utils\Pagination;
use app\model\Destination;
use app\model\Driver;
use Exception;
use app\model\Origin;
use app\model\Station;
use app\model\Trip;
use app\model\TripPaymentForm;
use app\model\User;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/10/2018
 * Time: 15:41
 */
class CustomerPartnerService
{
    private $table = "customer";

    /**
     * @param $request
     * @return array
     */
    public function getWhereForGetTrips($request)
    {
        $where = [
            ['c.idCustomer', '=', ':customerId', 'AND'],
            ['t.driverId', 'IS', 'NOT NULL']
        ];
        $bind = [':customerId' => $request->customerId];

        if (isset($request->status)) {
            if (is_string($request->status)) {
                $where[count($where) - 1][] = 'AND';
                $where[] = ['t.status', '=', ':status'];
                $bind[':status'] = $request->status;
            }

            if (is_array($request->status)) {
                $where[count($where) - 1][] = 'AND';
                foreach ($request->status as $key => $status) {
                    $or = end($request->status) == $status ? ')' : 'OR';
                    $start = $request->status[0] == $status ? '(' : '';

                    $where[] = [$start . 't.status', '=', ':status' . $key, $or];
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

    /**
     * @param $totalRows
     * @param $where
     * @param $page
     * @return array
     */
    public function getSqlForGetTrips($totalRows, $where, $page)
    {
        $tripTable = (new Trip)->getTableName();
        $driverTable = (new Driver)->getTableName();
        $userTable = (new User)->getTableName();
        $originTable = (new Origin)->getTableName();
        $stationTable = (new Station)->getTableName();
        $destinationTable = (new Destination)->getTableName();
        $tripPaymentTable = (new TripPaymentForm)->getTableName();

        $pagination = new Pagination($totalRows, $page);

        $whereString = $this->getWhereLikeString($where);

        $sql = "
            SELECT
              ud.name AS driverName,
              ct.name AS customerTripName,
              o.address AS originAddress,
              CASE
                WHEN
                  t.stationId IS NOT NULL THEN s.name
                ELSE dest.address
              END AS destinationAddress,
              DATE_FORMAT(t.date, \"%d de %M de %Y - %H:%i\") AS dateFormatted,
              t.date,
              t.status,
              t.endDate,
              t.price
            FROM {$tripTable} t
              INNER JOIN {$driverTable} d ON t.driverId = d.idDriver
              INNER JOIN {$userTable} u on t.userId = u.idUser
              INNER JOIN {$userTable} ud on d.userId = ud.idUser
              INNER JOIN {$originTable} o on t.originId = o.idOrigin
              INNER JOIN {$stationTable} s on d.stationId = s.idStation
              INNER JOIN {$destinationTable} dest on t.destinationId = dest.idDestination
              INNER JOIN {$this->table} c on u.idUser = c.userId
              INNER JOIN {$tripPaymentTable} tPF on t.tripPaymentFormId = tPF.idTripPaymentForm
              LEFT JOIN {$this->table} ct on t.customerId = ct.idCustomer
            WHERE {$whereString} ORDER BY t.date DESC LIMIT {$pagination->getLimit()}
        ";

        return ['sql' => $sql, 'paginationInfo' => $pagination->getPaginationInfo()];
    }

    /**
     * @param $where
     * @return string
     */
    public function getWhereLikeString($where)
    {
        return implode(" ", array_map(function ($uniqueWhere) {
            return implode(" ", $uniqueWhere);
        }, $where));
    }

    /**
     * @param $request
     * @return string
     * @throws Exception
     */
    public function sendRequestBalance($request)
    {
        $customer = (new CustomerPartnerDao)
            ->findWithUser($request->customerId ?? '');

        if (!$request->value || !$request->paymentForm)
            throw new Exception("Valor ou Forma de pagamento não foi enviado");

        $message = "
            O Parceiro {$customer->idCustomer} - {$customer->name} solicitou <br>
            R$ {$request->value} em Voucher. <br>
            Pagamento em: {$request->paymentForm} <br>
            Email: {$customer->email} <br>
            Telefone: {$customer->phone} <br>
            Data da Solicitação: " . now();

        return Email::sendMail(
            CustomerPartnerConst::EMAIL_TO_SEND_REQUEST_BALANCE,
            'SOLICITAÇÃO DE VOUCHER',
            'SOLICITAÇÃO DE VOUCHER',
            $message
        );
    }

    /**
     * @param $data
     * @return array
     * @throws InvalidFieldCustomerPartnerException
     */
    public function mountEditProfile($data)
    {
        $set = [];
        $bind = [];

        if (!$data->idUser)
            throw new InvalidFieldCustomerPartnerException("ID do usuário não enviado", 'idUser');

        if (isset($data->password))
            $data->password = (new User($data))->getPassword();

        foreach ($data as $key => $value) {
            if ($value) {
                if ($key != 'idUser')
                    $set[$key] = ":$key";

                $bind[":$key"] = $value;
            }
        }

        return ['set' => $set, 'bind' => $bind, 'where' => ['idUser', '=', ':idUser']];
    }
}
