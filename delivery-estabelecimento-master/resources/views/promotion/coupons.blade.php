@extends('layouts.page')
@section('css')
@endsection

@section('content_page')

    <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#addCouponModal">
        Novo cupom
    </button>
    <table class="table">
        <thead>
        <tr>
            <th>Código</th>
            <th>Valor</th>
            <th>Tipo de valor</th>
            <th>À partir de</th>
            <th>Data inicial</th>
            <th>Data final</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        @foreach($coupons as $coupon)
            <tr>
                <td>{{ $coupon->code }}</td>
                <td>{{  'R$ '.number_format($coupon->value, 2, ',', '.') }}</td>
                <td>{{ $coupon->valueType }}</td>
                <td>{{  'R$ '.number_format($coupon->fromValue, 2, ',', '.') }}</td>
                <td>{{ \Carbon\Carbon::parse($coupon->dateStart)->format('d/m/Y H:i:s') }}</td>
                <td>{{ \Carbon\Carbon::parse($coupon->dateEnd)->format('d/m/Y H:i:s') }}</td>
                <td>
                    <form action="{{ route('promotion.deleteCoupon',$coupon->id) }}" method="POST">
                        @method("DELETE")
                        @csrf
                        <button type="submit" class="btn btn-danger btn-sm">Excluir</button>
                    </form>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <div class="modal fade" id="addCouponModal">
        <form action="{{ route("promotion.coupon") }}"  method="POST" id="formAddCoupon">
            @csrf
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Adicionar cupom</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="code">Código do cupom</label>
                            <input type="text" class="form-control" id="code" name="code"
                                   autocomplete="off"
                                   placeholder="exemplo.: NOVOCUPOM" oninput="this.value = this.value.toUpperCase()"
                                   required>
                        </div>
                        <input type="text" value="{{\Auth::user()->companyWorker->companyId}}" name="companyId" hidden/>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="value">Valor</label>
                                <input type="tel" class="form-control mask-money" id="value" name="value" required>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="fromValue">À partir de</label>
                                <input type="tel" class="form-control mask-money" id="fromValue" name="fromValue"
                                       required>
                            </div>
                        </div>
                        <div class="d-flex">
                            <p class="mr-2">Tipo de desconto:</p>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="valueTypeRadius1" name="valueType" class="custom-control-input" value="$" checked>
                                <label class="custom-control-label" for="valueTypeRadius1">$</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="valueTypeRadius2" name="valueType" class="custom-control-input" value="%">
                                <label class="custom-control-label" for="valueTypeRadius2">%</label>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="dateStart">Data inicial</label>
                                <input type="datetime-local" class="form-control" id="dateStart" name="dateStart"
                                       required>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="dateEnd">Data final</label>
                                <input type="datetime-local" class="form-control" id="dateEnd" name="dateEnd" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
@stop
@push('js')
    <script type="text/javascript" src="{{ asset('js/libs/jquery.maskMoney.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/modules/promotion/coupon.js') }}"></script>
@endpush
