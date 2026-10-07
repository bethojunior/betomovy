<?php


namespace App\Services\Driver;


use App\Constants\Acquirer\Acquirer;
use App\Http\Responses\ApiResponse;
use App\Models\Acquirer\FinancialIntermediary;
use App\Models\User\Driver;
use App\Services\FinancialIntermediary\FinancialIntermediaryService;
use App\Utils\Acquirers\ZsPay\ZsPay;
use App\Utils\FormatValue;
use Exception;
use Illuminate\Http\JsonResponse;

class DriverAccountBankService
{
    private $financialIntermediaryService;

    function __construct(FinancialIntermediaryService $financialIntermediaryService)
    {
        $this->financialIntermediaryService = $financialIntermediaryService;
    }

    public
    function accountBank(Driver $driver)
    {
        try {
            $financialIntermediary = $this->financialIntermediaryService->findByActive();
            if ((bool)$financialIntermediary->acquirerMetaData[2]->value) {
                return $this->accountBankAcquirer($financialIntermediary, $driver);
            }
            throw new Exception('Adquirente não habilitada para split.');
        } catch (Exception $e) {
            return ApiResponse::error($e);
        }
    }


    public
    function createAccountBank(Driver $driver): JsonResponse
    {
        try {
            $financialIntermediary = $this->financialIntermediaryService->findByActive();
            if ((bool)$financialIntermediary->acquirerMetaData[2]->value) {
                return ApiResponse::success($this->createAccountBankAcquirer($financialIntermediary, $driver));
            }
            throw new Exception('Adquirente não habilitada para split.');
        } catch (Exception $e) {
            return ApiResponse::error($e);
        }
    }


    private function accountBankAcquirer(FinancialIntermediary $financialIntermediary, Driver $driver)
    {
        switch ($financialIntermediary->idFinancialIntermediary) {
            case Acquirer::ZSPAY:
            {
                $token = $financialIntermediary->acquirerMetaData[0]->value;
                $zsPay = new ZsPay($token, $this->getEnvironment());
                if (empty($driver->external_account_bank_id)) {
                    $result = $zsPay->getEstablishment()->findById($driver->external_account_bank_id);
                } else {
                    $result = $zsPay->getEstablishment()->findByDocument(FormatValue::formatDocumentClear($driver->document));
                }
                if (!$result->success)
                    throw new Exception($result->error);

                return $result;
            }
            default:
                throw new Exception('checkout-service', 151);
        }
    }


    private function createAccountBankAcquirer(FinancialIntermediary $financialIntermediary, Driver $driver)
    {
        switch ($financialIntermediary->idFinancialIntermediary) {
            case Acquirer::ZSPAY:
            {
                $token = $financialIntermediary->acquirerMetaData[0]->value;
                $establishment = [
                    "tipoEstabelecimentoId" => "1",
                    "identificadorPlano" => "",
                    "nome" => $driver->user->name,
                    "nomeComprovante" => $driver->user->nickname,
                    "email" => $driver->user->email,
                    "telefone" => "",
                    "celular" => FormatValue::formatDocumentClear($driver->user->phone),
                    "dataNascimento" => "",
                    "dataNascimento2" => "",
                    "cpf" => FormatValue::formatDocumentClear($driver->user->document),
                    "categoria" => "48",
                    "quantidade_pos" => "0",
                    "faturamento_estimado" => "10000",
                    "observacao" => "",
                    "endereco" => [
                        "logradouro" => "",
                        "numero" => "",
                        "cidade" => $driver->city->nome ?? '',
                        "estado" => $driver->city->state->sigla ?? '',
                        "cep" => "",
                        "bairro" => "",
                        "complemento" => ""
                    ],
                    "enderecoPOS" => [
                        "logradouro" => "",
                        "numero" => "",
                        "cidade" => "",
                        "estado" => "",
                        "cep" => "",
                        "bairro" => "",
                        "complemento" => ""
                    ],
                    "proprietario" => [
                        "nome" => "",
                        "sobrenome" => "",
                        "email" => "",
                        "celular" => "",
                        "dataNascimento" => "",
                        "cpf" => "",
                        "endereco" => [
                            "logradouro" => "",
                            "numero" => "",
                            "cidade" => "",
                            "estado" => "",
                            "cep" => "",
                            "bairro" => "",
                            "complemento" => ""
                        ]
                    ],
                    "contaBancaria" => [
                        "tipoContaBancaria" => "",
                        "nomeTitular" => "",
                        "bancoId" => "",
                        "agencia" => "",
                        "conta" => ""
                    ],
                    "desativarVendas" => "0",
                    "estabelecimentoId" => "158",
                    "logo" => null,
                    "documentos[]" => null,
                    "documentosAtividade[]" => null,
                    "documentosResidencia[]" => null
                ];

                $zsPay = new ZsPay($token, $this->getEnvironment());
                $result = $zsPay->getEstablishment()->create($establishment);

                if (!$result->success)
                    throw new Exception($result->error);

                $driver->external_account_bank_id = $result->estabelecimento->id;

                $driver->save();

                return true;
            }
            default:
                throw new Exception('checkout-service', 151);
        }
    }


    private
    function getEnvironment(): string
    {
        return (env('APP_ENV') == 'local') ? 'homologation' : 'production';
    }

}
