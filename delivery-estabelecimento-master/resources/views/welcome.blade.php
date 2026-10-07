<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>704 DELIVERY</title>
    <link href="{{ asset('app.css') }}" rel="stylesheet">
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
    <!-- Styles -->
    <style>
        html, body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Nunito', sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
        }

        .full-height {
            height: 100vh;
        }

        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }

        .position-ref {
            position: relative;
        }

        .top-right {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            display: flex;
            justify-content: flex-end;
            height: 48px;
            align-items: center;
            background-color: #f5f5f5;
        }

        .content {
            text-align: center;
            display: flex;
            justify-content: space-evenly;
            margin: auto;
            width: 100vw;
        }

        .title {
            display: flex;
            justify-content: center;
            font-size: 50px;
            margin-top: 15px !important;
            margin-bottom: 15px !important;
        }
        .imageLinks {
            display: flex;
            justify-content: center;
           
        }
        .linkIos > img{
            height: 70px;
            margin-top: 0; 
            margin-right: 10px;
        }
        .linkAndroid > img{
            height: 70px;
            margin-top: 0;
        }
        .links > a {
            color: #636b6f;
            padding: 0 25px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: .1rem;
            text-decoration: none;
            text-transform: uppercase;
        }

        .m-b-md {
            margin-bottom: 30px;
        }

        .images-preview{
            display: flex;
            justify-content: center;
            width: 600px;
            transition: all 1s;
        }

        .images-preview > img{
            width: 400px;
            height: 400px;
            object-fit: contain;
            margin: 0 25px;
        }
        .images-preview:hover {
            transform: scale(1.05);
        }
        .info-welcome > div > img{
            cursor: pointer;
        }
        .info-welcome {
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .info-welcome  > p {
            margin: 20px 40px;
            font-size: 20px;
            text-align: left;
        }

        .info-welcome > h4{
            text-align: left;
            font-size: 20pt;
            margin: 0 40px;
        }
        .info-cities > p {
            font-size: 30px;
        }

        .deliveryCities {
            display: flex;
            align-items: start;
            flex-direction: column;
            list-style-type: none;
            font-size: 30px;
            height: 50vh;
            overflow-y: scroll;
        }
        @media only screen and (max-width: 1090px){
            .images-preview{
                display: none;
            }
            .info-welcome{
                width: 100%;
            }
        }
    </style>
</head>
<body>
@include('sweetalert::alert')
<div class="flex-center position-ref full-height">
    @if (Route::has('login'))
        <div class="top-right links">
            @auth
                <a href="{{ url('/home') }}">Home</a>
            @else
                <a href="{{ route('login') }}">Entrar</a>

                @if (Route::has('register'))
                    <a href="{{ route('company.preregister') }}">Cadastre-se</a>
                @endif
            @endauth
        </div>
    @endif

    <div class="content">
        <div class="info-welcome">
            <div>
                <h4 class="title">Baixe o aplicativo</h4>
                <div class="imageLinks">
                    <a class="linkIos" target="_blank"><img src="{{ asset("assets/images/svg/apple.svg") }}" /></a>
                    <a class="linkAndroid" target="_blank"><img src="{{ asset("assets/images/svg/google.svg") }}" /></a>
                </div>
                <p>Seu prato predileto a apenas um toque de distância.</p>
                <div class="images-preview">
                    <img class="deliveryImage" src= ''/>
                </div>
            </div>
        </div>     
        <div class="info-cities">
            <p>Já estamos disponíveis na seguintes cidades</p>
            <ul class="deliveryCities"></ul>
        </div>  
    </div>
</div>
    <script src="{{ asset('js/service/ConnectionServer.js') }}"></script>
    <script src="{{ asset('js/modules/welcome/welcome.js') }}"></script>
@yield('script')
</body>
</html>