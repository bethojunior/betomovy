@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/config/financial.css') }}">
@endsection
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Financeiro</h1>
    </div>
@stop
@section('content')
    <div class="row col-lg-12 contain-sales">
        <header class="callout callout-info col-lg-12 col-sm-12">
            <form class="form-group relative">
                <div class="filters">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="filter" id="filter-by-date" value="option2">
                        <label class="form-check-label" for="filter-by-date">Por data</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="filter" id="filter-by-status" value="option2">
                        <label class="form-check-label" for="filter-by-status">Tipo de venda</label>
                    </div>
                </div>
            </form>
        </header>
        <div class="list-sales col-lg-12 col-sm-12">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID Pedido</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Atendente</th>
                        <th scope="col">Data</th>
                        <th scope="col">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="open-order">
                        <th scope="row">1</th>
                        <td>Roberto</td>
                        <td>Administrador</td>
                        <td>12/02/2020 - 18:00 hrs</td>
                        <td>R$23.00</td>
                    </tr>
                    <tr class="open-order">
                        <th scope="row">2</th>
                        <td>Marcelo</td>
                        <td>Administrador</td>
                        <td>12/02/2020 - 18:10 hrs</td>
                        <td>R$55.20</td>
                    </tr>
                    <tr class="open-order">
                        <th scope="row">3</th>
                        <td>Emerson</td>
                        <td>Administrador</td>
                        <td>12/02/2020 - 18:10 hrs</td>
                        <td>R$11.45</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div id="modal-data-order-choose" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Pedido</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        Cliente : <b>Heghbertho Gomes Costa Junior</b>
                        <br>
                        Endereco : <b>Rua Filomeno Gomes 100, Centro , ap 102</b>
                        <br>
                        Forma de pagamento : <b>Cartao no app</b>
                        <br>
                        <br>
                    </div>
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Item</th>
                            <th scope="col">QTD</th>
                            <th scope="col">Valor unico</th>
                            <th scope="col">Valor total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">Coca-cola 2lts</th>
                            <td>2</td>
                            <td>R$5.00</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">Pizza grande calabresa</th>
                            <td>1</td>
                            <td>R$32.00</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">Agua mineral 250ml</th>
                            <td>1</td>
                            <td>R$2.50</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>R$ 79.00</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary">Fechar</button>
                </div>
            </div>
        </div>
    </div>


    <div id="modal-filter-date" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Filtros</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="modal-filter-by-status" class="col-lg-12 filter-by-status hidden">
                        <div class="form-check">
                            <input class="form-check-input position-static" name="status-sales" type="radio" id="status-1" value="option1" aria-label="...">
                            <label for="status-1">Dinheiro</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input position-static" type="radio" name="status-sales" id="status-2" value="option1" aria-label="...">
                            <label for="status-2">Cartão na maquineta</label>
                        </div>
                    </form>
                    <form id="modal-filter-by-date" class="col-lg-12 filter-by-date hidden">
                        <div class="form-row">
                            <div class="col form-group">
                                <span>Inicio</span>
                                <input type="date" class="form-control">
                            </div>
                            <div class="col">
                                <span>Ate</span>
                                <input type="date" class="form-control">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Buscar</button>
                </div>
            </div>
        </div>
    </div>
@stop
@section('js')
    <script src="{{ asset('js/modules/config/financial.js') }}"></script>
@endsection
