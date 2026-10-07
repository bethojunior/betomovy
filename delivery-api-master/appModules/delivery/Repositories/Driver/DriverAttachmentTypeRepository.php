<?php


namespace Delivery\Repositories\Driver;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Driver\DriverAttachmentType;

class DriverAttachmentTypeRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DriverAttachmentType::class);
    }

    public function findAll()
    {
        return $this->getModel()::where('active', true)->get();
    }
}
