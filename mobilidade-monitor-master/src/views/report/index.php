<div class="container-default-monitor">
    <div class="container list-report" id="accordionList">
    </div>

</div>
<div class="modal fade" id="reportModal" role="dialog" aria-labelledby="reportModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="reportModalLabel">Relatório</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="contentReport"></form>
                <div class="d-flex">
                    <div class="form-check mr-3">
                        <input class="form-check-input input-type-report" type="radio" name="isPdf" id="isPdf" value="1" checked>
                        <label class="form-check-label" for="isPdf">
                            PDF
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input input-type-report" type="radio" name="isPdf" id="isXls" value="0">
                        <label class="form-check-label" for="isXls">
                            Excel
                        </label>
                    </div>
                </div>
            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnIssueReport">Emitir</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="reportTableModal" role="dialog" aria-labelledby="reportModalLabelTable"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="reportModalLabelTable">Relatório</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="showReportInTable"></div>
                <div id="showReportInPDF" class="w-100"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnDownloadReport">Download</button>
            </div>
        </div>
    </div>
</div>

