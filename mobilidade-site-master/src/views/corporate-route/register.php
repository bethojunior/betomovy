<div class="d-flex flex-column h-100 w-100 absolute">
    <nav class="navbar navbar-light bg-light">
        <a class="navbar-brand" href="#">
            Empresa
        </a>
    </nav>
    <div class="flex-fill">
        <div class="row d-flex flex-fill h-100 p-0 m-0">
            <div class="col-lg-7 bg-image d-sm-none d-md-none d-lg-block p-0">
                <div class="content-image-text">
                    <h3 class="center d-flex-none text-white p-0 mt-4">Rotas corporativo</h3>
                </div>
            </div>
            <div class="col-12 col-lg-5 p-0">
                <form   method="POST" id="company-form">
                    <div class="col-lg-12 scroll">
                        <div id="data-user" class="col-lg-12">
                            <div class="form-group">
                                <h4 class="mt-2 mb-2">Dados do responsável</h4>
                                <div class="form-row">
                                    <div class="form-group col-md-6 mb-1">
                                        <input type="text"
                                               class="form-control"
                                               id="name-user"
                                               placeholder="Nome" name="user[name]">
                                    </div>
                                    <div class="form-group col-md-6 mb-1">
                                        <input type="text"
                                               class="form-control"
                                               id="surname-user"
                                               placeholder="Sobrenome" name="user[surname]">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <input type="email"
                                           class="form-control  mb-1"
                                           id="email-user"
                                           placeholder="E-mail" name="user[email]">
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-lg-6">
                                        <input type="tel"
                                               class="form-control  mb-1 numberphone"
                                               id="phone-user"
                                               placeholder="Telefone" name="user[phone]">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6  mb-1">
                                        <input type="password"
                                               class="form-control"
                                               id="password"
                                               placeholder="Senha" name="user[password]">
                                    </div>
                                    <div class="form-group col-md-6  mb-1">
                                        <input type="password" class="form-control" id="passwordConfirm"
                                               placeholder="Confirmar senha">
                                    </div>
                                </div>
                                <hr/>
                                <div class="form-group">
                                    <input type="text"
                                           class="form-control"
                                           id="nameFantasy"
                                           placeholder="Nome fantasia" name="fantasyName">
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="documentCompany">Documento</label>
                                        <input type="text"
                                               class="form-control document"
                                               id="documentCompany"
                                               placeholder="CNPJ ou CPF"  name="document">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="cityIdSelected">Cidade</label>
                                        <select class="form-control" id="cityIdSelected">
                                            <option value="" selected disabled>Selecione a cidade de atuação</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" id="next-page-web" class="btn btn-primary w-100 mb-2">
                                Próximo
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>