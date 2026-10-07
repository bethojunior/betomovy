@extends('adminlte::page')
@section('title')
    @yield('page-title')
@endsection

@section('content_header')
    @yield('breadcrumps')
    @yield('page_header')
@stop

@section('content')
    @auth
        <input
            type="hidden"
            name="header-api_token"
            value="{{ bcrypt(\Auth::user()->api_token) }}"
            id="header-api_token">
        <input
            type="hidden"
            name="header-user_id"
            value="{{ \Auth::user()->idUser }}"
            id="header-user_id">
        <input
            type="hidden"
            name="header-company-id"
            value="{{ \Auth::user()->companyWorker->companyId }}"
            id="header-company-id">
        <input
            type="hidden"
            name="header-host_websocket"
            value="{{ env('MIX_HOST_SOCKET') }}"
            id="header-host_websocket">
    @endauth
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/default/config.css') }}">
    <link rel="stylesheet" href="{{ asset('config/main.css') }}">
    @component('includes.alerts')
    @endcomponent
    @include('sweetalert::alert')
    @include('includes.preload')

    @yield('content_page')

    <script src="{{ asset('js/utils/ElementProperty.js') }}"></script>
    <script src="{{ asset('js/service/Session.js') }}"></script>
    <script src="{{ asset('js/utils/SwalCustom.js') }}"></script>
    <script src="{{ asset('js/service/Init.js') }}"></script>
    <script src="{{ asset('js/utils/Mask.js') }}"></script>
    <script src="{{ asset('js/service/MainServices.js') }}"></script>
@endsection
