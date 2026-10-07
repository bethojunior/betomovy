<div class="container-default-monitor">
    <div class="container">
        <div class="accordion" id="accordionExample">
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne"
                                aria-expanded="true" aria-controls="collapseOne">
                            Tipos de chamado
                        </button>
                    </h2>
                </div>

                <div id="collapseOne" class="collapse" aria-labelledby="headingOne"
                     data-parent="#accordionExample">
                    <div class="card-body">
                        <button type="button" class="btn btn-primary mb-2"
                                data-toggle="modal" data-target="#addTripTypeModal">Adicionar tipo de chamado
                        </button>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                <tr>
                                    <td>Logo</td>
                                    <td>Tipo</td>
                                    <td>Descrição</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                </thead>
                            <tbody id="listTripType"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'categoria_cadastro')) { ?>
                <div class="card">
                    <div class="card-header" id="headingTwo">
                        <h2 class="mb-0">
                            <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                                    data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Tipos de motorista
                            </button>
                        </h2>
                    </div>
                    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div class="card-body">
                            <button type="button" class="btn btn-primary mb-2" data-toggle="modal"
                                    data-target="#addCategoryModal">
                                Adicionar Categoria
                            </button>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Descrição</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Ativar</th>
                                        <th scope="col"></th>
                                    </tr>
                                    </thead>
                                    <tbody id="listCategory"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            <?php } ?>
            <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'vincular_motorista_chamado')) { ?>

                <div class="card">
                    <div class="card-header" id="headingThree">
                        <h2 class="mb-0">
                            <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                                    data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Vincular chamado x motorista
                            </button>
                        </h2>
                    </div>
                    <div id="collapseThree" class="collapse" aria-labelledby="headingThree"
                         data-parent="#accordionExample">
                        <div class="card-body">
                            <button type="button" id="btnNextStepTripType" class="btn btn-link mb-2" hidden>Continuar
                            </button>
                            <div class="row">
                                <div class="col-lg-6 form-group">
                                    <label for="calledTypeSelect">Tipo de chamado</label>
                                    <select class="form-control" id="calledTypeSelect"></select>
                                </div>

                            </div>
                            <div id="formSelected" style="display: none">
                                <ul class="list-group" id="listDrivers">
                                    <li class="list-group-item active">Tipos de motorista</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            <?php } ?>
            <div class="card">
                <div class="card-header" id="headingFour">
                    <h2 class="mb-0">
                        <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                                data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                            Informações sobre tipos de viagens
                        </button>
                    </h2>
                </div>
                <div id="collapseFour" class="collapse" aria-labelledby="headingFour"
                     data-parent="#accordionExample">
                    <div class="card-body">
                        <div class="col-lg-4 form-group">
                            <label for="input0title">Titulo</label>
                            <input class="form-control" id="input0title" placeholder="">
                        </div>
                        <div class="col-lg-4 form-group">
                            <label for="description-input">Descrição</label>
                            <input class="form-control" id="description-input" placeholder="">
                        </div>
                        <div class="col-12">
                            <button id="send-about-trips" class="btn btn-primary">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="addTripTypeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addTripTypeModal">Adicionar Chamado</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="nameTripType">Nome</label>
                        <input type="text" class="form-control" id="nameTripType">
                    </div>
                    <div class="form-group">
                        <label for="descriptionTripType">Descrição</label>
                        <textarea class="form-control" id="descriptionTripType" rows="3"
                                  style="resize: none"></textarea>
                    </div>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="iconTripType"
                               accept="image/gif, image/jpeg, image/png">
                        <label class="custom-file-label" for="iconTripType">Selecione um icone</label>
                    </div>
                    <div class="form-group mt-2">
                        <img id="iconTripTypePreview" class="w-25 d-block m-auto" height="100">
                    </div>
                    <hr/>
                    <h5 class="m-0">Opções de chamado</h5>
                    <hr/>
                    <div class="form-group">
                        <label for="genderSelect" class="font-weight-bold">Selecione o gênero para esse tipo de
                            chamado</label>
                        <select class="form-control" id="genderSelect"></select>
                    </div>
                    <label class="font-weight-bold">Selecione a categoria do chamado</label>
                    <?php if ($this->hasPermission(GroupConst::ENTREGA, 'adicionar_chamado_entrega')) { ?> 
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="deliveryOptionCheck">
                            <label class="form-check-label" for="deliveryOptionCheck">
                                Entrega
                            </label>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FRETE, 'adicionar_chamado_frete')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="freightOptionCheck">
                            <label class="form-check-label" for="freightOptionCheck">
                                Frete
                            </label>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CENTRAL, 'central_listagem')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="onlyCentralOptionCheck">
                            <label class="form-check-label" for="onlyCentralOptionCheck">
                                Central
                            </label>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'criar_chamado_sem_destino')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value=""
                                   id="createTargetlessCallOptionCheck">
                            <label class="form-check-label" for="createTargetlessCallOptionCheck">
                                Chamada com preço em aberto
                            </label>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::VIAGEM, 'tipo_viagem_por_ofertar')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value=""
                                   id="offerOptionCheck">
                            <div class="d-flex align-items-center justify-content-between">
                                <label class="form-check-label" for="offerOptionCheck">
                                    Viagem por oferta
                                </label>
                                <i class="material-icons" data-toggle="tooltip" data-placement="top" style="font-size: 14pt"
                                   title="Essa opção faz com que o cliente e motorista possam combinar o valor da viagem">
                                    info
                                </i>
                            </div>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::TOTEM, 'habilitar_totem')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="totemOptionCheck">
                            <div class="d-flex align-items-center justify-content-between">
                                <label class="form-check-label" for="totemOptionCheck">
                                    Viagem totem
                                </label>
                                <i class="material-icons" data-toggle="tooltip" data-placement="top" style="font-size: 14pt"
                                title="Essa opção ativa o modo totem para a viagem, permitindo solicitação direta via terminal físico.">
                                    info
                                </i>
                            </div>
                        </div>
                    <?php } ?>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value=""
                            id="inputCheckTypeServices">
                        <label class="form-check-label" for="inputCheckTypeServices">
                            Serviços
                        </label>
                    </div>
                    <label class="mt-2 font-weight-bold">Insira uma frase para ser mostrada quando não houver motoristas
                        disponíveis</label>
                    <input class="form-control" id="phraseTripType"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="addNewTrip">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>
