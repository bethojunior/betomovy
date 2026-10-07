<?php


namespace app\services;
use app\dao\TermsUsePolicyDao;

class TermsUsePolicyService
{
    private $dao;

    /**
     * TermsUsePolicyService constructor.
     */
    public function __construct()
    {
        $this->dao = new TermsUsePolicyDao;
    }

    public function findByType($type)
    {
        return $this->dao->sqlSelect(
            ['id', 'type', 'description'],
            [
                ['type', '=', ':type']
            ])
            ->bind([':type' => $type])
            ->get(false);
    }
}