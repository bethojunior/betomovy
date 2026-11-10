<div class="container-main">
    <div class="dt-page">

        <div class="dt-header">
            <h1 class="dt-title">District Rates</h1>
            <button type="button" class="dt-btn-add valueByNeighborhood"
                    data-toggle="modal" data-target="#AddValueByNeighborhood">
                Add Rate
            </button>
        </div>

        <div class="dt-table-wrap">
            <table class="dt-table">
                <thead>
                    <tr>
                        <th>District</th>
                        <th>Trip Type</th>
                        <th>Rate ($ USD)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="resultTable"></tbody>
            </table>
        </div>

        <div class="container-pagination dt-pagination"></div>

    </div>
</div>

<div class="modal fade" id="AddValueByNeighborhood" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add District Rate</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="dt-form-group">
                    <label class="dt-label" for="neighborhood">District</label>
                    <select class="dt-select" id="neighborhood">
                        <option selected disabled value="0">Select district</option>
                    </select>
                </div>
                <div class="dt-form-group">
                    <label class="dt-label" for="typeOfCall">Dispatch Type</label>
                    <select class="dt-select" id="typeOfCall">
                        <option selected disabled value="0">Select type</option>
                    </select>
                </div>
                <div class="dt-form-group">
                    <label class="dt-label" for="value">Rate ($ USD)</label>
                    <input type="number" class="dt-input input-value-price" id="value" placeholder="0.00">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="dt-btn-cancel" data-dismiss="modal">Cancel</button>
                <button type="button" class="dt-btn-save save">Save</button>
            </div>
        </div>
    </div>
</div>
