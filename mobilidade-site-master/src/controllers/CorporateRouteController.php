<?php


class CorporateRouteController extends View
{
    private $isPermission = false;

    public function __construct()
    {
        if (!Session::get("user")) {
            $this->titleGlobal = "Login";
            $this->login();
        } else {
            $this->isPermission = true;
        }
    }

    public function actionIndex()
    {
        if (!$this->isPermission)
            return "";

        $this->titleGlobal = "Rota Corporativo";
        $this->index();
    }

    public function index()
    {
        $this->layoutBuilder(
            [
                "corporate-route/nav",
                "corporate-route/index"
            ],
            [
                "controllers/PlaceController",
                "controllers/ScheduleCorporateRouteController",
                "controllers/CorporateRouteCustomerController",
                "modulos/corporateroute/list"
            ],
            [
                "corporate-route/nav",
                "corporate-route/index"
            ]
        );
    }

    public function login()
    {
        $this->layoutBuilder(
            [
                "corporate-route/login"
            ],
            [
                "controllers/AuthenticateController",
                "modulos/corporateroute/login"
            ],
            [
                "corporate-route/login"
            ]);
    }

    public function actionAdd()
    {
        if (!$this->isPermission)
            return "";

        $this->titleGlobal = "Adicionar horário de rota";

        $this->layoutBuilder(
            [
                "corporate-route/nav",
                "corporate-route/add"
            ],
            [

                "controllers/ScheduleCorporateRouteController",
                "controllers/CorporateRouteController",
                "modulos/corporateroute/add"
            ],
            [
                "corporate-route/nav",
            ]);
    }

    public function actionEdit()
    {
        if (!$this->isPermission)
            return "";

        $this->titleGlobal = "Editar horário de rota";

        $this->layoutBuilder(
            [
                "corporate-route/nav",
                "corporate-route/edit"
            ],
            [

                "controllers/ScheduleCorporateRouteController",
                "controllers/CorporateRouteController",
                "modulos/corporateroute/edit"
            ],
            [
                "corporate-route/nav",
            ]);
    }

    public function actionCustomers()
    {
        if (!$this->isPermission)
            return "";

        $this->titleGlobal = "Clientes";

        $this->layoutBuilder(
            [
                "corporate-route/nav",
                "corporate-route/customers"
            ],
            [
                "controllers/PlaceController",
                "controllers/CorporateRouteCustomerController",
                "modulos/corporateroute/customers"
            ],
            [
                "corporate-route/nav",
            ]);
    }


    public function actionRoutes()
    {
        if (!$this->isPermission)
            return "";

        $this->titleGlobal = "Rotas";

        $this->layoutBuilder(
            [
                "corporate-route/nav",
                "corporate-route/routes"
            ],
            [
                "controllers/ScheduleCorporateRouteController",
                "modulos/corporateroute/routes"
            ],
            [
                "corporate-route/nav",
            ]);
    }

    public function actionLogout()
    {
        Session::delete("user");
        header('Location: /corporateroute/');

    }
}