<div class="modal fade" id="editTripTypeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editTripTypeModal">Editar Chamado</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="nameTripTypeEdit">Nome</label>
                        <input type="text" class="form-control" id="nameTripTypeEdit">
                    </div>
                    <div class="form-group">
                        <label for="descriptionTripTypeEdit">Descrição</label>
                        <textarea class="form-control" id="descriptionTripTypeEdit" rows="3"
                                  style="resize: none"></textarea>
                    </div>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="iconTripTypeEdit">
                        <label class="custom-file-label" for="iconTripType">Selecione um icone</label>
                    </div>
                    <div class="form-group mt-2">
                        <img id="iconTripTypeEditPreview" class="w-25 d-block m-auto" height="100">
                    </div>
                    <hr/>
                    <h5 class="m-0">Opções de chamado</h5>
                    <hr/>
                    <div class="form-group">
                        <label for="genderSelectEdit" class="font-weight-bold">Selecione o gênero para esse tipo de
                            chamado</label>
                        <select class="form-control" id="genderSelectEdit"></select>
                    </div>
                    <div>
                        <label class="font-weight-bold">Selecione a categoria do chamado:</label>
                        <b class="text-danger">AVISO IMPORTANTE<i class="material-icons ml-2" data-toggle="tooltip" data-placement="top" style="font-size: 14pt"
                                           title="Ao selecionar uma das opções abaixo, lembre-se de que a categoria
                                           correspondente poderá desaparecer temporariamente da aplicação de passageiro.
                                           Isso ocorre porque algumas categorias são direcionadas para módulos ou
                                           funcionalidades específicas, o que pode resultar na sua
                                           indisponibilidade na tela de escolha de categoria e preços.">
                            info
                        </i></b>
                    </div>
                    <?php if ($this->hasPermission(GroupConst::ENTREGA, 'adicionar_chamado_entrega')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="deliveryOptionCheckEdit">
                            <label class="form-check-label" for="deliveryOptionCheckEdit">
                                Entrega
                            </label>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FRETE, 'adicionar_chamado_frete')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="freightOptionCheckEdit">
                            <label class="form-check-label" for="freightOptionCheckEdit">
                                Frete
                            </label>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CENTRAL, 'central_listagem')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="onlyCentralOptionCheckEdit">
                            <label class="form-check-label" for="onlyCentralOptionCheckEdit">
                                Central
                            </label>
                            <i class="material-icons" data-toggle="tooltip" data-placement="top" style="font-size: 14pt"
                               title="Essa opção fará com que a categoria seja ocultada no aplicativo de passageiro e estará disponível apenas na central de chamados.">
                                info
                            </i>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'criar_chamado_sem_destino')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="targetLessCallOptionCheckEdit">
                            <label class="form-check-label" for="targetLessCallOptionCheckEdit">
                                Chamada com preço em aberto
                            </label>
                            <i class="material-icons" data-toggle="tooltip" data-placement="top" style="font-size: 14pt"
                               title="Ao selecionar essa opção a categoria desaparecerá temporariamente da tela de escolha de categoria e preços, sendo visível somente quando estiver adicionando um endereço durante uma Viagem sem destino.">
                                info
                            </i>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::VIAGEM, 'tipo_viagem_por_ofertar')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value=""
                                   id="offerOptionCheckEdit">
                            <div class="d-flex align-items-center justify-content-between">
                                <label class="form-check-label" for="offerOptionCheckEdit">
                                    Viagem por oferta
                                </label>
                                <i class="material-icons" data-toggle="tooltip" data-placement="top" style="font-size: 14pt"
                                   title="Essa opção faz com que o cliente e motorista possam combinar o valor da viagem">
                                    info
                                </i>
                            </div>
                        </div>
                    <?php } ?>
                    <?php if (!$this->hasPermission(GroupConst::TOTEM, 'habilitar_totem')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="totemOptionCheckEdit">
                            <div class="d-flex align-items-center justify-content-between">
                                <label class="form-check-label" for="totemOptionCheckEdit">
                                    Viagem totem
                                </label>
                                <i class="material-icons" data-toggle="tooltip" data-placement="top" style="font-size: 14pt"
                                title="Essa opção ativa o modo totem para a viagem, permitindo solicitação direta via terminal físico.">
                                    info
                                </i>
                            </div>
                        </div>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'adicionar_tipo_servicos')) { ?>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value=""
                                id="inputCheckTypeServicesEdit">
                            <label class="form-check-label" for="inputCheckTypeServicesEdit">
                                Serviços
                            </label>
                        </div>
                    <?php } ?>
                    <label class="mt-2 font-weight-bold">Insira uma frase para ser mostrada quando não houver motoristas
                        disponíveis</label>
                    <input class="form-control" id="phraseTripTypeEdit"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="editNewTrip">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="modal" tabindex="-1" id="modalChangeTypeDrive">
    <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body">
                <p class="text-justify">Selecione o novo tipo de motorista</p>
                <select class="form-control select-new-type">
                    <option value="">Selecionar</option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary btn-sm btn-save-new-type">Salvar</button>
            </div>
        </div>
    </div>
</div>