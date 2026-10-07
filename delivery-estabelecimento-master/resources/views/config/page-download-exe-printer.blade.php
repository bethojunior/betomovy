@extends('layouts.page')
@section('title', 'Gerenciamento de Perfil')
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Download do gerenciador de impressora</h1>
    </div>
@stop
@section('content_page')

    <a href="{{ $url }}" type="button" class="btn btn-primary mb-2">
        Download
    </a>
@stop
