<div class="row">
    <div style="margin-top: 1vw" class="col-lg-12">
        <form class="col-lg-6">
            <div class="form-group">
                <label for="tripTypes">Tipo de viagem</label>
                <select class="form-control" id="tripTypes">
                </select>
            </div>
            <div class="form-group">
                <label for="message">Mensagem</label>
                <input class="form-control" id="message">
            </div>
            <button type="button" id="save-new-chat" class="btn btn-primary">Salvar</button>
        </form>
    </div>
    <table class="col-lg-10 table table-striped">
        <thead>
        <tr>
            <th scope="col">Tipo de viagem</th>
            <th scope="col">Mensagem</th>
        </tr>
        </thead>
        <tbody id="mount-list-chat">

        </tbody>
    </table>
</div>