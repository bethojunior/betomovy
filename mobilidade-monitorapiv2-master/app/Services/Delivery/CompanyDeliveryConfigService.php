<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/05/2020
 * Time: 08:45
 */

namespace App\Services\Delivery;


use App\Models\Company\Company;
use App\Models\Delivery\CompanyDeliveryConfig;
use App\Repositories\Company\CompanyDeliveryConfigRepository;
use App\Utils\MailSender;
use Illuminate\Support\Facades\Log;

class CompanyDeliveryConfigService
{
    /**
     * @var CompanyDeliveryConfigRepository
     */
    private $repository;

    public function __construct(CompanyDeliveryConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @return CompanyDeliveryConfig
     * @throws \Exception
     */
    public function insert(array $request, $oldImage = null)
    {
        $companyDeliveryConfig = new CompanyDeliveryConfig($request);

        if (isset($request['picture'])) {
            $pictureName = \Storage::cloud()
                ->putFile('company/' . $request['companyId'] . '/delivery/logo', $request['picture']);

            $companyDeliveryConfig->picture = $pictureName;
        }
        if($oldImage) {
            $companyDeliveryConfig->picture = $oldImage;
        }

        if ($this->repository->findExistCompany($request['companyId']))
            throw new \Exception("Empresa já possui estabelecimento cadastrado");


        $company = Company::find($request['companyId']);
        $company->establishmentCollectionManagementId = $request['establishmentCollectionManagementId'] ?? $company->establishmentCollectionManagementId;
        $company->save();

        // @TODO - Enviar email usando a conta configurada na tabela stmpServer
        try {
            $sendMail = new MailSender();
            $sendMail->sendMail($company['email'], $company['name']);
        } catch (\Throwable $error) {}

        $companyDeliveryConfig->save();

        return $companyDeliveryConfig;
    }

    public function findByCompany(int $companyId)
    {
        return $this->repository
            ->findByCompany($companyId);
    }

    /**
     * @param int $companyId
     * @param array $request
     * @return CompanyDeliveryConfig
     * @throws \Exception
     */
    public function update(int $companyId, array $request)
    {
        /** @var CompanyDeliveryConfig|null $companyDeliveryConfig */
        $companyDeliveryConfig = $this->findByCompany($companyId);

        $oldImage = null;
        if(isset($companyDeliveryConfig['picture']) && !isset($request['picture'])) {
            $oldImage = $companyDeliveryConfig['picture'];
            
            $posicaoInicioCaminho = strpos($oldImage, '/', 8);

            if ($posicaoInicioCaminho !== false) {
                $caminhoRelativo = substr($oldImage, $posicaoInicioCaminho + 1);
                $oldImage = $caminhoRelativo;
            }
        }

        if ($companyDeliveryConfig) {
            $companyDeliveryConfig->delete();
        }

        return $this->insert($request, $oldImage);
    }

    public function findWithCompanies($cityId)
    {
        return $this->repository
            ->findWithCompany($cityId);
    }
}
