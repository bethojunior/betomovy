@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/sales/sales.css') }}">
@endsection
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Relatório de pedidos</h1>
    </div>
@stop
@section('content_page')
    <form id="formReport">
        <div class="row">
            <div class="col">
                <div class="form-group">
                    <label for="dateStart">De</label>
                    <input type="date" class="form-control" id="dateStart">
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="dateEnd">Até</label>
                    <input type="date" class="form-control" id="dateEnd">
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="status">Status do Pedido</label>
            <select class="form-control" id="status">
                <option value="">Todos os status</option>
                @foreach($listDeliveryOrderStatus as $deliveryOrderStatus)
                    <option value="{{$deliveryOrderStatus->id}}">{{$deliveryOrderStatus->label}}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label for="paymentForm">Forma de Pagamento</label>
            <select class="form-control" id="paymentForm">
                <option value="">Todas</option>
                @foreach($deliveryPaymentForms as $deliveryPaymentForm)
                    <option value="{{$deliveryPaymentForm->id}}">{{$deliveryPaymentForm->name}}</option>
                @endforeach
            </select>
        </div>
        <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-info">Emitir Relatório</button>
        </div>
    </form>
@stop
@push('js')
    <script src="{{ asset('js/service/ConnectionServer.js') }}"></script>
    <script src="{{ asset('js/modules/report/orders.js') }}"></script>
@endpush
