@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/config/report.css') }}">
@endsection
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Relatórios</h1>
    </div>
@stop
@section('content')

@stop
@section('js')
    <script src="{{ asset('js/modules/config/report.js') }}"></script>
@endsection
