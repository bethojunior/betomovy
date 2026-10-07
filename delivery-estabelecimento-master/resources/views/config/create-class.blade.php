@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/products/create.css') }}">
@endsection
@section('title', 'Categorias - Cadastrar')
@section('content_page')
    <div>
        <button type="button" class="btn btn-primary mb-3" data-toggle="modal" data-target="#addCategoryModal">
            Adicionar categoria
        </button>
        <div class="list-class">
            <table class="table table-striped">
                <colgroup>
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 70%;">
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 10%;">
                </colgroup>
                <thead>
                <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                @foreach($deliveryCategories as $category)
                    <tr>
                        <td>
                            <img width="50px"  src="{{ $category->picture }}">
                            <div class="modal fade" id="categoryModal{{ $category->id }}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <form
                                    action="{{ route('categories.store') }}"
                                    enctype="multipart/form-data"
                                    method="POST">
                                    @csrf
                                    @method('PUT')
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Editar categoria</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <input type="hidden" name="id" value="{{ $category->id }}" />
                                                <div class="form-group">
                                                    <label for="name-product">Nome da categoria</label>
                                                    <input type="text" name="name" class="form-control" id="name-product" value="{{ $category->name }}" autocomplete="off" required>
                                                </div>
                                                <div class="form-group">
                                                    <input type="file" name="picture" id="customFile">
                                                </div>
                                                <input type="hidden" name="companyId"
                                                       value="{{ Auth::user()->companyWorker->companyId }}">

                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                                <button type="submit" class="btn btn-primary">Atualizar</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </td>
                        <td>{{ $category->name }}</td>
                        <td>
                            <a href="#" class="btn btn-danger"
                               onclick="event.preventDefault();
                                   document.getElementById('form-destroy').action =
                                   '{{ route('categories.destroy', $category) }}';
                                   document.getElementById('form-destroy').submit()">
                                <i class="far fa-trash-alt"></i>
                            </a>
                        </td>
                        <td>
                            <a href="#" class="btn btn-info" data-toggle="modal" data-target="#categoryModal{{ $category->id }}">
                                <i class="fas fa-edit"></i>
                            </a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>

        <form action="" method="POST" id="form-destroy">
            @csrf
            @method('DELETE')
        </form>
    </div>

    <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <form
            action="{{ route('categories.store') }}"
            enctype="multipart/form-data"
            method="POST">
            @csrf
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Cadastro de categoria</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="name-product">Nome da categoria</label>
                            <input type="text" name="name" class="form-control" id="name-product" autocomplete="off" required>
                        </div>
                        <div class="form-group">
                            <input type="file" name="picture" id="customFile" required>
                        </div>
                        <input type="hidden" name="companyId"
                               value="{{ Auth::user()->companyWorker->companyId }}">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Adicionar</button>
                    </div>
                </div>
            </div>
        </form>
    </div>

@stop
@section('js')
    <script src="{{ asset('js/modules/products/create.js') }}"></script>
@endsection
