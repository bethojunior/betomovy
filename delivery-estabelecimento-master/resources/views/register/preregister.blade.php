@extends('layouts.withoutpermission')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/register/preregister.css') }}">
@endsection
@section('content')
    <div class="d-flex flex-column h-100 w-100 absolute">
        <nav class="navbar navbar-light bg-light">
            <a class="navbar-brand" href="#">
                @if(env("AWS_DEFAULT_REGION") == 'sa-east-1')
                <img src="https://s3-sa-east-1.amazonaws.com/{{ env("AWS_BUCKET") }}/default.jpg" width="30" height="30"
                     class="logo-aplication d-inline-block align-top" alt="" loading="lazy">
                @else
                    <img src="{{ \Illuminate\Support\Facades\Storage::cloud()->url('default.jpg') }}" width="30" height="30"
                         class="logo-aplication d-inline-block align-top" alt="" loading="lazy">
                @endif
            </a>
        </nav>
        <div class="flex-fill">
            <div class="row d-flex flex-fill h-100 p-0 m-0">
                <div class="col-lg-7 bg-image d-sm-none d-md-none d-lg-block p-0" @if(!empty($banner)) style="background-image: url({{ $banner->value }})" @endif>
                    <div class="content-image-text">
                        <h3 class="center d-flex-none text-white p-0">Vamos conversar?</h3>
                        <p class="center text-white text-center">Deixe seus dados para entrarmos em contato te contar
                            mais sobre
                            nós</p>
                    </div>
                </div>
                <div class="col-12 col-lg-5">
                    <form action="{{ route('company.store.preregister') }}" method="POST" id="company-form">
                        @csrf
                        <div class="col-lg-12 scroll">
                            <div id="data-user" class="col-lg-12">
                                <div class="form-group">
                                    <h4 class="mt-3 mb-3">Dados do responsável</h4>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <input type="text"
                                                   class="form-control {{ $errors->has('user.name') ? 'is-invalid' : '' }}"
                                                   id="name-user"
                                                   value="{{ old('user.name') }}"
                                                   placeholder="Nome" name="user[name]">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <input type="text"
                                                   class="form-control {{ $errors->has('user.surname') ? 'is-invalid' : '' }}"
                                                   id="surname-user"
                                                   value="{{ old('user.surname') }}"
                                                   placeholder="Sobrenome" name="user[surname]">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <input type="email"
                                               class="form-control {{ $errors->has('user.email') ? 'is-invalid' : '' }}"
                                               id="email-user"
                                               value="{{ old('user.email') }}"
                                               placeholder="E-mail" name="user[email]">
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-lg-6">
                                            <input type="tel"
                                                   class="form-control {{ $errors->has('user.phone') ? 'is-invalid' : '' }} numberphone"
                                                   id="phone-user"
                                                   value="{{ old('user.phone') }}"
                                                   placeholder="Telefone" name="user[phone]">
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <input type="password"
                                                   class="form-control {{ $errors->has('user.password') ? 'is-invalid' : '' }}"
                                                   id="password"
                                                   value="{{ old('user.password') }}"
                                                   placeholder="Senha" name="user[password]">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <input type="password" class="form-control" id="passwordConfirm"
                                                   placeholder="Confirmar senha">
                                        </div>
                                    </div>
                                    <hr/>
                                    <div class="form-group">
                                        <input type="text"
                                               class="form-control {{ $errors->has('fantasyName') ? 'is-invalid' : '' }}"
                                               id="nameFantasy"
                                               value="{{ old('fantasyName') }}"
                                               placeholder="Nome fantasia" name="fantasyName">
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <input type="text"
                                                   class="form-control {{ $errors->has('document') ? 'is-invalid' : '' }} document"
                                                   id="documentCompany"
                                                   value="{{ old('document') }}"
                                                   placeholder="CNPJ ou CPF" name="document">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <select
                                                class="form-control {{ $errors->has('cityId') ? 'is-invalid' : '' }}"
                                                id="cityId"
                                                name="cityId">
                                                <option value="" selected>Selecione a cidade</option>
                                                @foreach($cities as $city)
                                                    <option value="{{ $city->cityId }}">{{ $city->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" id="next-page-web" class="btn btn-primary w-100 mb-2">
                                    Próximo
                                </button>
                            </div>
                        </div>
                        @if ($errors->any())
                            {{--                            <div class="row">--}}
                            <div class="col-md-12">
                                <div class="alert alert-danger alert-dismissible">
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            </div>
                            {{--                            </div>--}}
                        @endif
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
@section('js')
    <script src="{{ asset('js/modules/register/preregister.js') }}"></script>
@endsection

