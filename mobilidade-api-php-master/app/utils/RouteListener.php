<?php

namespace app\utils;

use app\controllers\ApiController;
use app\listener\RequestListener;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 16/07/2018
 * Time: 08:01
 */
class RouteListener extends ApiController
{
    private $class;
    private $action;
    private $listener;

    public function __construct()
    {
        $this->listener = new RequestListener;
    }

    /**
     * @param $url
     * @throws Exception
     */
    public function get($url)
    {
        if ($this->isBlockedRoute($this->getCleanUrl($url)))
            $this->listener->headersListener(getallheaders());

        $url = str_replace('//', '/', $url);

        $path = explode('/', $this->getCleanUrl($url));

        array_splice($path, 0, 1);

        $this->class = $this->getController($path);

        if (!$this->class)
            throw new Exception("Rota não existe: " . implode("/", $path));

        $this->action = $this->getAction($this->class, $path);

        if (!$this->action)
            throw new Exception("Action não existe: " . implode("/", $path));

        call_user_func(array($this->class, $this->action));
    }

    private function isBlockedRoute($url)
    {
        $routes = require '../configs/route/route.php';
        $lowerUrl = strtolower($url);

        if (in_array($lowerUrl, $routes['unlockRoutes'])) {
            return false;
        }

        foreach ($routes['unlockRoutes'] as $unlock) {
            $trimmed = rtrim($unlock, '/');
            if ($trimmed !== '' && strpos($lowerUrl, $trimmed . '/') === 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Valida a controller
     * @param $path
     * @param int $index
     * @return ?ApiController
     */
    private function getController($path, int $index = 0): ?ApiController
    {
        if (!isset($path[$index])) {
            return null;
        }

        $classNameController = $path[$index] . 'Controller';

        $classArray = array_filter(scandir("../app/controllers"), function ($classFile) use ($classNameController) {
            return strtolower($classFile) === strtolower($classNameController) . '.php';
        });

        if (empty($classArray)) {
            return null;
        }

        $classFound = str_replace('.php', '', end($classArray));

        $classController = "app\\controllers\\" . $classFound;

        return new $classController;
    }

    /**
     * valida a action
     * @param $class
     * @param $path
     * @return bool|string
     */
    private function getAction($class, $path)
    {
        $action = 'actionIndex';

        if (isset($path[1], $path[2], $path[3]) && !empty($path[3])) {
            $composite3 = "action" . ucfirst($path[2]) . ucfirst($path[3]);
            if (method_exists($class, $composite3)) {
                $_GET['id'] = $path[1];
                return $composite3;
            }
        }

        if (isset($path[1], $path[2]) && !empty($path[2])) {
            $compositeAction = "action" . ucfirst($path[1]) . ucfirst($path[2]);
            if (method_exists($class, $compositeAction)) {
                return $compositeAction;
            }

            $subAction = "action" . ucfirst($path[2]);
            if (method_exists($class, $subAction)) {
                $_GET['id'] = $path[1];
                $_GET['groupCode'] = $path[1];
                return $subAction;
            }

            if (is_numeric($path[2])) {
                $_GET['id'] = $path[2];
                $subAction = "action" . ucfirst($path[1]);
                if (method_exists($class, $subAction)) {
                    return $subAction;
                }
            }

            // Suporte para identificador de string/UUID no path[2] (ex: /dashboard/activeTrips/{uuid})
            $subAction = "action" . ucfirst($path[1]);
            if (method_exists($class, $subAction)) {
                if (!isset($_GET['id'])) {
                    $_GET['id'] = $path[2];
                }
                $_GET['reference'] = $path[2];
                $_GET['tripReference'] = $path[2];
                return $subAction;
            }
        }

        if (isset($path[1])) {
            if (!empty($path[1])) {
                if (is_numeric($path[1])) {
                    $_GET['id'] = $path[1];
                }
                $action = "action" . ucfirst($path[1]);
            }
        }

        if (!method_exists($class, $action)) {
            if (method_exists($class, 'actionIndex')) {
                if (isset($path[1]) && !empty($path[1])) {
                    if (!isset($_GET['id'])) {
                        $_GET['id'] = $path[1];
                    }
                    $_GET['reference'] = $path[1];
                    $_GET['tripReference'] = $path[1];
                }
                return 'actionIndex';
            }
            return false;
        }

        return $action;
    }

    private function getCleanUrl($url)
    {
        return explode('?', $url)[0];
    }
}