@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/config/profile.css') }}">
@endsection
@section('title', 'Gerenciamento de Perfil')
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Configurações</h1>
    </div>
@stop
@section('content_page')
    <div class="accordion" id="accordionExample">
        @include('config.profile-forms.general-info')
        @include('config.profile-forms.company-open-hours')
{{--        @include('config.profile-forms.logistic-time')--}}
        @include('config.profile-forms.order-min-price')
        @if($companyDeliveryConfig->releaseDelivery == true)
            @include('config.profile-forms.driver-called-mode')
        @endif
        @include('config.profile-forms.setting-pix')
        @include('config.profile-forms.average-delivery-time')
    </div>
@stop
@section('js')
    <script src="{{ asset('js/libs/jquery.maskMoney.min.js') }}"></script>
    <script src="{{ asset('js/modules/config/profile.js') }}"></script>
@endsection
