@extends('layouts.page')
@section('css')
    <link rel="stylesheet" href="{{ asset('css/marketing/coupon.css') }}">
@endsection
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Cupons</h1>
    </div>
@stop
@section('content')
    <div class="accordion" id="accordionExample">
        <div class="card">
            <div class="card-header" id="headingOne">
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Inserir cupom
                    </button>
                </h2>
            </div>

            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                <div class="row card-body">
                    <div class="form-group col-lg-3">
                        <label for="inputAddress2">Código do cupom <i class="far fa-question-circle"></i></label>
                        <input type="text" class="form-control" id="inputAddress2" placeholder="20% off!">
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="inputAddress2">Data inicio</label>
                        <input type="datetime-local" class="form-control" id="inputAddress2">
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="inputAddress2">Data final</label>
                        <input type="datetime-local" class="form-control" id="inputAddress2">
                    </div>
                    <div class="col-lg-3"></div>
                    <div class="form-group col-lg-3">
                        <label for="inputAddress2">Formas de pagamento validas</label>
                        <br>
                        <select class="js-example-basic-multiple col-lg-12" name="states[]" multiple="multiple">
                            <option value="AL">Cartao</option>
                            <option value="WY">Dinheiro</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-2">
                        <label for="inputAddress2">Valor minimo <i class="far fa-question-circle"></i></label>
                        <input type="text" class="form-control" id="inputAddress2">
                    </div>
                    <div class="form-group col-lg-2">
                        <label for="inputAddress2">Valor maximo <i class="far fa-question-circle"></i></label>
                        <input type="text" class="form-control" id="inputAddress2">
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header" id="headingTwo">
                <h2 class="mb-0">
                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Listagem de cupom
                    </button>
                </h2>
            </div>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                <div class="card-body">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </div>
            </div>
        </div>
    </div>
@stop
@section('js')
    <script src="{{ asset('js/modules/marketing/coupon.js') }}"></script>
@endsection
