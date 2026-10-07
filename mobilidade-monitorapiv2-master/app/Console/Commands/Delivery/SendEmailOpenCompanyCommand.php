<?php

namespace App\Console\Commands\Delivery;

use App\Repositories\Company\CompanyDeliveryConfigRepository;
use App\Repositories\Company\CompanyRepository;
use App\Repositories\Config\SMTPServerRepository;
use App\Repositories\Delivery\CompanyOpenHourRepository;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendEmailOpenCompanyCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = "auto:send-email-open-company";

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Dispara e-mail para lembrar da abertura do estabelecimento de Delivery.";

    private $companyOpenHourRepository;
    private $companyRepository;
    private $smtpServerRepository;
    private $companyDeliveryConfigRepository;
    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(CompanyOpenHourRepository $companyOpenHourRepository,
                                CompanyRepository $companyRepository,
                                SMTPServerRepository $smtpServerRepository,
                                CompanyDeliveryConfigRepository $companyDeliveryConfigRepository)
    {
        parent::__construct();
        $this->companyOpenHourRepository = $companyOpenHourRepository;
        $this->companyRepository = $companyRepository;
        $this->smtpServerRepository = $smtpServerRepository;
        $this->companyDeliveryConfigRepository = $companyDeliveryConfigRepository;
    }

    /**
     * @return void
     */
    public function handle()
    {
        $companies = $this->companyRepository->getAllActives();

        foreach ($companies as $key => $company) {
            $companyDeliveryConfig = $this->companyDeliveryConfigRepository->findByCompany($company->id);
            if ($companyDeliveryConfig->enableNotificationEmailDelivery == 0) {
                unset($companies[$key]);
            }
        }

        foreach ($companies as $company) {
            $openHour = $this->companyOpenHourRepository->listAllHourOpenDailyByCompany($company->id);
            $openHourStart = Carbon::createFromFormat('H:i', $openHour);
            $openHourStart->subMinutes(5);
            $openHourStart = $openHourStart->format('H:i');
            $companyOpenHour = $this->companyOpenHourRepository->findByCompany(2);
            $now = Carbon::now()->format('H:i');
            if ($openHourStart == $now) {
                $this->setSMTPConfig();
                Mail::send('mail.delivery.openCompany', [
                    'title' => $companyOpenHour[0]->company->fantasyName,
                    'content' => $openHour
                ], function ($message) use ($companyOpenHour) {
                    $message->to($companyOpenHour[0]->company->email, $companyOpenHour[0]->company->name)
                        ->subject('Atenção - Abertura do Estabelecimento')
                        ->from('nao-reponder@email.com', $companyOpenHour[0]->company->name);
                });

                sleep(1);
            }
        }
    }

    private function setSMTPConfig()
    {
        $smtpServer = $this->smtpServerRepository->findAllActive();
        $config = [
            'driver'     => $smtpServer[0]->mailer ?? env('MAIL_DRIVER'),
            'host'       => $smtpServer[0]->host ?? env('MAIL_HOST'),
            'port'       => $smtpServer[0]->port ?? env('MAIL_PORT'),
            'from'       => [
                'address' => $smtpServer[0]->fromMailer ?? env('MAIL_FROM_ADDRESS'),
                'name'    => $smtpServer[0]->fromName ?? env('MAIL_FROM_NAME')
            ],
            'encryption' => $smtpServer[0]->encryption ?? env('MAIL_ENCRYPTION'),
            'username'   => $smtpServer[0]->username ?? env('MAIL_USERNAME'),
            'password'   => $smtpServer[0]->password ?? env('MAIL_PASSWORD'),
            'sendmail'   => '/usr/sbin/sendmail -bs',
        ];

        config(['mail' => $config]);
    }

}
