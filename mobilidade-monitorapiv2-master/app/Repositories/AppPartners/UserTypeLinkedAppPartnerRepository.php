<?php


namespace App\Repositories\AppPartners;

use App\Contracts\Repository\AbstractRepository;
use App\Models\AppPartners\UserTypeLinkedAppPartner;

class UserTypeLinkedAppPartnerRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(UserTypeLinkedAppPartner::class);
    }

    public function findUserTypeById(int $partnerId, int $userTypeId)
    {
        $response = $this->getModel()::where('config_apps_partners_id', $partnerId)
            ->where('userTypeId', $userTypeId)
            ->first();

        if ($response) {
            return $response;
        }
        return null;
    }


    public function getAppPartnersByUserTypeId(int $userTypeId)
    {
        $response = $this->getModel()::where('userTypeId', $userTypeId)->get(['config_apps_partners_id']);

        if ($response) {
            return $response;
        }
        return null;
    }

    public function deleteByUserTypeId(int $userTypeId)
    {
        return $this->getModel()::where('userTypeId', $userTypeId)->delete();
    }

    public function getUserByUserTypeId(int $userTypeId)
    {
        return $this->getModel()::where('userTypeId', $userTypeId)
            ->with('configAppPartners')
            ->get();
    }

    public function removeAppsPartnersByUserTypeId(int $userTypeId, array $appsPartners)
    {
        return $this->getModel()::where('userTypeId', $userTypeId)
            ->whereIn('config_apps_partners_id', $appsPartners)
            ->delete();
    }

    public function removeAllAppPartnersByIdPartner($idAppPartner)
    {
        $query = $this->getModel()::where('config_apps_partners_id', $idAppPartner);
        return $query->exists() ? $query->delete() : 0;
    }
}
