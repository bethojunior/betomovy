@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/marketing/notification.css') }}">
@endsection
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Notificações</h1>
    </div>
@stop
@section('page-title')
    Notificações
@stop
@section('content')
    <div class="row col-lg-12">
        <div class="col-lg-8">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#push" role="tab" aria-controls="home" aria-selected="true">Push</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Email</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Sms</a>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="push" role="tabpanel" aria-labelledby="home-tab">
                    <div class="col-lg-12 row">
                        <div class="col-lg-6">
                            <div class="form-group col-lg-12">
                                <label for="title-notification">Titulo</label>
                                <input id="title-notification" class="form-control">
                            </div>
                            <div class="form-group col-lg-12">
                                <label for="body-notification">Corpo</label>
                                <textarea class="form-control" id="body-notification"></textarea>
                            </div>
                            <div class="col-lg-12">
                                <div class="card col-lg-12" style="padding-left: 1vw; padding-bottom: 1vw">
                                    <div class="row col-lg-12">
                                        <div class="col-lg-6">
                                            <header style="padding-top: 1vw">Público alvo</header>
                                        </div>
                                        <div class="col-lg-6">
                                            <header style="padding-top: 1vw">Público alvo</header>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row col-lg-12">
                                        <div class="col-lg-6">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="man">
                                                <label class="form-check-label" for="man">
                                                    Homem
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="womam">
                                                <label class="form-check-label" for="womam">
                                                    Mulher
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="all">
                                                <label class="form-check-label" for="all">
                                                    Todos
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="final-client">
                                                <label class="form-check-label" for="final-client">
                                                    Cliente final
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="motoboy">
                                                <label class="form-check-label" for="motoboy">
                                                    Entregador
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="all-type">
                                                <label class="form-check-label" for="all-type">
                                                    Todos
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top: 1vw" class="col-lg-12">
                                <button class="btn btn-primary">Enviar</button>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="col-lg-12">
                                <label>Imagem do push</label>
                                <img id="thumbnail" class="img-thumbnail" width="300vw" src="{{asset('assets/images/icons/default.jpg')}}">
                                <input id="image-upload-item" class="file" type="file">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <div class="col-lg-12 row">
                        <div class="col-lg-6">
                            <div class="form-group col-lg-12">
                                <label for="title-notification">Titulo</label>
                                <input id="title-notification" class="form-control">
                            </div>
                            <div class="form-group col-lg-12">
                                <label for="body-notification">Corpo</label>
                                <textarea class="form-control" id="body-notification"></textarea>
                            </div>
                            <div class="col-lg-12">
                                <div class="card col-lg-12" style="padding-left: 1vw;padding-bottom: 1vw">
                                    <div class="row col-lg-12">
                                        <div class="col-lg-6">
                                            <header style="padding-top: 1vw">Público alvo</header>
                                        </div>
                                        <div class="col-lg-6">
                                            <header style="padding-top: 1vw">Público alvo</header>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row col-lg-12">
                                        <div class="col-lg-6">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="man">
                                                <label class="form-check-label" for="man">
                                                    Homem
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="womam">
                                                <label class="form-check-label" for="womam">
                                                    Mulher
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="all">
                                                <label class="form-check-label" for="all">
                                                    Todos
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="final-client">
                                                <label class="form-check-label" for="final-client">
                                                    Cliente final
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="motoboy">
                                                <label class="form-check-label" for="motoboy">
                                                    Entregador
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="all-type">
                                                <label class="form-check-label" for="all-type">
                                                    Todos
                                                </label>
                                            </div>
                                        </div>
                                        <div style="margin-top: 1vw" class="col-lg-12">
                                            <button class="btn btn-primary">Enviar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="col-lg-12">
                                <label>Imagem do push</label>
                                <img id="thumbnail" class="img-thumbnail" width="300vw" src="{{asset('assets/images/icons/default.jpg')}}">
                                <input id="image-upload-item" class="file" type="file">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                    <div class="col-lg-12 row">
                        <div class="col-lg-6">
                            <div class="form-group col-lg-12">
                                <label for="body-notification">Mensagem </label>
                                <label id="caracteres-message">120/120</label>
                                <textarea maxlength="120" class="form-control" id="body-notification-sms"></textarea>
                            </div>
                        </div>
                        <div class="col-lg-6" style="margin-top: 2vw">
                            <div class="col-lg-12">
                                <div class="card col-lg-12" style="padding-left: 1vw;padding-bottom: 1vw">
                                    <div class="row col-lg-12">
                                        <div class="col-lg-6">
                                            <header style="padding-top: 1vw">Público alvo</header>
                                        </div>
                                        <div class="col-lg-6">
                                            <header style="padding-top: 1vw">Público alvo</header>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row col-lg-12">
                                        <div class="col-lg-6">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="man">
                                                <label class="form-check-label" for="man">
                                                    Homem
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="womam">
                                                <label class="form-check-label" for="womam">
                                                    Mulher
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="all">
                                                <label class="form-check-label" for="all">
                                                    Todos
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="final-client">
                                                <label class="form-check-label" for="final-client">
                                                    Cliente final
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="motoboy">
                                                <label class="form-check-label" for="motoboy">
                                                    Entregador
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="all-type">
                                                <label class="form-check-label" for="all-type">
                                                    Todos
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 1vw" class="col-lg-12">
                            <button class="btn btn-primary">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <img style="width: 60%; margin-left: 3vw" src="{{asset('assets/images/icons/iphone.png')}}">
        </div>
    </div>
@stop
@section('js')
    <script src="{{ asset('js/modules/marketing/notification.js') }}"></script>
@endsection
