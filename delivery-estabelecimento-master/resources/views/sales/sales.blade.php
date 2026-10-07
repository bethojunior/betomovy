@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/sales/sales.css') }}">
@endsection
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Vendas</h1>
    </div>
@stop
@section('content_page')
    <div id="orderList"></div>

@stop
@push('js')
    <script src="{{ asset('js/modules/sales/sales.js') }}"></script>
@endpush
