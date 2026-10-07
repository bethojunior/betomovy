<?php


namespace App\Services\ConfigAppPartners;

use App\Repositories\AppPartners\TripTypePartnerLinkedRepository;
use App\Repositories\AppPartners\UserTypeLinkedAppPartnerRepository;
use App\Repositories\ConfigAppPartners\ConfigAppPartnersRepository;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Illuminate\Support\Facades\Storage;

class ConfigAppPartnersService
{
    private $repository;
    private $tripTypePartnerLinkedRepository;
    private $userTypeLinkedAppPartnerRepository;

    public function __construct(
        ConfigAppPartnersRepository $repository,
        TripTypePartnerLinkedRepository $tripTypePartnerLinkedRepository,
        UserTypeLinkedAppPartnerRepository $userTypeLinkedAppPartnerRepository
    ) {
        $this->repository = $repository;
        $this->tripTypePartnerLinkedRepository = $tripTypePartnerLinkedRepository;
        $this->userTypeLinkedAppPartnerRepository = $userTypeLinkedAppPartnerRepository;
    }

    public function insertConfigApp(array $request)
    {
        $isExistsConfig = $this->repository->findByName($request['name_app']);

        if (is_null($isExistsConfig)) {
            $fileName = time() . '-' . $request['logo_app']->getClientOriginalName();

            $logoAppPartner = Storage::disk('s3')->putFileAs('', $request['logo_app'], $fileName);

            if (!$logoAppPartner) {
                throw new \RuntimeException('Ocorreu um erro ao fazer upload da logo');
            }

            $url = env("IMAGE_STORAGE") . $fileName;

            $request['logo_app'] = $url;
            $request['phone_support'] = !empty($request['phone_support']) ? $request['phone_support'] : null;

            return $this->repository->create($request);
        } else {
            throw new ResourceNotFoundException('Já existe uma config com este nome');
        }
    }

    public function updateConfigApp(array $request, $idConfig)
    {
        $responseConfigApp = $this->repository->findConfigAppById($idConfig);

        if (is_null($responseConfigApp)) {
            throw new ResourceNotFoundException('Configuração de app não encontrada');
        } else {
            $url = $responseConfigApp->logo_app;

            if (array_key_exists('logo_app', $request) && !is_null($request['logo_app'])) {
                $lastIndexArrayUrlLogo = array_key_last(explode("/", $responseConfigApp->logo_app));
                $oldLogoName = explode("/", $responseConfigApp->logo_app)[$lastIndexArrayUrlLogo];

                Storage::disk('s3')->delete($oldLogoName);

                $fileName = time() . '-' . $request['logo_app']->getClientOriginalName();
                $logoAppPartner = Storage::disk('s3')->putFileAs('', $request['logo_app'], $fileName);

                if (!$logoAppPartner) {
                    throw new \RuntimeException('Ocorreu um erro ao fazer upload da logo');
                }

                $url = env("IMAGE_STORAGE") . $fileName;
            }


            $responseConfigApp->key = $request['key'];
            $responseConfigApp->name_app = $request['name_app'];
            $responseConfigApp->logo_app = $url;
            $responseConfigApp->primary_color = $request['primary_color'];
            $responseConfigApp->secondary_color = $request['secondary_color'];
            $responseConfigApp->text_color = $request['text_color'];
            $responseConfigApp->phone_support = !empty($request['phone_support']) ? $request['phone_support'] : null;

            $this->repository->save($responseConfigApp);

            return $responseConfigApp;
        }
    }


    public function deleteConfigApp(int $idConfig)
    {
        $responseConfigApp = $this->repository->findConfigAppById($idConfig);

        if (is_null($responseConfigApp)) {
            throw new ResourceNotFoundException('Configuração de app não encontrada');
        } else {
            $this->tripTypePartnerLinkedRepository->removeAllAppPartnersByIdPartner($idConfig);
            $this->userTypeLinkedAppPartnerRepository->removeAllAppPartnersByIdPartner($idConfig);

            $lastIndexArrayUrlLogo = array_key_last(explode("/", $responseConfigApp->logo_app));

            $nameLogo = explode("/", $responseConfigApp->logo_app)[$lastIndexArrayUrlLogo];

            Storage::disk('s3')->delete($nameLogo);

            $this->repository->delete($responseConfigApp);
            return $responseConfigApp;
        }
    }

    public function findAllConfigsAppsPartners()
    {
        return $this->repository->findConfigsAppsWithPagination();
    }

    public function findAllWithoutPagination()
    {
        return $this->repository->findWithoutPagination();
    }
}
