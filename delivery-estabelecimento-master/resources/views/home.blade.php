@extends('layouts.page')

@section('title', 'Dashboard')

@section('css')
    <link rel="stylesheet" href="{{ asset('css/home/dashboard.css') }}">
@endsection
@section('content_page')
<section class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4 col-6">
                <div class="small-box bg-info">
                    <div class="inner">
                        <h3>{{$dashboard->totalAccepted}}</h3>
                        <h5>Em Aberto</h5>
                    </div>
                    <div class="icon">
                        <i class="ion ion-bag"></i>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-6">
                <div class="small-box bg-warning">
                    <div class="inner">
                        <h3>{{$dashboard->totalInProgress}}</h3>
                        <h5>Em andamento</h5>
                    </div>
                    <div class="icon">
                        <i class="ion ion-bag">

                        </i>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-6">
                <div class="small-box bg-success">
                    <div class="inner">
                        <h3>{{$dashboard->totalFinished}}</h3>
                        <h5>Finalizados</h5>
                    </div>
                    <div class="icon">
                        <i class="ion ion-bag">

                        </i>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>
@stop
@push('js')
    <script src="{{ asset('js/modules/home/dashboard.js') }}"></script>
@endpush
