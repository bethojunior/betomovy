@extends('layouts.page')
@section('title', 'Zonas de Entrega - Gerenciar')
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Bairros / Zonas de entrega</h1>
    </div>
@stop
@section('content_page')
    <div class="row">
        <div class="modal fade" id="addZoneModal" data-backdrop="static" data-keyboard="false" tabindex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form id="form-new-zone" action="{{ route('zones.store') }}" method="post">
                        @csrf
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Adicionar bairro/zona</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-9">
                                    <label for="deliveryNeighborhoodId">Nome da bairro/zona</label>
                                    <select class="form-control" id="deliveryNeighborhoodId"
                                            name="deliveryNeighborhoodId">
                                        <option value="">Selecione uma zona</option>
                                        @foreach($deliveryNeighborhoods as $deliveryNeighborhood)
                                            @if($companyDeliveryNeighborhoods
                                                ->contains('deliveryNeighborhoodId', $deliveryNeighborhood->id))
                                                @continue
                                            @endif
                                            <option
                                                data-deliveryPrice="{{ $deliveryNeighborhood->deliveryPrice }}"
                                                value="{{ $deliveryNeighborhood->id }}">
                                                {{ $deliveryNeighborhood->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                <span id="deliveryNeighborhoods" value='{{ $deliveryNeighborhoods->toJson() }}'></span>
                                <div class="col-md-3" {{ $companyDeliveryOrderConfig->callForAll ? "hidden" : "" }}>
                                    <label for="price">Valor</label>
                                    <input type="text"
                                           class="form-control class-mask-price mask-money"
                                           id="price"
                                           name="price"
                                           value="{{ old('price') }}"
                                           @if(!$companyDeliveryConfig->releaseDelivery) disabled @endif>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mt-2">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                            <button id="btn-submit" class="btn btn-primary">Adicionar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="form-group col-12 col-md-4">
                            <div class="input-group mb-3">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Pesquise"
                                    aria-label="Pesquise"
                                    aria-describedby="searchInput"
                                    id="input-search"
                                    value="{{ Request::query('name') }}">
                                <div class="input-group-append">
                                    <span class="input-group-text" id="searchInput">
                                        <a href="#" id="btn-search">
                                            <i class="fas fa-search"></i>
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-primary" data-toggle="modal"
                                    data-target="#addZoneModal">
                                Adicionar bairro/zona
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                @if(!$companyDeliveryOrderConfig->callForAll)
                                    <th scope="col">Valor</th>
                                @endif
                                <th scope="col">Ativo</th>
                                <th scope="col">Apagar</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($companyDeliveryNeighborhoods as $companyDeliveryNeighborhood)
                                <tr>
                                    <td>{{ $companyDeliveryNeighborhood->name }}</td>
                                    @if(!$companyDeliveryOrderConfig->callForAll)
                                        <td>
                                            {{ formatMoney($companyDeliveryNeighborhood->price) ??
                                            formatMoney($companyDeliveryNeighborhood->deliveryPrice) }}
                                        </td>
                                    @endif
                                    <td>
                                        <div class="custom-control custom-switch">
                                            <input
                                                @if($companyDeliveryNeighborhood->active) checked @endif
                                            type="checkbox"
                                                class="custom-control-input toggle-activate-delivery"
                                                id="toggle-input-{{ $companyDeliveryNeighborhood->id }}"
                                                data-id="{{ $companyDeliveryNeighborhood->id }}"
                                                data-toggleLink="{{ $companyDeliveryNeighborhood->active ? route('zones.disable', $companyDeliveryNeighborhood) : route('zones.activate', $companyDeliveryNeighborhood) }}">
                                            <label class="custom-control-label"
                                                   for="toggle-input-{{ $companyDeliveryNeighborhood->id }}"></label>
                                        </div>
                                    </td>
                                    <td>
                                        <a class="btn btn-danger"
                                           href="#"
                                           onclick="event.preventDefault();document.getElementById('form-delete-{{ $companyDeliveryNeighborhood->id }}').submit()">
                                            <i class="far fa-trash-alt"></i></a>
                                    </td>
                                    <form action="{{ route('zones.delete', $companyDeliveryNeighborhood) }}"
                                          method="POST"
                                          id="form-delete-{{ $companyDeliveryNeighborhood->id }}">
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
                    {{ $companyDeliveryNeighborhoods->fragment('name')->links() }}
                </div>
            </div>
        </div>
    </div>
@stop
@section('js')
    <script src="{{ asset('js/libs/jquery.maskMoney.min.js') }}"></script>
    <script src="{{ asset('js/modules/config/create-zone.js') }}"></script>
    @if(!Session::has('alert.config'))
        <script src="{{ $cdn?? asset('vendor/sweetalert/sweetalert.all.js')  }}"></script>
    @endif
    <script>
        Mask.setMoneyField("price");

        elementProperty.addEventInElement('#form-new-zone', 'onsubmit', function (event) {
            event.preventDefault();

            document.querySelector('#price').value =
                Mask.removeMaskMoney(document.querySelector('#price').value);
            document.querySelector('#btn-submit').disabled = true;

            Preload.show();
            this.submit();
        });

        elementProperty.addEventInElement('#deliveryNeighborhoodId', 'onchange', function (event) {
            let deliveryNeighborhoods =
                JSON.parse(document.querySelector('#deliveryNeighborhoods').getAttribute('value'));

            const neighborhood = deliveryNeighborhoods.find(item => {
                return item.id == this.value;
            })

            document.querySelector('#price').value =
                Mask.maskMoney(neighborhood.deliveryPrice);
        });

        elementProperty.addEventInElement('.toggle-activate-delivery', 'onchange', function (event) {
            let formData = new FormData();
            formData.append('_token', "{{ csrf_token() }}");

            fetch(this.getAttribute('data-toggleLink'), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }

                    return response.json();
                })
                .then((result) => {
                    if (result.status) {
                        let activate = result.active ? "activate" : "disable";

                        this.setAttribute('data-toggleLink', `{{ url('zones') }}/${this.getAttribute('data-id')}/${activate}`);
                        Swal.fire({
                            toast: true,
                            title: "Zona atualizada com sucesso!",
                            icon: "success",
                            position: "top-right",
                            showCloseButton: true,
                            showConfirmButton: false,
                        });
                    }
                });
        });

        elementProperty.addEventInElement('#btn-search', 'onclick', function (event) {
            event.preventDefault();
            searchName();
        });

        elementProperty.addEventInElement('#input-search', 'onkeyup', function (event) {
            if (event.keyCode === 13)
                searchName();
        })

        function searchName() {
            location.href =
                "/{{ Route::getCurrentRoute()->uri }}?name=" + document.querySelector('#input-search').value;
        }

        Mask.setMoneyField(".class-mask-price");
    </script>
@endsection
