<?php

namespace App\Console\Commands\FormStep;

use App\Constants\StatusConst;
use App\Models\User\UserType;
use App\Repositories\Config\FormStep\FormStepRepository;
use App\Repositories\Config\FormStep\FormStepUserTypeRepository;
use App\Repositories\User\UserTypeRepository;
use Illuminate\Console\Command;

/**
 * Class FeedFormStepUserTypeCommand
 * Classe criada apenas para atualizações de clientes antigos
 * @package App\Console\Commands\FormStep
 */
class FeedFormStepUserTypeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:form-step';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza tabela de formStep de acordo com a tabela userType';
    /**
     * @var UserTypeRepository
     */
    private $userTypeRepository;
    /**
     * @var FormStepRepository
     */
    private $formStepRepository;
    /**
     * @var FormStepUserTypeRepository
     */
    private $formStepUserTypeRepository;

    /**
     * Create a new command instance.
     *
     * @param UserTypeRepository $userTypeRepository
     * @param FormStepRepository $formStepRepository
     * @param FormStepUserTypeRepository $formStepUserTypeRepository
     */
    public function __construct(UserTypeRepository $userTypeRepository,
                                FormStepRepository $formStepRepository,
                                FormStepUserTypeRepository $formStepUserTypeRepository)
    {
        parent::__construct();
        $this->userTypeRepository = $userTypeRepository;
        $this->formStepRepository = $formStepRepository;
        $this->formStepUserTypeRepository = $formStepUserTypeRepository;
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

        $this->info('Buscando campos default');
        $formSteps = $this->formStepRepository->findAll();


        foreach ($userTypes as $userType) {
            /** @var UserType $userType */
            $this->info('Cadastrando campos para: '. $userType->name);
            foreach ($formSteps as $formStep) {
                if ($formStep->step == 'VALIDATE_NUMBER')
                    continue;

                $this->info('Inserindo: ' . $formStep->step);
                $this->formStepUserTypeRepository
                    ->firstOrCreate([
                        'userTypeId' => $userType->idUserType,
                        'formStepId' => $formStep->id,
                        'statusId' => StatusConst::ACTIVE
                    ], [
                        'userTypeId' => $userType->idUserType,
                        'formStepId' => $formStep->id,
                    ]);
            }
            $this->info('#####################');
        }

        return 1;
    }
}
