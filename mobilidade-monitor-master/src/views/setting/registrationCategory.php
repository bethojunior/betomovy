<div class="modal fade" id="addCategoryModal" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true" style="overflow-y: auto">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form id="formRegistrationCategory">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Adicionar Categoria de Cadastro</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="nameCategory">Nome</label>
                        <input type="text" class="form-control" id="nameCategory" aria-describedby="nameCategory"
                               placeholder="" required>
                    </div>
                    <div class="form-group">
                        <label for="fileIcon">Icone de apresentação</label>
                        <input type="file" class="form-control-file" id="fileIcon" required>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="isActive" checked>
                        <label class="form-check-label" for="isActive">
                            Ativar Categoria
                        </label>
                    </div>
                    <hr />
                    <p>Selecione um icone de exibição no mapa</p>
                        <div class="mt-3">
                            <div id="listIcons">
                            </div>
                            <div class="d-flex justify-content-center group-buttons">
                                <div class="button-add-icon">
                                     <button class="btn btn-secondary material-icons" id="addIconRegister" type="button" >add</button>
                                </div>
                                <div class="button-remove-icon">
                                    <button class="btn btn-danger material-icons" id="removeIconRegister" data-toggle="modal" data-target="#modal-remove-icon" type="button" >remove</button>
                                </div>
                            </div>
                        </div>
                    <?php if ($this->hasPermissionGroup(GroupConst::DELIVERY)) { ?>
                        <hr/>
                        <p class="mb-1">Exclusivo para:</p>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="isDeliveryman" id="typeMobility"
                                   value="0" checked>
                            <label class="form-check-label" for="typeMobility">
                                Mobilidade
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="isDeliveryman" id="typeDelivery"
                                   value="1">
                            <label class="form-check-label" for="typeDelivery">
                                Delivery
                            </label>
                        </div>
                    <?php } ?>
                    <hr /> 
                    <div class="form-group">
                        <label for="acceptedText">Mensagem depois de aceitar viagem</label>
                        <input type="text" class="form-control" id="acceptedText" aria-describedby="acceptedText"
                        placeholder="Seu motorista vai chegar em breve" required
                        >

                        <label for="boardingText">Mensagem de embarque</label>
                        <input type="text" class="form-control" id="boardingText" aria-describedby="boardingText"
                                placeholder="Seu carro está te aguardando" required>

                        <label for="inProgressText">Mensagem de Viagem em progresso</label>
                        <input type="text" class="form-control" id="inProgressText" aria-describedby="inProgressText"
                        placeholder="Seu carro está te aguardando" required>
                </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary" id="btnAddCategory">Adicionar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="editCategoryModal"  role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true" style="overflow-y: auto">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form id="formRegistrationCategoryEdit">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Atualizar Categoria</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="nameCategory">Nome</label>
                        <input type="text" class="form-control" id="nameCategoryEdit" aria-describedby="nameCategory"
                               placeholder="" required>
                    </div>
                    <div class="form-group">
                        <label for="fileIcon">Icone de apresentação</label>
                        <input type="file" class="form-control-file" id="fileIconEdit">
                    </div>

                    <hr />
                    <p>Selecione um icone de exibição no mapa</p>
                    <div class="mt-3">
                        <div id="listIconsEdit">
                        </div>
                        <div class="d-flex justify-content-center group-buttons">
                            <div class="button-add-icon">
                                <button class="btn btn-secondary material-icons" id="addIcon" type="button" >add</button>
                            </div>
                            <div  class="button-remove-icon">
                                <button class="btn btn-danger material-icons" id="removeIcon" data-toggle="modal" data-target="#modal-remove-icon" type="button" >remove</button>
                            </div>
                        </div>
                    </div>
                    <hr />

                    <div class="form-group">
                    <label for="acceptedTextEdit">Mensagem depois de aceitar viagem</label>
                        <input type="text" class="form-control" id="acceptedTextEdit" aria-describedby="acceptedText"
                        placeholder="Seu motorista vai chegar em breve" required
                        >

                        <label for="boardingTextEdit">Mensagem de embarque</label>
                        <input type="text" class="form-control" id="boardingTextEdit" aria-describedby="boardingText"
                                placeholder="Seu carro está te aguardando" required>

                        <label for="inProgressTextEdit">Mensagem de Viagem em progresso</label>
                        <input type="text" class="form-control" id="inProgressTextEdit" aria-describedby="inProgressText"
                        placeholder="Você está no percurso do seu destino" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary" id="btnEditCategory">Atualizar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div id="modal-add-icon" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar novo ícone</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>

            <div class="modal-body">
                <Label>Adicione icones PNG de tamanho 60(largura)x96(altura)</Label>
                <div class="form-group">
                    <input type="file" accept="image/png" id="upload" />
                    <img id="img"/>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btn-save-icon">Salvar</button>
            </div>
        </div>
    </div>
</div>


<div id="modal-remove-icon" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Remover Icone</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="mt-3">
                    <div id="listRemoveIcon">
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-danger" id="removeIconModal">Remover</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>