<div class="container-default-monitor container-city-add">
    <div class="container">
        <div class="dropdown ml-5">
            <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
                Configurações de Localidades
            </button>
            <div class="dropdown-menu p-4">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addCountryModal">
                    Cadastrar Nome do País
                </button>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addStateModal">
                    Cadastrar Nome do Estado
                </button>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addCityModal">
                    Cadastrar Nome da Cidade
                </button>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#removeCityModal">
                    Remover Cidade Ativa
                </button>
                <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#removeCityNameModal">
                    Apagar Nome de Cidade
                </button>
            </div>
        </div>
    </div>

    <div class="select-city d-flex justify-content-between">
        <div>
            <label for="country">País</label>
            <select class="custom-select" id="country">
                <option value="" disabled selected>Selecione um país</option>
            </select>
        </div>
        <div>
            <label for="estate">Estado</label>
            <select class="custom-select" id="estate">
                <option value="" disabled selected>Selecione um estado</option>
            </select>
        </div>
        <div>
            <label for="city">Cidade</label>
            <select class="custom-select" id="city">
                <option value="" disabled selected>Selecione uma cidade</option>
            </select>
        </div>
    </div>
    <button type="button" class="btn btn-sm btn-link float-right" id="linkModal" data-toggle="modal" data-target="#cityAreaModal" hidden>
        Procurar outra área
    </button>
    <div class="container-add-city">
        <div class="map-city"></div>
    </div>
    <div class="simulation-point-map">
        <button type="button" class="mt-2" id="savePolygon">Salvar</button>
    </div>
</div>

<div class="modal fade" id="cityAreaModal" tabindex="-1" aria-labelledby="areaModal" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Procurar por área</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label for="searchLocalText">Digite o nome do local</label>
                <div class="input-group is-invalid">
                    <div class="custom-file">
                        <input type="text" class="form-control" id="searchLocalText" required>
                    </div>
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" id="btnSearchLocal">Pesquisar</button>
                    </div>
                </div>
                <ul class="list-group" id="listOptionCity"></ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal-setting-city">
    <div>
        <h4 class="align-content-center">Replicar configuração de cidade</h4>
        <div>
            <label for="settingCity">Selecione uma cidade</label>
            <select class="custom-select" id="settingCity">
                <option value="" disabled selected>Selecione uma cidade</option>
            </select>
        </div>
        <hr/>
        <div>
            <button type="button" id="btnAllowSetting" class="btn btn-primary float-right">SIM</button>
            <button type="button" id="btnDeniedSetting" class="btn btn-secondary float-right">NÃO</button>
        </div>
    </div>
</div>
<div class="modal fade" id="removeCityModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="removeCityLabel">Remover Cidade</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="label">Cidade</label>
                    <select class="custom-select" required  id="cityID"></select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" id="removeCity" class="btn btn-primary">Remover</button>
            </div>
        </div>
    </div>
</div>

<!-- Adicionar Nome da Cidade -->
<div class="modal fade" id="addCityModal" tabindex="-1" aria-labelledby="cityModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addStateModalLabel">Cadastrar Nome da Cidade</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="countryIdSelect">Selecione um país</label>
                    <select class="form-control" id="countryIdSelect"></select>
                </div>

                <div class="form-group">
                    <label for="estateIdSelect">Selecione um estado</label>
                    <select class="form-control" id="estateIdSelect"></select>
                </div>

                <div class="form-group">
                    <label for="cityName">Nome da Cidade</label>
                    <input type="text" class="form-control" id="cityName" placeholder="Digite o nome da cidade" required>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" id="addCityName" class="btn btn-primary">Confirmar</button>
            </div>
        </div>
    </div>
</div>

<!-- Adicionar Nome do Estado -->
<div class="modal fade" id="addStateModal" tabindex="-1" aria-labelledby="stateModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addStateModalLabel">Cadastrar Nome do Estado</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="countrySelect2">Selecione um país</label>
                    <select class="form-control" id="countrySelect2"></select>
                </div>

                <div class="form-group">
                    <label for="stateName">Nome do Estado</label>
                    <input type="text" class="form-control" id="stateName" placeholder="Digite o nome do estado" required>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" id="addStateName" class="btn btn-primary">Confirmar</button>
            </div>
        </div>
    </div>
</div>

<!-- Adicionar Nome do País -->
<div class="modal fade" id="addCountryModal" tabindex="-1" aria-labelledby="countryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addCountryModal">Cadastrar Nome do País</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="label">Nome</label>
                    <label for="countryName"></label><input type="text" class="form-control" id="countryName" required>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" id="addCountryName" class="btn btn-primary">Confirmar</button>
            </div>
        </div>
    </div>
</div>

<!-- Adicionar Nome da Cidade -->
<div class="modal fade" id="removeCityNameModal" tabindex="-1" aria-labelledby="removeCityModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="removeCityModalLabel">Apagar Nome da Cidade</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="countryIdSelectRemoveCity">Selecione um país</label>
                    <select class="form-control" id="countryIdSelectRemoveCity"></select>
                </div>

                <div class="form-group">
                    <label for="estateIdSelectRemoveCity">Selecione um estado</label>
                    <select class="form-control" id="estateIdSelectRemoveCity"></select>
                </div>

                <div class="form-group">
                    <label for="cityIdSelectRemoveCity">Selecione a Cidade</label>
                    <select class="form-control" id="cityIdSelectRemoveCity"></select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" id="removeCityName" class="btn btn-primary">Confirmar</button>
            </div>
        </div>
    </div>
</div>