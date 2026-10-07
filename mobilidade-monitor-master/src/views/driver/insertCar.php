<div class="row">
    <div class="container-insert row col-lg-12">

        <div class="form-group col-lg-3">
            <label>Busque o motorista</label>
            <select hidden id="mount-drivers"></select>
        </div>

        <div class="form-group col-lg-3">
            <label>Nome</label>
            <input class="form-control" disabled id="name-driver">
        </div>

        <div class="form-group col-lg-3">
            <label>Email</label>
            <input class="form-control" disabled id="email-driver">
        </div>

        <div class="col-lg-3">
            <img class="col-lg-12 img-ball" src="<?=Host::getLocal()?>webfiles/img/icon/default.png" id="image-driver">
        </div>

        <div class="col-lg-12">
            <hr>
        </div>

        <div class="form-group col-lg-2">
            <label>Marca</label>
            <input class="form-control">
        </div>

        <div class="form-group col-lg-2">
            <label>Modelo</label>
            <input class="form-control">
        </div>


        <div class="form-group col-lg-2">
            <label>Cor</label>
            <input class="form-control">
        </div>

        <div class="form-group col-lg-2">
            <label>Ano</label>
            <input class="form-control">
        </div>

        <div class="form-group col-lg-3">
            <label>Renavan</label>
            <input class="form-control">
        </div>

        <div class="col-lg-12">
            <hr>
        </div>

        <div class="form-group col-lg-3">
            <label>CRLV</label>
            <div class="input-group">
                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="crlv-image" aria-describedby="inputGroupFileAddon04">
                    <label class="custom-file-label" for="crlv-image"></label>
                </div>
            </div>
        </div>

        <div class="col-lg-3">
            <img class="col-lg-12" id="crlv-preview" src="<?=Host::getLocal()?>webfiles/img/icon/default.png">
        </div>

    </div>

    <table class="table table-striped col-lg-12">
        <thead>
        <tr>
            <th scope="col">Modelo</th>
            <th scope="col">Ano</th>
            <th scope="col">Renavan</th>
            <th scope="col">Opções</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <th scope="row">Fiat uno</th>
            <td>2009</td>
            <td>840736129</td>
            <td>
                <button class="btn btn-primary"><i class="material-icons">edit</i></button>
                <button class="btn btn-danger"><i class="material-icons">clear_all</i></button>
            </td>
        </tr>
        <tr>
            <th scope="row">Land Rover - Defender</th>
            <td>2012</td>
            <td>39485823</td>
            <td>
                <button class="btn btn-primary"><i class="material-icons">edit</i></button>
                <button class="btn btn-danger"><i class="material-icons">clear_all</i></button>
            </td>
        </tr>
        <tr>
            <th scope="row">Renault - Sandero</th>
            <td>2015</td>
            <td>15283923</td>
            <td>
                <button class="btn btn-primary"><i class="material-icons">edit</i></button>
                <button class="btn btn-danger"><i class="material-icons">clear_all</i></button>
            </td>
        </tr>
        </tbody>
    </table>

</div>