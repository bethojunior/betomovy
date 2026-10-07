@extends('layouts.page')
@section('css')
<link rel="stylesheet" href="{{ asset('css/config/create-optional.css') }}">
@endsection
@section('content_header')
<div class="col-lg-12">
    <h1 class="m-0 text-dark">Complementos</h1>
</div>
@stop
@section('content')
<div class="accordion" id="accordionExample">
    <div class="card">
        <div class="card-header" id="headingOne">
            <h2 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Cadastro de opcional
                </button>
            </h2>
        </div>

        <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div class="card-body">
                <div class="row col-lg-12">
                    <form style="margin-right: -8vw" class="col-lg-10 col-sm-12">
                        <div class="form-row">
                            <div class="form-group col-md-3">
                                <label for="name-product">Nome</label>
                                <input type="email" class="form-control" id="name-product">
                            </div>
                            <div class="form-group col-md-3">
                                <label for="time-read">Tempo de preparo</label>
                                <input type="number" class="form-control" id="time-read" placeholder="Exemplo:. 20" >
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-lg-12">
                                <div class="form-group">
                                    <label for="description">Descrição</label>
                                    <textarea  style="width: 31.5vw" class="form-control col-lg-12" id="description" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-3">
                                <label for="price-sale">Preço de custo</label>
                                <input type="text" class="form-control" id="price-sale" placeholder="">
                            </div>
                            <div class="form-group col-md-3">
                                <label for="real-price">Preço de venda</label>
                                <input type="text" class="form-control" id="real-price" >
                            </div>
                            <div class="form-group col-md-9" >
                                <input type="file" class="custom-file-input" id="image-product">
                                <label class="custom-file-label" for="image-product">Imagem do produto</label>
                            </div>
                        </div>
                        <div class="row col-lg-12">
                            <div class="col-md-12">
                                <img style="width: 14vw" class="col-lg-12" id="thumbnail">
                            </div>
                        </div>
                        <button style="margin-top: 1vw" type="submit" class="btn btn-primary">Salvar</button>
                    </form>
                    <div class="col-lg-2 col-sm-12">
                        <img width="188vw" src="{{ asset('assets/images/icons/iphone.png') }}">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header" id="headingTwo">
            <h2 class="mb-0">
                <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Listagem opcionais
                </button>
            </h2>
        </div>
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
            <div class="card-body">
                <div class="col-lg-12 container-list">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Imagem</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Tempo</th>
                            <th scope="col">Descrição</th>
                            <th scope="col">Custo</th>
                            <th scope="col">Venda</th>
                        </tr>
                        </thead>
                        <tbody id="mount-list-optionals">
                            <tr>
                                <th>
                                    <img width="80vw" class="img-thumbnail" src="https://www.meubarato.com/image/d2lkdGg9NjYwJmZvcmNlPTEmcmVmcmVzaD0xNTAzMDU2Mjk0JnE9OTgmc3JjPWltZy9vZmVydGFzL29mZXJ0YV8yXzM4ODcuanBnJnNlY3VyZT17YnVybn0=.jpg">
                                </th>
                                <th>Borda catupiry</th>
                                <td>20 min</td>
                                <td>Borda recheada para pizza</td>
                                <td>R$2,00</td>
                                <td>R$5,00</td>
                                <td>
                                    <button class="btn btn-default edit-this-product"><i class="fas fa-pencil-alt"></i></button>
                                    <button class="btn btn-danger delete-this-product "><i class="far fa-trash-alt"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@stop
@section('js')
<script src="{{ asset('js/modules/config/create-optional.js') }}"></script>
@endsection
