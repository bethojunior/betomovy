@extends('layouts.page')
@section('title', 'Pedidos')
@section('content_page')
    <input type="hidden" name="companyId"
                   value="{{ Auth::user()->companyWorker->companyId }}">
    <div id="componentOrderActive" class="component-order-active"></div>
@stop
@section('js')
@endsection
