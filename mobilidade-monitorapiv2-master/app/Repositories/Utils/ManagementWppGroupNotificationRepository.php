<?php


namespace App\Repositories\Utils;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Utils\ManagementWppGroupNotification;

class ManagementWppGroupNotificationRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ManagementWppGroupNotification::class);
    }

    public function findAll(?string $reference = null)
    {
        $query = $this->getModel()::with(['city', 'tripType']);

        if ($reference !== null) {
            $query->where('reference', $reference);
        }

        return $query->get();
    }

    public function findOrFail(int $id)
    {
        return $this->getModel()::findOrFail($id);
    }
}
