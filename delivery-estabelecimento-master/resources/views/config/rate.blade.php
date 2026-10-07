@extends('layouts.page')
@section('css')
@endsection
@section('title', 'Taxa e tempo')
@section('content_page')
    <input type="hidden" name="companyId"
           value="{{ Auth::user()->companyWorker->companyId }}">
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addRateModal">
        Adicionar
    </button>

    <table class="table table-striped mt-2">
        <thead>
        <tr>
            <th>Alcance</th>
            <th>Taxa</th>
            <th>Tempo</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        @foreach($rates as $rate)
            <tr>
                <td>ATÉ {{ $rate->range }} KM</td>
                <td>R$ <span class="mask-money" value="{{ $rate->tax }}"></span></td>
                <td>{{ $rate->time }} minutos</td>
                <td>
                    <form action="{{ route('rate.delete',$rate->id) }}" method="POST">
                        @method("DELETE")
                        @csrf
                        <button type="submit" class="btn btn-danger btn-sm">Excluir</button>
                    </form>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="addRateModal" tabindex="-1" aria-hidden="true">
        <form
            id="addRateForm"
            action="{{ route('rate.store') }}"
            enctype="multipart/form-data"
            method="POST">
            @csrf
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Adicionar novo alcance</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="reachInput">Alcance(km)</label>
                                    <input type="number" class="form-control" name="range" id="reachInput" required>
                                </div>
                            </div>
                            <div class="col">

                                <div class="form-group">
                                    <label for="rateInput">Taxa</label>
                                    <input type="tel" class="form-control" name="tax" id="rateInput" required>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="timeInput">Tempo(minutos)</label>
                                    <input type="number" class="form-control" name="time" id="timeInput" required>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="companyId"
                               value="{{ Auth::user()->companyWorker->companyId }}">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Adicionar</button>
                    </div>
                </div>
            </div>
        </form>
    </div>

@stop
@section('js')
    <script src="{{ asset('js/libs/jquery.maskMoney.min.js') }}"></script>
    <script src="{{ asset('js/modules/config/rate.js') }}"></script>
@endsection
