<div class="container-default-monitor">
    <div class='container list-report' id="reportList"></div>

    <div class="modal fade" id="reportModalNew" role="dialog" aria-labelledby="reportModalLabelNew"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="reportModalLabelNew">Relatório</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="contentReport"></form>
                <div class="d-flex">
                    <div class="form-check mr-3">
                        <input class="form-check-input input-type-report" type="radio" name="isPdf" id="isXls" value="0" checked>
                        <label class="form-check-label" for="isXls">
                            Excel
                        </label>
                    </div>
                    <div class="form-check" id="pdfOption"></div>
                </div>
            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnIssueReportNew">Emitir</button>
            </div>
        </div>
    </div>
</div>