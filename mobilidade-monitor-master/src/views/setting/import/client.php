<div class="container-default-monitor mt-3">
    <div class="container">
        <p>Para importação de seu clientes, precisamos de um arquivo em formato XLSX, é necessário ter pelo menos as
            informações básicas, caso contrário não será possível fazer a importação com sucesso.</p>
        <p>Veja na imagem as colunas necessárias, são:</p>
        <div id="showReportExample"></div>
        <p>Os clientes após importados serão liberados no seu cadastro de clientes e todos terão a senha padrão
            123456.</p>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop">
            Importar Arquivo
        </button>

        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-backdrop="static" tabindex="-1" role="dialog"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <form>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Importar Clientes</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="importFileClient">Selecione o arquivo de Importação</label>
                                <input type="file" class="form-control-file" id="importFileClient"
                                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                                <div id="previewImport" class="mt-2"></div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="btnImportClient">Enviar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
