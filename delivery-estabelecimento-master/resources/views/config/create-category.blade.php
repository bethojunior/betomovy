@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/products/create.css') }}">
@endsection
@section('title', 'Categorias')
@section('content_page')
    <div>
        <h5 class="mb-3">Categorias do seu estabelecimento</h5>
        <form method="POST" action="{{ route('config.update') }}">
            @csrf
            @foreach($categories as $category)
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" name="categories[]"
                           id="inlineCheckbox{{ $category->id }}"
                           value="{{ $category->id }}"
                           {{$category->selected == true ? "checked" : ""}}
                    >
                    <label class="form-check-label"
                           for="inlineCheckbox{{ $category->id }}">{{ $category->name }}</label>
                </div>
            @endforeach
            <hr/>
            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">Atualizar</button>
            </div>
        </form>
    </div>
@stop
@section('js')
@endsection
