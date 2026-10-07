<hr/>
<div class="container-version">
    <a href="javascript: openForm();">
        <input type="button" name="Enviar" value="Nova versão" class="btn" />
    </a>

    <div class="tab">
        <ul class="menu_tabela">
            <li>Nº de Versões</li>
            <li>Plataforma</li>
            <li>Data</li>
            <li>Status</li>
        </ul>
        <ul class="Conteudo">
            <li class="versao">1.14.0</li>
            <li class="plataforma">Android</li>
            <li class="data">04/10/2018</li>
            <li class="statu">Disponivel
                <button class="btn" id="btn-status" onload="this">Desativar</button>
            </li>
            <hr>
        </ul>
    </div>
    <div class="form-popup" id="myForm">
        <form action="" class="form-container">
            <br>
            <label for="n_versao"><b>Nº da versão</b></label>
            <input type="text"  name="n_versao" required>
            <label for="link_download"><b>Link Download</b></label>
            <input type="text"  name="link_download" required>
            <button type="submit" class="btn_save"><b>Salvar</b></button>
            <button type="submit" class="btn_cancel" onclick="closeForm()"><b>Close</b></button>
        </form>
    </div>
</div>
