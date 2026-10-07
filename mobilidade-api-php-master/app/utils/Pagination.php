<?php

namespace app\utils;
class Pagination
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

    public function __construct($totalRows = null, $page = null)
    {
        $this->totalRows = $totalRows;

        $this->currentPage = empty($page) ? 1 : $page;
        $this->startRow = ($this->currentPage - 1) * self::LIMIT_REGISTER_PER_PAGE;

        $this->lastPage = ceil($totalRows / self::LIMIT_REGISTER_PER_PAGE);

        $this->previousPage = ($this->currentPage > 1) ? $this->currentPage - 1 : 0;
        $this->nextPage = ($this->currentPage < $this->lastPage) ? $this->currentPage + 1 : 0;

        $this->startRange = (($this->currentPage - self::RANGE_PAGES) >= 1) ? $this->currentPage - self::RANGE_PAGES : 1;
        $this->endRange = (($this->currentPage + self::RANGE_PAGES) <= $this->lastPage) ? $this->currentPage + self::RANGE_PAGES : $this->lastPage;

        $this->showStartButton = ($this->startRange < $this->currentPage) ? true : false;
        $this->showEndButton = ($this->endRange > $this->currentPage) ? true : false;
    }

    public function getLimit()
    {
        return $this->startRow . ", " . self::LIMIT_REGISTER_PER_PAGE;
    }

    public function getPaginationInfo()
    {
        return get_object_vars($this);
    }

    /**
     * @param null $totalRows
     */
    public function setTotalRows($totalRows): void
    {
        $this->totalRows = $totalRows;
    }
}