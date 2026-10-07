@extends('layouts.page')
@section('css')
<link rel="stylesheet" href="{{ asset('css/client/list-users.css') }}">
@endsection
@section('content_header')
<div class="col-lg-12">
    <h1 class="m-0 text-dark">Listagem de usuarios</h1>
</div>
@stop
@section('content')
    <div class="row col-lg-12 contain-sales">
        <header class="callout callout-info col-lg-6 col-sm-12">
            <form class="form-group relative">
                <input class="form-control" id="value-search-filter">
                <i class="absolute fas fa-search"></i>
                <div class="filters">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" checked type="radio" name="filter" id="filter-by-client" value="option1">
                        <label class="form-check-label" for="filter-by-client">Por nome</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="filter" id="filter-by-date" value="option2">
                        <label class="form-check-label" for="filter-by-date">Por Email</label>
                    </div>
                </div>
            </form>
        </header>
        <div class="list-sales col-lg-12 col-sm-12">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Email</th>
                        <th scope="col">Telefone</th>
                        <th scope="col">Data</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="">
                        <th>Heghbertho Gomes Costa</th>
                        <th>hgomescostajr@gmail.com</th>
                        <th>(85)9 9425-3764</th>
                        <th>12/03/20 17:20:23</th>
                        <th>
                            <div class="dropdown mr-1">
                                <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuOffset" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="10,20">
                                    <i class="fas fa-user-edit"></i>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuOffset">
                                    <a class="dropdown-item delete-user">Apagar</a>
                                    <a class="dropdown-item release-user">Bloquear</a>
                                    <a class="dropdown-item edit-user">Editar</a>
                                    <a class="dropdown-item historic-user">Historico</a>
                                </div>
                            </div>

                        </th>
                    </tr>
                    <tr class="">
                        <th>Irineu da Silva</th>
                        <th>irineu@gmail.com</th>
                        <th>(85)9 8873-2399</th>
                        <th>12/03/20 17:21:13</th>
                        <th>
                            <div class="dropdown mr-1">
                                <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuOffset" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="10,20">
                                    <i class="fas fa-user-edit"></i>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuOffset">
                                    <a class="dropdown-item delete-user">Apagar</a>
                                    <a class="dropdown-item release-user">Bloquear</a>
                                    <a class="dropdown-item edit-user" >Editar</a>
                                    <a class="dropdown-item historic-user">Historico</a>
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr class="">
                        <th>Marcelo Alberto Silva</th>
                        <th>marcelinhofunk200@gmail.com</th>
                        <th>(85)9 8733-9844</th>
                        <th>12/03/20 17:22:34</th>
                        <th>
                            <div class="dropdown mr-1">
                                <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuOffset" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="10,20">
                                    <i class="fas fa-user-edit"></i>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuOffset">
                                    <a class="dropdown-item delete-user">Apagar</a>
                                    <a class="dropdown-item release-user">Bloquear</a>
                                    <a class="dropdown-item edit-user">Editar</a>
                                    <a class="dropdown-item historic-user">Historico</a>
                                </div>
                            </div>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div id="modal-data-order-choose" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar dados do cliente</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="form-group">
                        <label for="name-user">Nome</label>
                        <input class="form-control" id="name-user" value="Heghbertho Gomes Costa Junior">
                    </form>
                    <form class="form-group">
                        <label for="email-user">Email</label>
                        <input type="email" class="form-control" id="email-user" value="hgomescostajr@gmail.com">
                    </form>
                    <form class="form-group">
                        <label for="phone-user">Telefone</label>
                        <input type="tel" class="form-control" id="phone-user" value="(85)9 9425-3764">
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary">Salvar</button>
                </div>
            </div>
        </div>
    </div>

    <div id="modal-historic-user" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Histórico de compra do usário</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Data</th>
                                <th scope="col">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>#102</th>
                                <td>12/03/2020 19:30:23</td>
                                <td>R$23,00</td>
                                <td>
                                    <button class="btn btn-info open-sale">Ver venda</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


@stop
@section('js')
<script src="{{ asset('js/modules/client/list-users.js') }}"></script>
@endsection
