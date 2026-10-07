<?php


namespace App\Repositories\AppPartners;

use App\Contracts\Repository\AbstractRepository;
use App\Models\AppPartners\TripTypePartnerLinked;

class TripTypePartnerLinkedRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(TripTypePartnerLinked::class);
    }

    public function findTripTypeById(int $partnerId, int $tripTypeId)
    {
        $response = $this->getModel()::where('config_apps_partners_id', $partnerId)
            ->where('tripTypePartnerId', $tripTypeId)
            ->first();

        if ($response) {
            return $response;
        }
        return null;
    }

    public function getAppPartnersByTripTypeId(int $tripTypeId)
    {
        $response = $this->getModel()::where('tripTypePartnerId', $tripTypeId)->get(['config_apps_partners_id']);

        if ($response) {
            return $response;
        }
        return null;
    }

    public function deleteByTripTypeId(int $tripTypeId)
    {
        return $this->getModel()::where('tripTypePartnerId', $tripTypeId)->delete();
    }

    public function getAppsPartnersByTripTypeId(int $tripTypeId) 
    {
        return $this->getModel()::where('tripTypePartnerId', $tripTypeId)
            ->with('configAppPartners')
            ->get();
    }

    public function removeAppsPartnersByTripTypeId(int $tripTypeId, array $appsPartnersIds)
    {
        return $this->getModel()::where('tripTypePartnerId', $tripTypeId)
            ->whereIn('config_apps_partners_id', $appsPartnersIds)
            ->delete();
    }

    public function removeAllAppPartnersByIdPartner($idAppPartner)
    {
        $query = $this->getModel()::where('config_apps_partners_id', $idAppPartner);
        return $query->exists() ? $query->delete() : 0;
    }
}
