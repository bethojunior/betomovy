<div class="container-massageUser">
    <div class="info-massage">
        <form class="cidade">
            <select class="op-city" id="city"></select>
            <input type="button"  id="button"  name="Enviar" value="Adicionar" />
            <br><br><span class="city-selec"> (s) Selecionada(s):</span><br><br>
            <div class="campo-city-select"  style=" height:auto; margin:0 auto;"></div>
        </form>
        <form class="tipo">
            <fieldset>
                <legend class="tipo-user"><b>Tipo de Usuário</b></legend>
                <div class="op-tipo-cli">
                    <input type = "checkbox" id = "cliente" name = "interesse" value="customer" class="userTypes">
                    <label for = "clie"> Cliente </label>
                </div>
                <div class="op-tipo-mot">
                    <input type = "checkbox" id = "motorista" name = "interesse" value="driver" class="userTypes">
                    <label for = "motor"> Motorista </label>
                </div>
                <div class="op-tipo-par">
                    <input type = "checkbox" id = "parceiros" name = "interesse" value="partner" class="userTypes">
                    <label for = "motor"> Parceiro </label>
                </div>
            </fieldset>
        </form>
    </div>
    <hr>
    <div class="enviar-massage">
        <form  class="mensagem" name="form" id="formPush">
<!--            <div class="form-group">-->
<!--                <img height="180" width="auto" id="image-upload-thumbnail" src="--><?//=Host::getLocal()?><!--webfiles/img/icon/default.png">-->
<!--                <div class="custom-file">-->
<!--                    <input type="file" class="custom-file-input thumbnail" id="thumbnail">-->
<!--                    <label class="custom-file-label" for="thumbnail">Carregar imagem</label>-->
<!--                </div>-->
<!--            </div>-->
            <div class="form-group">
                <label for="titulo-msm">Titulo Push</label>
                <input type="text" id="titulo-msm" name="titulo" class="form-control">
            </div>
            <div class="form-group">
                <label for="conteudo-msm">Conteúdo</label>
                <textarea id="conteudo-msm" class="form-control"></textarea>
            </div>
            <p class="submit">
                <input id="btmPush" class="btm-enviar" type="button" value="Enviar" onload=this/>
            </p>
        </form>
    </div>
</div>
