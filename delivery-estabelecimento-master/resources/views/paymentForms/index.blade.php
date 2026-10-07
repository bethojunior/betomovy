@extends('layouts.page')
@section('title', 'Formas de Pagamento - Gerenciar')
@section('page_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Formas de Pagamento</h1>
    </div>
@stop
@section('content_page')
    <div class="row">
        <div class="col-lg-5">
            <div class="card">
                <div class="card-body">
                    <form id="form-new-zone" action="{{ route('paymentform.store') }}" method="post">
                        @csrf
                        <div class="row">
                            <div class="col-md-9">
                                <label for="deliveryPaymentFormId">Forma de Pagamento</label>
                                <select class="form-control" id="deliveryPaymentFormId" name="deliveryPaymentFormId">
                                    <option value="">Selecione uma forma de pagamento</option>
                                    @foreach($deliveryPaymentForms as $deliveryPaymentForm)
                                        @if($companyPaymentForms
                                            ->contains('deliveryPaymentFormId', $deliveryPaymentForm->id))
                                            @continue
                                        @endif
                                        <option value="{{ $deliveryPaymentForm->id }}">{{ $deliveryPaymentForm->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 mt-2">
                                <button id="btn-submit" class="btn btn-primary">Adicionar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-lg-7">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Apagar</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($companyPaymentForms as $companyPaymentForm)
                                <tr>
                                    <td>{{ $companyPaymentForm->name }}</td>
                                    <td>
                                        <a class="btn btn-danger"
                                           href="#"
                                           onclick="event.preventDefault();document.getElementById('form-delete-{{ $companyPaymentForm->id }}').submit()">
                                            <i class="far fa-trash-alt"></i></a>
                                    </td>
                                    <form action="{{ route('paymentform.delete', $companyPaymentForm) }}"
                                          method="POST"
                                          id="form-delete-{{ $companyPaymentForm->id }}">
                                        @csrf
                                        @method('DELETE')
                                    </form>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer">

                </div>
            </div>
        </div>
    </div>
@stop
@section('js')
    <script>
        $('#deliveryPaymentFormId').select2({
            selectionCssClass: "form-control"
        });
    </script>
@endsection
