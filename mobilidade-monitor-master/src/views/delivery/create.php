<div class="general-register">
    <!-- Image and text -->
    <div class="web">
        <nav class="col-lg-12 navbar navbar-light bg-light">
            <a class="navbar-brand" href="#">
                <img src="" width="30" height="30" class="logo-aplication d-inline-block align-top" alt="" loading="lazy">
                <?=Host::NAME_APPLICATION?>
            </a>
        </nav>
        <div class="row col-lg-12">
            <div class="col-lg-5 first">
                <div class="">
                    <h3 class="center">Vamos conversar?</h3>
                    <p class="center">Deixe seus dados para entrarmos em contatoe te contar mais sobre nós</p>
                </div>
            </div>
            <div class="col-lg-7">
                <div class="col-lg-12 scroll">
                    <div style="margin-top: 1vw" id="data-user" class="col-lg-12">
                        <div class="form-group">
                            <div class="">
                                <h4>Dados do resposável</h4>
                            </div>
                            <div class="form-group">
                                <div class="row col-lg-12" style="margin: 0;padding: 0">
                                    <div class="form-group col-lg-8" style="margin: 0;padding: 0">
                                        <input id="name-user" placeholder="Nome do responsável" class="form-control mt-05 col-lg-12">
                                    </div>
                                    <div class="form-group col-lg-4" style="margin: 0;padding: 0">
                                        <input id="second-name-user" placeholder="Sobrenome" class="form-control mt-05 col-lg-12">
                                    </div>
                                    <input id="email-user" placeholder="Email do responsável" class="form-control mt-05 col-lg-12">
                                    <input id="phone-user" placeholder="Telefone do responsável" class="form-control numberphone mt-05 col-lg-12">
                                    <div class="form-group col-lg-6 relative" style="margin: 0;padding: 0">
                                        <input type="password" id="password-user" placeholder="Senha" class="form-control mt-05 col-lg-12">
                                        <i class="material-icons iconAbsolute">visibility</i>
                                    </div>
                                    <div class="form-group col-lg-6 relative" style="margin: 0;padding: 0">
                                        <input type="password" id="second-password-user" placeholder="Senha" class="form-control mt-05 col-lg-12">
                                        <i class="material-icons iconAbsolute">visibility</i>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <button id="next-page-web" class="col-lg-12 btn btn-primary">Próximo</button>
                    </div>
                    <div class="col-lg-12 enterprise-data">
                        <div class="form-group" style="margin-top: 0.5vw">
                            <h3>Dados do estabelecimento</h3>
                            <input placeholder="Nome" class="form-control mt-05">
                            <input type="tel" placeholder="Telefone" class="form-control mt-05 numberphone">
                            <input placeholder="CNPJ / CPF" class="form-control document mt-05">

                            <div class="row col-lg-12" style="margin: 0;padding: 0">
                                <div class="form-group col-lg-6" style="margin: 0;padding: 0">
                                    <input placeholder="CEP" class="form-control mt-05 col-lg-12">
                                </div>
                                <div class="form-group col-lg-6" style="margin: 0;padding: 0">
                                    <select class="form-control col-lg-12 mt-05"  id="exampleFormControlSelect1">
                                        <option>Estado</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row col-lg-12" style="margin: 0;padding: 0">
                                <div class="form-group col-lg-6" style="margin: 0;padding: 0">
                                    <select class="form-control col-lg-12 mt-05"  id="exampleFormControlSelect1">
                                        <option>Cidade</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </select>
                                </div>
                                <div class="form-group col-lg-6" style="margin: 0;padding: 0">
                                    <input placeholder="Bairro" class="form-control mt-05 col-lg-12">
                                </div>
                            </div>
                            <input placeholder="Complemento" class="form-control mt-05 col-lg-12">
                        </div>
                        <div class="form-group">
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="do-delivery">
                                <label class="custom-control-label" for="do-delivery"><h4>Já faz entrega ?</h4></label>
                            </div>
                            <div class="form-group" style="display: none" id="delivery-form">
                                <input placeholder="Há quanto tempo faz entrega?" class="form-control mt-05">
                                <input placeholder="Quantidade de entrega por dia (EX: 400)" class="form-control mt-05">
                                <input placeholder="Quantidade de entregadores (Ex: 2)" class="form-control mt-05">
                            </div>
                        </div>
                        <button id="next-page-web" class="col-lg-12 btn btn-primary">Enviar para analise</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mobile">
        <nav class="col-lg-12 navbar navbar-light bg-light" style="padding-bottom: 1vw">
            <a class="navbar-brand" href="#">
                <img width="30" height="30" class="logo-aplication d-inline-block align-top" alt="" loading="lazy">
                <?=Host::NAME_APPLICATION?>
            </a>
        </nav>
        <div id="data-user-mobile" class="col-lg-12">
            <div class="form-group" style="margin-top: 1vw">
                <div class="">
                    <h4>Dados do resposável</h4>
                </div>
                <div class="form-group">
                    <div class="row col-lg-12" style="margin: 0;padding: 0">
                        <div class="form-group col-lg-8" style="margin: 0;padding: 0">
                            <input id="name-user-mobile" placeholder="Nome do responsavel" class="form-control mt-05 col-lg-12">
                        </div>
                        <div class="form-group col-lg-4" style="margin: 0;padding: 0">
                            <input id="name-user-mobile" placeholder="Sobrenome" class="form-control mt-05 col-lg-12">
                        </div>
                        <input id="email-user-mobile" placeholder="Email do responsavel" class="form-control mt-05 col-lg-12">
                        <input id="phone-user-mobile" placeholder="Celular do responsavel" class="form-control mt-05 col-lg-12">
                        <input type='password' id="password-user-mobile" placeholder="Senha" class="form-control mt-05 col-lg-12">
                        <input type='password' id="password-user-mobile-again" placeholder="Senha" class="form-control mt-05 col-lg-12">
                    </div>
                    <div class="form-group mt-05" style="margin-top: 4vw">
                        <button id="next-page-web-mobile" class="btn btn-primary col-lg-12">Próximo</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="enterprise-data-mobile" style="display: none" class="col-lg-12">
            <div class="form-group" style="margin-top: 0.5vw">
                <h3>Dados do estabelecimento</h3>
                <input placeholder="Nome" class="form-control mt-05">
                <input type="tel" placeholder="Telefone" class="form-control mt-05 numberphone">
                <input placeholder="CPF / CNPJ" class="form-control mt-05 document" >
                <div class="row col-lg-12" style="margin: 0;padding: 0">
                    <div class="form-group col-lg-6" style="margin: 0;padding: 0">
                        <input placeholder="CEP" class="form-control mt-05 col-lg-12">
                    </div>
                    <div class="form-group col-lg-6" style="margin: 0;padding: 0">
                        <select class="form-control col-lg-12 mt-05"  id="exampleFormControlSelect1">
                            <option>Estado</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </div>
                </div>
                <div class="row col-lg-12" style="margin: 0;padding: 0">
                    <div class="form-group col-lg-6" style="margin: 0;padding: 0">
                        <select class="form-control col-lg-12 mt-05"  id="exampleFormControlSelect1">
                            <option>Cidade</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6" style="margin: 0;padding: 0">
                        <input placeholder="Bairro" class="form-control mt-05 col-lg-12">
                    </div>
                </div>
                <input placeholder="Complemento" class="form-control mt-05 col-lg-12">
            </div>
            <div class="form-group">
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="do-delivery-mobile">
                    <label class="custom-control-label" for="do-delivery-mobile"><h4>Já faz entrega ?</h4></label>
                </div>
                <div class="form-group" id="delivery-form-mobile" style="display: none">
                    <input placeholder="Há quanto tempo faz entrega?" class="form-control mt-05">
                    <input placeholder="Quantidade de entrega por dia (EX: 50)" class="form-control mt-05">
                    <input placeholder="Quantidade de entregadores (Ex: 2)" class="form-control mt-05">
                </div>
            </div>
            <button id="next-page-web" class="col-lg-12 btn btn-primary">Enviar para analise</button>
        </div>
    </div>
</div>