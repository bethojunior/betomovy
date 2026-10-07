@extends('layouts.page')
@section('css')
    <link href="/css/utils/jquery-ui.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/products/create.css') }}">
@endsection
@section('title', 'Produtos - Gerenciar')
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Produtos</h1>
    </div>
@stop
@section('content_page')
    @include('products.accordions.form-product')
    <div class="row mb-2">
        <div class="col-12 col-md-4">
            <div class="input-group">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Busque um produto"
                    aria-label="Busque um produto"
                    aria-describedby="searchInput"
                    data-search-uri="/{{ Route::getCurrentRoute()->uri }}"
                    id="input-search"
                    value="{{ Request::query('name') }}">
                <div class="input-group-append">
                        <span class="input-group-text" id="searchInput">
                            <a href="#" id="btn-search">
                                <i class="fas fa-search"></i>
                            </a>
                        </span>
                </div>
            </div>
        </div>
    </div>
    <div class="p-2">
        <div class="d-flex justify-content-between">
            <div class="form-group pull-right">
                <button type="button"
                        class="btn btn-primary m-2"
                        id="btn-modal-create-product"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        data-linkStoreProduct="{{ route('products.store') }}">
                    Adicionar Produto
                </button>
            </div>
            <a href="#"  data-toggle="modal" data-target="#positionCategoryModal">
                <i class="fas fa-align-justify align-items-center mr-1"></i>
                <span>Reodernar Categorias</span>
            </a>
        </div>
    </div>
    <div class="modal fade" id="positionCategoryModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <form method="POST" id="formPositionCategory">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Organizar categorias</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Arraste o item para a a posição que você deseja que seja mostrado</p>
                        <ul class="list-group list-category">
                            @foreach($deliveryCategories as $category)
                                <li class="list-group-item item-category" style="cursor: move" value="{{ $category->id }}">
                                    <i class="fas fa-align-justify mr-3"></i>
                                    {{ $category->name }}
                                </li>
                            @endforeach
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    @include('products.accordions.list-product')
@stop
@section('js')
    <script src="{{ asset('js/libs/jquery-ui.js') }}"></script>
    <script src="{{ asset('js/libs/jquery.maskMoney.min.js') }}"></script>
    @if(!Session::has('alert.config'))
        <script src="{{ $cdn?? asset('vendor/sweetalert/sweetalert.all.js')  }}"></script>
    @endif
    <script src="{{ asset('js/modules/products/products.js') }}"></script>
@endsection
