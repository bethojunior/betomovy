<?php

namespace App\Http\Controllers\User;

use App\Http\Responses\ApiResponse;
use App\Services\User\UserService;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use App\Repositories\User\UserTypeRepository;
use Throwable;

class UserController extends Controller
{
    private $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function delete($id)
    {
        try {
            $result = $this->service->delete($id);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao deletar usuário");
        }

        return ApiResponse::success($result, "Usuário excluído com sucesso");
    }

    public function setObservation(int $id, Request $request)
    {
        try {
            $result = $this->service->setObservation($id, $request->observation);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao salvar observação");
        }

        return ApiResponse::success($result, 'Observação salva com sucesso');
    }

    public function setAddress(int $id, Request $request)
    {
        try {
            if (!$request->has('zipcode')) throw new Exception("CEP não enviado");
            if (!$request->has('addressNumber')) throw new Exception("Número do endereço não enviado");

            $result = $this->service->setAddress($id, $request->zipcode, $request->addressNumber);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao salvar endereço");
        }

        return ApiResponse::success($result, 'Endereço salvo com sucesso');
    }

    public function setGender(int $id, Request $request)
    {
        try {
            if (!$request->has('gender')) throw new Exception("Gênero não enviado");

            $result = $this->service->setGender($id, $request->gender);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao salvar gênero");
        }

        return ApiResponse::success($result, 'Gênero salvo com sucesso');
    }

    public function setPassword(int $id, Request $request)
    {
        try {
            if (!$request->has('password')) throw new Exception("Nova senha não enviada");

            if (!$request->has('updatePasswordByConfig') && !$request->has('code')) {
                throw new Exception("Código de verificação não enviado");
            }

            $result = $this->service->setPassword($id, $request->password, $request->code);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao salvar senha");
        }

        return ApiResponse::success($result, 'Senha alterada com sucesso');
    }


    public function getByType(int $userTypeId)
    {
        try {
            $users = $this->service->getByType($userTypeId);
        } catch (Exception $e) {
            return ApiResponse::error($e, 'Erro ao obter os motoristas cadastrados');
        }

        return ApiResponse::success($users);
    }

    public function forgetPassword(Request $request)
    {
        try {
            if (!$request->has('email')) throw new Exception('e-mail não enviado');
            $users = $this->service->forgetPassword($request->email);
        } catch (Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($users);
    }

    public function deleteUserCentral($id)
    {
        try {
            $response = $this->service->deleteUserCentral($id);
        } catch (Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($response, 'Usuário da central deletado com sucesso');
    }

    public function changeType($id, Request $request)
    {
        try {
            $response = $this->service->changeType($id, $request);
            return ApiResponse::success($response, 'Tipo do usuário foi alterado com sucesso');

        } catch (Throwable $e) {
            return ApiResponse::error($e, 'Não foi possivel alterar o tipo do usuario');
        }
    }

    public function listAllRemoveAccountRequest()
    {
        try {
            $response = $this->service->listAllRemoveAccountRequest();
            return ApiResponse::success($response);

        } catch (Throwable $e) {
            return ApiResponse::error($e, 'Não foi possivel listar as solicitações de exclusão de dados do usuário');
        }
    }

    public function removeAccountUser($id)
    {
        try {
            $response = $this->service->removeAccountUser($id);
            return ApiResponse::success($response, 'Usuário Excluído com sucesso');

        } catch (Throwable $e) {
            return ApiResponse::error($e, 'Não foi possivel excluir o usuário');
        }
    }

    public function cancelRemoveAccountUser($id)
    {
        try {
            $response = $this->service->cancelRemoveAccountUser($id);
            return ApiResponse::success($response, 'Cancelado Remoção com sucesso');

        } catch (Throwable $e) {
            return ApiResponse::error($e, 'Não foi possivel cancelar a remoção do usuário');
        }
    }

    public function getAllUsers(Request $request)
    {
        try {
            $response = $this->service->getAllUsers($request->query('q'));
            return ApiResponse::success($response);

        } catch (Throwable $e) {
            return ApiResponse::error($e, 'Não foi possivel listar os usuários');
        }
    }

    public function getAllUsersPanel(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $response = $this->service->getAllUsersPanel($request->query('q'));
            return ApiResponse::success($response);

        } catch (Throwable $e) {
            return ApiResponse::error($e, 'Não foi possivel listar os usuários');
        }
    }
}
