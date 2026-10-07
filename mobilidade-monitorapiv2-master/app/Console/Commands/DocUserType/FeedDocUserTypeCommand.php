<?php

namespace App\Console\Commands\DocUserType;

use App\Constants\StatusConst;
use App\Models\User\UserType;
use App\Repositories\User\Doc\DocUserTypeRepository;
use App\Repositories\User\RequiredFieldRepository;
use App\Repositories\User\UserTypeRepository;
use Illuminate\Console\Command;
use Illuminate\Foundation\Auth\User;

class FeedDocUserTypeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:doc-usertype';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza a tabela docUserType de acordo com a requiredField';
    /**
     * @var UserTypeRepository
     */
    private $userTypeRepository;
    /**
     * @var DocUserTypeRepository
     */
    private $docUserTypeRepository;
    /**
     * @var RequiredFieldRepository
     */
    private $requiredFieldRepository;

    /**
     * Create a new command instance.
     *
     * @param UserTypeRepository $userTypeRepository
     * @param DocUserTypeRepository $docUserTypeRepository
     * @param RequiredFieldRepository $requiredFieldRepository
     */
    public function __construct(UserTypeRepository $userTypeRepository,
                                DocUserTypeRepository $docUserTypeRepository,
                                RequiredFieldRepository $requiredFieldRepository)
    {
        parent::__construct();
        $this->userTypeRepository = $userTypeRepository;
        $this->docUserTypeRepository = $docUserTypeRepository;
        $this->requiredFieldRepository = $requiredFieldRepository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('Buscando tipos de usuários');
        $userTypes = $this->userTypeRepository->findDriversType();

        foreach ($userTypes as $userType) {
            /** @var UserType $userType */
            $this->info('Cadastrando campos para: '. $userType->name);

            $this->info('Buscando requiredFields');
            $requiredFields = $this->requiredFieldRepository
                ->findByUserType($userType->idUserType);

            foreach ($requiredFields as $requiredField) {
                if (!in_array($requiredField->field,
                    ['DOCUMENT_CNH', 'DOCUMENT_CRLV', 'DOCUMENT_ALVARA', 'DOCUMENT_CRIMINAL_RECORD', 'PROOF_OF_RESIDENCE']))
                    continue;

                if (!$requiredField->compelField)
                    continue;

                $this->info('Inserindo: ' . $requiredField->field);

                $docId = $this->getDocIdByField($requiredField->field);

                if (!$docId)
                    continue;

                $this->docUserTypeRepository
                    ->firstOrCreate([
                        'userTypeId' => $userType->idUserType,
                        'docId' => $docId,
                        'statusId' => StatusConst::ACTIVE
                    ], [
                        'userTypeId' => $userType->idUserType,
                        'docId' => $docId,
                    ]);
            }
            $this->info('#####################');
        }

        return 1;
    }

    /**
     * @param $field
     * @return int|null
     */
    private function getDocIdByField($field): ?int
    {
        switch ($field) {
            case 'DOCUMENT_CNH':
                return 1;
            case 'DOCUMENT_CRLV':
                return 2;
            case 'DOCUMENT_ALVARA':
                return 3;
            case 'DOCUMENT_CRIMINAL_RECORD':
                return 4;
            case 'PROOF_OF_RESIDENCE':
                return 5;
            default:
                return null;
        }
    }
}
