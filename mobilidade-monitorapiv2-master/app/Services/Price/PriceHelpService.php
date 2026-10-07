<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/09/2019
 * Time: 10:16
 */

namespace App\Services\Price;


use App\Constants\StatusConst;
use App\Models\Price\PriceHelp;
use App\Repositories\Price\PriceHelpRepository;

class PriceHelpService
{
    /**
     * @var PriceHelpRepository
     */
    private $repository;

    public function __construct(PriceHelpRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [])
    {
        return $this->repository
            ->findAll($request);
    }

    public function insert($request)
    {
        $priceHelp = new PriceHelp;
        $priceHelp->value = $request['value'];
        $priceHelp->cityId = $request['cityId'];
        $priceHelp->accessibilityHelpId = $request['accessibilityHelpId'];
        $priceHelp->quantityIcon = $request['quantityIcon'];

        $this->repository
            ->save($priceHelp);

        return $priceHelp;
    }

    public function delete($id)
    {
        $priceHelp = $this->repository
            ->find($id);

        if (!$priceHelp)
            return null;

        $priceHelp->statusId = StatusConst::REMOVED;

        $this->repository->save($priceHelp);

        return true;
    }
}
