<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" role="dialog">
    <form
        action="{{ route('products.store') }}"
        method="POST"
        enctype="multipart/form-data"
        id="form-product">
        @csrf
        <div class="modal-dialog  modal-xl modal-dialog-scrollable">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Cadastro de produto</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="alertRequired" class="alert alert-warning" role="alert" hidden>
                        Atenção, informe dados obrigatórios
                    </div>
                    <div id="inputUpdate">

                    </div>
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab"
                               aria-controls="home"
                               aria-selected="true">Detalhes do produto</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                               aria-controls="profile"
                               aria-selected="false">Complementos</a>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <input type="hidden" name="companyId"
                                   value="{{ Auth::user()->companyWorker->companyId }}">
                            <div class="col-lg-12">
                                <div class="row">
                                    <div class="col-lg-12 col-sm-12">
                                        <div class="form-row mt-2">
                                            <div class="form-row col-lg-5 col-md-12 col-sm-12">
                                                {{--<img id="thumbnail" class="img-thumbnail"
                                                     data-pictureDefault="{{ asset('assets/images/icons/default.jpg') }}"
                                                     src="{{ asset('assets/images/icons/default.jpg') }}">--}}
                                                <div class="img-banner-product" id="thumbnail"></div>
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <div class="custom-file">
                                                            <input
                                                                type="file"
                                                                class="custom-file-input @if($errors->has('picture')) is-invalid @endif"
                                                                id="image-product"
                                                                name="picture" required>
                                                            <label class="custom-file-label"
                                                                   for="image-product">
                                                                Enviar imagem
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-7 col-sm-12">
                                                <div class="form-group col-lg-6 col-sm-12">
                                                    <label for="name">Nome</label>
                                                    <input
                                                        type="text"
                                                        class="form-control @if($errors->has('name')) is-invalid @endif"
                                                        id="name" required
                                                        name="name"
                                                        value="{{ old('name') }}">
                                                </div>
                                                <div class="row col-lg-12">
                                                    <div class="form-group col-md-6">
                                                        <label for="category">Categoria</label>
                                                        <select
                                                            id="category"
                                                            class="form-control @if($errors->has('deliveryCategoryId')) is-invalid @endif"
                                                            name="deliveryCategoryId" required>
                                                            <option value="" selected>Escolha</option>
                                                            @foreach($deliveryCategories as $deliveryCategory)
                                                                <option value="{{ $deliveryCategory->id }}"
                                                                        @if($errors->has('deliveryCategoryId') &&
                                                                            $deliveryCategory->id == old('deliveryCategoryId'))
                                                                        selected="selected"
                                                                    @endif>
                                                                    {{ $deliveryCategory->name }}
                                                                </option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-lg-12">
                                                <label for="description">Descrição</label>
                                                <input
                                                    id="description"
                                                    class="form-control @if($errors->has('description')) is-invalid @endif"
                                                    value="{{ old('description') }}" name="description">
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-3">
                                                <label for="price-sale">Preço de custo</label>
                                                <input
                                                    type="number"
                                                    class="form-control class-mask-price @if($errors->has('costPrice')) is-invalid @endif mask-money"
                                                    id="price-sale" name="costPrice" placeholder=""
                                                    required
                                                    value="{{ old('costPrice') }}">
                                            </div>
                                            <div class="form-group col-md-3">
                                                <label for="real-price">Preço de venda</label>
                                                <input
                                                    type="number"
                                                    class="form-control class-mask-price @if($errors->has('price')) is-invalid @endif mask-money"
                                                    required
                                                    id="real-price" name="price" value="{{ old('price') }}">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" name="isOpenValue" id="isOpenValueCheck">
                                                        <label class="form-check-label" for="isOpenValueCheck">
                                                            <small>Valor a partir de (Valor será baseado nos complementos selecionados)</small>
                                                        </label>
                                                    </div>
                                            </div>
                                            <div class="form-group col-md-3">
                                                <label for="time-read">Tempo de preparo(minutos)</label>
                                                <input
                                                    type="number"
                                                    class="form-control @if($errors->has('preparationTime')) is-invalid @endif text-align-right"
                                                    id="time-read" name="preparationTime" placeholder=""
                                                    required
                                                    value="{{ old('preparationTime') }}">
                                            </div>
                                            <div class="form-group col-md-3">
                                                <div class="justify-content-center">
                                                    <label for="" hidden>Frete grátis &nbsp;</label>
                                                    <div class="custom-control custom-switch ml-lg-3">
                                                        <input type="checkbox" name="freeDelivery"
                                                               class="custom-control-input"
                                                               id="freeDelivery" hidden>
                                                        <label class="custom-control-label" for="freeDelivery" hidden></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {{--                                    <div class="col-lg-4 col-sm-12">--}}
                                    {{--                                        <div class="d-flex justify-content-center">--}}
                                    {{--                                            <img class="img-fluid pad" width="188vw"--}}
                                    {{--                                                 src="{{ asset('assets/images/icons/iphone.png') }}">--}}
                                    {{--                                        </div>--}}
                                    {{--                                    </div>--}}
                                </div>
                            </div>

                        </div>
                        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div class="col-lg-12 mt-3">
                                <a href="#"
                                   class="btn btn-link"
                                   id="add-group-complement">
                                    <i class="fas fa-plus"></i> Categoria
                                </a>
                                <div id="listComplements"></div>
                                <input type="hidden" name="complements" id="complements" value="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="btn-save-product">Salvar</button>
                </div>

            </div>
        </div>
    </form>
</div>
@include('modals.products.optional')
