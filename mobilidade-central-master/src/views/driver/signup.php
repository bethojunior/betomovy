<div class="container-main container-signup">
    <div class="sp-page">

        <div class="sp-page-header">
            <a href="/driver/list" class="sp-back" title="Voltar">
                <i class="material-icons">arrow_back</i>
            </a>
            <div class="sp-page-header__info">
                <h1 class="sp-page-title">Cadastro de motorista</h1>
                <span class="sp-page-subtitle" id="spStepLabel">Selecione a categoria</span>
            </div>
        </div>

        <form>

            <div class="group-signup all-size active" value="TYPE_DRIVER">
                <div class="sp-type-wrapper">
                    <p class="sp-type-intro">Selecione a categoria de atuação do motorista</p>
                    <ul id="listUserType" class="sp-type-list"></ul>
                </div>
            </div>

            <div class="group-signup all-size" value="PERSONAL_DATA">
                <div class="sp-form-wrapper">
                    <div class="sp-form">

                        <div class="sp-field">
                            <label class="sp-label" for="name">Nome completo</label>
                            <input type="text" name="name" id="name" class="form-control sp-input" placeholder="Nome completo">
                        </div>

                        <div class="sp-row">
                            <div class="sp-field">
                                <label class="sp-label" for="gender">Gênero</label>
                                <select id="gender" class="form-control sp-input">
                                    <option value="" disabled selected>Selecione</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="feminino">Feminino</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>
                        </div>

                        <div class="sp-row">
                            <div class="sp-field container-preload-email">
                                <label class="sp-label" for="email">E-mail</label>
                                <input type="email" name="email" id="email" placeholder="exemplo@email.com" class="form-control sp-input">
                            </div>
                            <div class="sp-field">
                                <label class="sp-label" for="phone">Telefone</label>
                                <input type="tel" name="phone" id="phone" placeholder="(00) 99999-9999" class="form-control sp-input">
                            </div>
                        </div>

                    </div>
                    <div class="sp-actions">
                        <button type="button" class="btn btn-primary btn-next-step sp-btn-next">Próximo</button>
                    </div>
                </div>
            </div>

            <div class="group-signup all-size" value="COMPANY" id="groupReturnDriver">
                <div class="sp-form-wrapper">
                    <div class="sp-form">
                        <div class="sp-row">
                            <div class="sp-field">
                                <label class="sp-label" for="ufWork">Estado</label>
                                <select id="ufWork" class="form-control sp-input"></select>
                            </div>
                            <div class="sp-field">
                                <label class="sp-label" for="cityWork">Cidade de trabalho</label>
                                <select id="cityWork" class="form-control sp-input">
                                    <option value="" disabled selected>Selecione a cidade</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="sp-actions">
                        <button class="btn btn-primary btn-next-step sp-btn-next" type="button">Próximo</button>
                    </div>
                </div>
            </div>

            <div class="group-signup all-size" value="DOCUMENT_CNH">
                <div class="sp-form-wrapper">
                    <div class="sp-form">
                        <div class="sp-field">
                            <label class="sp-label" for="numberCNH">Número da CNH</label>
                            <input type="tel" id="numberCNH" class="form-control sp-input" placeholder="Número da carteira de motorista">
                        </div>
                        <div class="sp-doc-upload open-modal-document" value="CNH">
                            <input type="file" class="file-image-driver" typeImage="CNH">
                            <div class="sp-doc-upload__info">
                                <i class="material-icons sp-doc-upload__icon">insert_drive_file</i>
                                <span>Foto da CNH</span>
                            </div>
                            <i class="material-icons sp-doc-upload__arrow">chevron_right</i>
                        </div>
                        <img id="imgPreviewCNH" class="sp-img-preview img-thumbnail img-preview-document">
                    </div>
                    <div class="sp-actions">
                        <button class="btn btn-primary btn-next-step sp-btn-next" type="button">Próximo</button>
                    </div>
                </div>
            </div>

            <div class="group-signup all-size" value="DOCUMENT_CRLV">
                <div class="sp-form-wrapper">
                    <div class="sp-form">

                        <div class="sp-row">
                            <div class="sp-field">
                                <label class="sp-label" for="markCar">Marca</label>
                                <input id="markCar" class="form-control sp-input" placeholder="Ex: Toyota">
                            </div>
                            <div class="sp-field">
                                <label class="sp-label" for="modelCar">Modelo</label>
                                <input id="modelCar" class="form-control sp-input" placeholder="Ex: Corolla">
                            </div>
                        </div>

                        <div class="sp-row">
                            <div class="sp-field">
                                <label class="sp-label" for="licensePlate">Placa</label>
                                <input type="text" id="licensePlate" class="form-control sp-input" placeholder="ABC-1D23">
                            </div>
                            <div class="sp-field">
                                <label class="sp-label" for="renavam">Renavam</label>
                                <input type="tel" id="renavam" class="form-control sp-input" placeholder="Número do Renavam">
                            </div>
                        </div>

                        <div class="sp-row sp-row--3">
                            <div class="sp-field">
                                <label class="sp-label" for="colorCar">Cor</label>
                                <select id="colorCar" class="form-control sp-input">
                                    <option value="" disabled selected>Selecione</option>
                                    <option value="Branco">Branco</option>
                                    <option value="Prata">Prata</option>
                                    <option value="Preto">Preto</option>
                                    <option value="Cinza">Cinza</option>
                                    <option value="Vermelho">Vermelho</option>
                                    <option value="Azul">Azul</option>
                                    <option value="Verde">Verde</option>
                                    <option value="Bege">Bege</option>
                                    <option value="Marrom">Marrom</option>
                                    <option value="Dourado/Amarelo">Dourado/Amarelo</option>
                                    <option value="Laranja">Laranja</option>
                                </select>
                            </div>
                            <div class="sp-field">
                                <label class="sp-label" for="numberSeatingCar">Assentos</label>
                                <input type="number" id="numberSeatingCar" min="4" max="10" value="4" class="form-control sp-input">
                            </div>
                            <div class="sp-field">
                                <label class="sp-label" for="yearCar">Ano</label>
                                <input type="text" id="yearCar" class="form-control sp-input" placeholder="2020">
                            </div>
                        </div>

                        <div class="sp-field">
                            <label class="sp-label" for="numberCRLV">Número do documento (CRLV)</label>
                            <input type="tel" id="numberCRLV" class="form-control sp-input" placeholder="Número do documento do carro">
                        </div>

                        <div class="sp-doc-upload open-modal-document" value="CRLV">
                            <input type="file" class="file-image-driver" typeImage="CRLV">
                            <div class="sp-doc-upload__info">
                                <i class="material-icons sp-doc-upload__icon">directions_car</i>
                                <span>Foto da CRLV</span>
                            </div>
                            <i class="material-icons sp-doc-upload__arrow">chevron_right</i>
                        </div>
                        <img id="imgPreviewCRLV" class="sp-img-preview img-thumbnail img-preview-document">

                    </div>
                    <div class="sp-actions">
                        <button class="btn btn-primary btn-next-step sp-btn-next" type="button">Próximo</button>
                    </div>
                </div>
            </div>

            <div class="group-signup all-size" value="DOCUMENT_ALVARA">
                <div class="sp-form-wrapper">
                    <div class="sp-form">
                        <div class="sp-field">
                            <label class="sp-label" for="numberAlvara">Número do ALVARÁ</label>
                            <input type="tel" id="numberAlvara" class="form-control sp-input" placeholder="Número do ALVARÁ">
                        </div>
                        <div class="sp-doc-upload open-modal-document" value="ALVARA">
                            <input type="file" class="file-image-driver" typeImage="ALVARA">
                            <div class="sp-doc-upload__info">
                                <i class="material-icons sp-doc-upload__icon">article</i>
                                <span>Foto do ALVARÁ / CONDUAPP</span>
                            </div>
                            <i class="material-icons sp-doc-upload__arrow">chevron_right</i>
                        </div>
                        <img id="imgPreviewALVARA" class="sp-img-preview img-thumbnail img-preview-document">
                        <label class="sp-checkbox">
                            <input type="checkbox" id="hasCardReader">
                            <span>Possui máquina de cartão?</span>
                        </label>
                    </div>
                    <div class="sp-actions">
                        <button class="btn btn-primary btn-next-step sp-btn-next" type="button">Próximo</button>
                    </div>
                </div>
            </div>

            <div class="group-signup all-size" value="DOCUMENT_CRIMINAL_RECORD">
                <div class="sp-form-wrapper">
                    <div class="sp-notice">
                        Solicite o atestado de antecedentes criminais,&nbsp;<a id="openLinkAtestado">clique aqui</a>. Tire uma foto e preencha o formulário abaixo.
                    </div>
                    <div class="sp-form">
                        <div class="sp-field">
                            <label class="sp-label" for="numberCriminalRecord">Número do atestado</label>
                            <input type="number" id="numberCriminalRecord" class="form-control sp-input" placeholder="Número do atestado">
                        </div>
                    </div>
                    <div class="sp-actions">
                        <button class="btn btn-primary btn-next-step sp-btn-next" type="button">Próximo</button>
                    </div>
                </div>
            </div>

            <div class="group-signup all-size" value="PROFILE_IMAGE">
                <div class="sp-form-wrapper sp-form-wrapper--center">
                    <div class="sp-avatar-wrapper">
                        <div class="profile-driver-preview sp-avatar" id="imgPreviewPROFILE">
                            <input type="file" id="btnCaptureProfile" typeImage="PROFILE">
                            <div class="sp-avatar__cam">
                                <i class="material-icons" value="PROFILE">camera_alt</i>
                            </div>
                        </div>
                        <p class="sp-profile-hint">Toque para adicionar uma foto de perfil</p>
                    </div>
                    <div class="sp-actions sp-actions--center">
                        <button class="btn btn-primary btn-next-step sp-btn-next" type="button">Próximo</button>
                    </div>
                </div>
            </div>

            <div class="group-signup-finish">
                <div class="sp-finish">
                    <div class="sp-finish__icon">
                        <i class="material-icons">check_circle</i>
                    </div>
                    <h2 class="sp-finish__title">Cadastro realizado!</h2>
                    <p class="sp-finish__text">O cadastro do motorista foi realizado com sucesso. Todas as informações são de responsabilidade do usuário logado.</p>
                    <button class="sp-btn-finish finish-form" type="button">Ir para lista de motoristas</button>
                </div>
            </div>

        </form>

        <div class="sp-preload-center">
            <img src="<?php echo Host::getLocal() ?>webfiles/img/icon/pre-load.gif" class="preload-return">
        </div>

    </div>
</div>
<button class="btn-next-signup bottom-button" type="button">PRÓXIMO</button>
