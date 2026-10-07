@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/utils/mapbox-gl.css') }}">
@endsection
@section('title', 'Endereço')
@section('content_page')
    <input type="hidden" name="companyId"
           value="{{ Auth::user()->companyWorker->companyId }}">
    <div id="companyAddress"></div>
@stop
@section('js')
@endsection
