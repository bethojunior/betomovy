<?php

namespace app\utils;

use PDO;
use PDOStatement;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/05/2019
 * Time: 08:59
 */
class PDOPagination
{
    const LIMIT_REGISTER_PER_PAGE = 10;
    const RANGE_PAGES = 1;

    private $startRow;
    private $currentPage;
    private $lastPage;
    private $totalRows;
    private $previousPage;
    private $nextPage;
    private $startRange;
    private $endRange;
    private $showStartButton;
    private $showEndButton;

    private $conn;
    /**
     * @var string $sql
     */
    private $sql;
    /**
     * @var array $bind
     */
    private $bind;

    public function __construct(string $sql, array $bind = [])
    {
        $this->conn = Connection::open();
        $this->sql = $sql;
        $this->bind = $bind;
    }

    /**
     * @param null $page
     * @param null $limit
     * @return array
     */
    public function paginate($page = null, $limit = null)
    {
        $limitPerPage = $limit ?? self::LIMIT_REGISTER_PER_PAGE;

        $this->totalRows = $this->countTotalRows();

        $this->currentPage = empty($page) ? 1 : $page;
        $this->startRow = ($this->currentPage - 1) * $limitPerPage;

        $this->lastPage = ceil($this->totalRows / $limitPerPage);

        $this->previousPage = ($this->currentPage > 1) ? $this->currentPage - 1 : 0;
        $this->nextPage = ($this->currentPage < $this->lastPage) ? $this->currentPage + 1 : 0;

        $this->startRange = (($this->currentPage - self::RANGE_PAGES) >= 1) ? $this->currentPage - self::RANGE_PAGES : 1;
        $this->endRange = (($this->currentPage + self::RANGE_PAGES) <= $this->lastPage) ? $this->currentPage + self::RANGE_PAGES : $this->lastPage;

        $this->showStartButton = ($this->startRange < $this->currentPage) ? true : false;
        $this->showEndButton = ($this->endRange > $this->currentPage) ? true : false;

        return $this->getPaginationInfo($limit);
    }

    /**
     * @param null $limit
     * @return array
     */
    public function getPaginationInfo($limit = null)
    {
        $response = get_object_vars($this);

        unset($response['query']);
        unset($response['pagination']);
        unset($response['conn']);
        unset($response['sql']);
        unset($response['bind']);

        $response['data'] = $this->getItems($limit);

        return $response;
    }

    /**
     * @return int
     */
    private function countTotalRows()
    {
        $cleanSql = $this->getCleanSql();

        $fromStatement = strstr($cleanSql, "FROM");
        $hasGroupBy = strstr($fromStatement, 'GROUP', true);

        if ($hasGroupBy)
            $fromStatement = $hasGroupBy;

        $countStatement = 'SELECT COUNT(*) AS totalRows ' . $fromStatement;

        /** @var PDOStatement $stmtCount */
        $stmtCount = $this->conn->prepare($countStatement);

        $this->bindParams($stmtCount);

        $stmtCount->execute();

        return (int)$stmtCount->fetchObject()->totalRows;
    }

    /**
     * @param null $limit
     * @return array
     */
    private function getItems($limit = null)
    {
        $sql = $this->getCleanSql();

        $limit = " LIMIT " . $this->startRow . ", " . ($limit ?? self::LIMIT_REGISTER_PER_PAGE);

        /** @var PDOStatement $stmt */
        $stmt = $this->conn->prepare($sql . $limit);

        $this->bindParams($stmt);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * @return string
     */
    private function getCleanSql()
    {
        return trim(str_replace("\r\n", "", $this->sql));
    }

    /**
     * @param $stmt
     */
    private function bindParams(PDOStatement &$stmt)
    {
        foreach ($this->bind as $key => $value) {
            $stmt->bindValue($key, $value);
        }
    }
}