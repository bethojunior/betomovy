<div class="row generalDelivery">
    <div class="container bg-light m-2">
        <button type="button" class="btn btn-danger mb-2 mt-2" data-toggle="modal" data-target="#addCompanyModal">
            Adicionar estabelecimento
        </button>
    <div class="table-responsive">
        <table class="table mt-2">
                <thead>
                <tr>
                    <th>Empresa</th>
                    <th></th>
                    <th>CNPJ</th>
                    <th>Delivery</th>
                    <th>Menu</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="listCompanyDelivery"></tbody>
            </table>
    </div>
    </div>
</div>
<div class="modal fade" id="addCompanyModal" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Adicionar estabelecimento</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="content-logo-company" id="insertLogo">
                        <input type="file" id="pictureCompany" />
                    </div>
                    <div class="form-group">
                        <label for="formGroupExampleInput" class="small">Para vincular uma empresa ela deve ser
                            cadastrada antes como
                            PJ</label>
                        <select id="getEnterprisesByDelivery" class="custom-select"></select>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="releaseMenuCheck">
                        <label class="form-check-label" for="releaseMenuCheck">
                            Liberar cardapio
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="releaseDeliveryCheck">
                        <label class="form-check-label" for="releaseDeliveryCheck">
                            Liberar entregas do estabelecimento
                        </label>
                    </div>
                    <hr/>
                    <div class="form-group">
                        <label for="exampleFormControlSelect1">Perfis de cobrança</label>
                        <select class="form-control" id="selectChargeType">
                            <option value="0" disabled selected>Selecione o perfil</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="btnAddCompanyDelivery">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="modal fade" id="editCompanyModal" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Editar estabelecimento</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="content-logo-company" id="insertLogoEdit">
                        <input type="file" id="pictureCompanyEdit" />
                    </div>
                    <p id="nameCompanyEdit"></p>
                    <p id="documentCompanyEdit"></p>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="releaseMenuCheckEdit">
                        <label class="form-check-label" for="releaseMenuCheckEdit">
                            Liberar cardapio
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="releaseDeliveryCheckEdit">
                        <label class="form-check-label" for="releaseDeliveryCheckEdit">
                            Liberar entregas do estabelecimento
                        </label>
                    </div>
                    <hr/>
                    <div class="form-group">
                        <label for="exampleFormControlSelect1">Perfis de cobrança</label>
                        <select class="form-control" id="selectChargeTypeEdit">
                            <option value="0" disabled selected>Selecione o perfil</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="btnEditCompanyDelivery">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>
<div class="modal fade" id="listLocalCompanyModal" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Locais</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <ul class="list-group" id="listAddressCompanyDelivery"></ul>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#addLocalCompanyModal">Adicionar</button>
                </div>
            </div>
        </form>
    </div>
</div>
<div class="modal fade" id="addLocalCompanyModal" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Buscar local</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="searchPlaceCompany">Pesquise o local</label>
                        <input type="search" class="form-control" id="searchPlaceCompany">
                    </div>
                    <ul id="listSearchInputCompany" style="max-height: 300px;overflow-y: auto;">
                    </ul>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="checkDefaultLocal">
                        <label class="form-check-label" for="checkDefaultLocal">
                            Principal
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="btnAddLocalCompanyDelivery">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>