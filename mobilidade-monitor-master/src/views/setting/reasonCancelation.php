<div class="row">
    <div style="margin-top: 1vw" class="col-lg-12">
        <form class="col-lg-6">
            <div class="form-group d-flex" style="justify-content: space-between">
                <div>
                    <label for="new-cancellation">Mensagem</label>
                    <input class="form-control" id="new-cancellation">
                </div>
                <div>
                    <label>Para quem será mostrado</label>
                    <div class="form-check col-lg-2 col-sm-2">
                        <input class="form-check-input check-type" type="radio" id="1" name="typeReasonId" value="1" checked>
                        <label class="form-check-label" for="1">
                            Motorista
                        </label>
                    </div>
                    <div class="form-check col-lg-2 col-sm-2">
                        <input class="form-check-input check-type" type="radio" id="2" name="typeReasonId" value="2">
                        <label class="form-check-label" for="2">
                            Cliente
                        </label>
                    </div>
                </div>
            </div>
            <button type="button" id="save-new-reason" class="btn btn-primary">Salvar</button>
        </form>
    </div>
   <div class="table-responsive">
        <table class="table table-striped">
            <thead>
            <tr>
                <th scope="col">Motivo</th>
                <th scope="col">Opções</th>
            </tr>
            </thead>
            <tbody id="mount-reasons">
            </tbody>
        </table>
   </div>
</div>