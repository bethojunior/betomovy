<div class="row" >
    <div class="general-publicidade w-100" >
        <div class="row col-lg-12 col-sm-12 container-form">
            <div class="d-lg-flex col-lg-12" >
                <div class="col-lg-6 col-sm-12" >
                    <div class="col-lg-12 col-sm-12">
                        <div class="d-lg-flex align-items-center">
                            <div  class="col-lg-6 col-sm-12">
                                <span class="title-form-publicity">Imagem para o modal  <label>(288 x 180)</label></span> 
                            </div>
                            <div  class="col-lg-6">
                                <img height="90" width="auto" id="image-upload-item"  src="<?=Host::getLocal()?>webfiles/img/icon/default.png">
                            </div>
                        </div>
                            <div class="custom-file mt-3">
                                <input type="file" class="custom-file-input thumbnail" id="thumbnail">
                                <label class="custom-file-label" for="thumbnail">Carregar imagem</label>
                            </div>
                        </div>
                        <div class="col-lg-12 col-sm-12 form-group mt-3">                   
                            <div class="d-lg-flex align-items-center">
                            <div  class="col-lg-6">
                            <span class="title-form-publicity">Banner promocional <label>(324 x 108)</label></span>
                        </div>
                        <div  class="col-lg-6 ">
                            <img height="90" width="auto" id="image-upload-item-banner"  src="<?=Host::getLocal()?>webfiles/img/icon/default.png">
                        </div>
                    </div>
                    <div class="custom-file mt-3">
                        <input type="file" class="custom-file-input" id="banner">
                        <label class="custom-file-label" for="banner">Carregar imagem</label>
                    </div>
                </div>
                <div class="col-lg-12 col-sm-12 form-group mt-5">
                    <span class="title-form-publicity">Data Ínicio</span>
                    <input class="form-control time-publicidade" type="datetime-local" id="dateStart">
                </div>
                <div class="col-lg-12 col-sm-12 form-group mt-5">
                    <span class="title-form-publicity">Data Final</span>
                    <input class="form-control time-publicidade" type="datetime-local" id="dateEnd">
                </div>               
                <div class="col-lg-12 col-sm-12 form-group mt-5">
                    <span class="title-form-publicity">Quantidade de vezes</span>
                    <input type="number" class="form-control" id="amountOfTime" min="0">
                </div>   
            </div>
                <div class="col-lg-6 col-sm-12">
                <div class="col-lg-12 col-sm-12">
                    <span class="title-form-publicity">Publico</span> 
                        <hr>
                    <div id="mount-gender" class="d-lg-flex justify-content-start mb-3 align-items-start"></div>
                </div>
                 <div class="col-lg-12 col-sm-12">
                        <span class="title-form-publicity">Onde</span>
                            <hr>
                        <div id="mount-were" class="d-lg-flex justify-content-start mb-3 align-items-start"></div>
                    </div>                                 
                    <div class="col-lg-12">
                        <span class="title-form-publicity">App</span>
                            <hr>
                        <div id="mount-apps" class="d-lg-flex justify-content-start mb-3 align-items-start"></div>
                    </div>
                    <div class="col-lg-12 col-sm-12">
                        <span class="title-form-publicity">Links</span>                    
                        <hr>
                    <div class="form-group mt-2">
                        <span>Link 1</span>
                        <input class="form-control" id="link">
                    </div>
                    <div class="form-group mt-5">
                        <span>Email de informação</span>
                        <input class="form-control" id="email-information">
                    </div>
                    <div class="form-group mt-5">
                        <span>Email de redirecionamento</span>
                        <input class="form-control" id="emailRedirect">
                    </div>
                </div>
            </div>
            </div>
            <div class="col">
                <div class="row col-lg-12 col-sm-12 mt-3 ml-1">
                <form class="form-group col-12">
                    <span class="title-form-publicity">Descrição</span>
                    <textarea id="description"  placeholder="Texto" class="form-control h-100"></textarea>
                </form>
            </div>
            <div class="col-lg-12 col-sm-12 enterprise mt-5 d-lg-flex"> 
                <form class="form-group col-lg-6">
                    <span class="title-form-publicity">Empresa</span>
                    <select class="custom-select form-control" id="mount-company">
                    </select>
                </form>
                <form class="form-group col-lg-6">
                    <span class="title-form-publicity">Gestor</span>
                    <input class="form-control" disabled>
                </form>
            </div>
        </div>
       </div> 
            <div class="d-flex justify-content-lg-start justify-content-sm-center button-save-publicity">
                <div><button id="save-publicity" class="btn btn-primary">Salvar</button></div>
            </div>
    </div>
</div>