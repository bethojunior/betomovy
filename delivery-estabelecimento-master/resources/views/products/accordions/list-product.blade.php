@foreach($deliveryCategories as $category)

    <div class="card">
        <div class="card-header p-0">
            <div class="p-2">
                <h4>{{ $category->name }}</h4>
            </div>
        </div>
        <div class="card-body">

            <table class="table table-striped table-responsive-sm table-products">
                <colgroup>
                    <col span="1" style="width: 5%;">
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 50%;">
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 15%;">
                </colgroup>
                <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">Venda</th>
                    <th scope="col">Disponibilidade</th>
                    <th scope="col">Opções</th>
                </tr>
                </thead>
                <tbody>
                @foreach($category->products as $deliveryProduct)
                    <tr>
                        <td>
                            <div style="margin-top: 30%;" value="{{$deliveryProduct->id }}" class="item-order-selected">
                                <i class="fas fa-align-justify"></i>
                            </div>
                        </td>
                        <td>
                            <img
                                width="70"
                                height="70"
                                alt="imagem-produto"
                                class="img-thumbnail"
                                src="{{ $deliveryProduct->picture }}">
                        </td>
                        <td>{{ $deliveryProduct->name }}</td>
                        <td>{{ !$deliveryProduct->isOpenValue ? formatMoney($deliveryProduct->price) : "-" }}</td>
                        <td>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input change-active-product"
                                       id="activeSwitch{{$deliveryProduct->id}}"
                                       {{ (bool) $deliveryProduct->active ? "checked" : "true"  }} value="{{$deliveryProduct->id}}">
                                <label class="custom-control-label" for="activeSwitch{{$deliveryProduct->id}}"></label>
                            </div>
                        </td>
                        <td class="d-inline-block">
                            <div class="btn-group">
                                <button
                                    class="btn btn-info btn-sm edit-product"
                                    title="Editar item"
                                    data-link-product-data="{{ route('products.show', $deliveryProduct->id) }}"
                                    data-link-edit-product="{{ route('products.update', $deliveryProduct) }}">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                            </div>
                            <div class="btn-group">
                                <a href="#"
                                   class="btn btn-danger  btn-sm delete-product"
                                   data-id="{{ $deliveryProduct->id }}"
                                   title="Excluir item"
                                   onclick="">
                                    <i class="far fa-trash-alt"></i>
                                </a>
                            </div>
                            <div class="btn-group">
                                <button type="button"
                                        class="btn btn-info  btn-sm"
                                        data-id="{{ $deliveryProduct->id }}" title="Complementos"
                                        data-toggle="modal" data-target="#complementItemModal{{ $deliveryProduct->id }}"
                                >
                                    <i class="fas fa-list"></i>
                                </button>
                            </div>
                            <form
                                id="form-delete-{{ $deliveryProduct->id }}"
                                action="{{ route('products.delete', $deliveryProduct) }}"
                                method="POST">
                                @csrf
                                @method('DELETE')
                            </form>
                            <div class="modal fade" id="complementItemModal{{ $deliveryProduct->id }}" tabindex="-1"
                                 aria-labelledby="exampleModalLabel"
                                 aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Complementos</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            @foreach($deliveryProduct->deliveryGroupComplements as $deliveryGroupComplement)
                                                <ul class="list-group mb-2">
                                                    <li class="list-group-item active"
                                                        aria-current="true">{{ $deliveryGroupComplement->name }}</li>
                                                    @foreach($deliveryGroupComplement->deliveryComplements as $deliveryComplement)
                                                        <li class="list-group-item">{{$deliveryComplement->name}}</li>
                                                    @endforeach
                                                </ul>
                                            @endforeach
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endforeach
