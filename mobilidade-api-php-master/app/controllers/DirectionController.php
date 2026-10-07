<?php

namespace app\controllers;

use Exception;
use app\exceptions\RateLimitException;
use app\utils\DirectionService;
use app\validator\DirectionRateLimitValidator;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/08/2019
 * Time: 15:06
 */
class DirectionController extends ApiController
{
    public function actionSearch()
    {
        try {
            (new DirectionRateLimitValidator())->validate();

            $request = $this->requestQuery();
            echo $this->returnSuccess("Rota encontrada com sucesso",
                (new DirectionService)
                    ->getRoute(
                        $request,
                        isset($request->simpleDirections) && $request->simpleDirections == 1)
            );
        } catch (RateLimitException $e) {
            echo $this->returnError(null, $e->getMessage(), 429);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao calcular rota");
        }
    }
}