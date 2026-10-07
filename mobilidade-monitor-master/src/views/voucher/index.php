<div class="container-default-monitor">
    <div class="m-2">
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addPromotionVoucher">
            Adicionar Voucher
        </button>
    </div>
   <div class="table-responsive">
        <table class="table table-striped">
            <thead>
            <tr>
                <th scope="col">Valor do Voucher</th>
                <th scope="col">Desconto em %</th>
                <th scope="col">Valor pago</th>
                <th scope="col">Cidade</th>
                <th scope="col">Ofertado para</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
            </tr>
            </thead>
            <tbody class="list-vouchers">
            </tbody>
        </table>
   </div>
    <div class="m-2">
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item backPage">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item nextPage">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>

<div class="modal fade" id="addPromotionVoucher">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="titleModalAddVoucher">Voucher</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <div class="mb-2">
                        <label for="valueVoucher">Valor do Voucher</label>
                        <input type="number" class="form-control maskmoney" id="valueVoucher">
                    </div>
                    <div class="mb-2">
                        <label for="valuePercentage">Desconto em %</label>
                        <input type="number" class="form-control maskmoney" id="percentageValueDiscount">
                    </div>
                    <div class="mb-2">
                        <label for="value">Valor que o cliente vai pagar</label>
                        <input disabled type="number" class="form-control maskmoney" id="payValueVoucher">
                    </div>
                    <div class="mb-2">
                        <label for="cityVoucher">Cidade de funcionamento do voucher</label>
                        <select class="custom-select" required name="cityId" id="cityId"></select>
                    </div>
                    <div class="mb-2">
                        <label for="userVoucher">Para quem será ofertado</label>
                        <select class="custom-select" required name="userSelect" id="userSelect">
                            <option value="client">Cliente final</option>
                            <option value="central">Central</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="addVoucher">Adicionar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="editPromotionVoucher">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="titleModalEditVoucher">Informações do Voucher</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <div class="mb-2">
                        <label for="valueEditVoucher">Valor do Voucher</label>
                        <input type="number" class="form-control maskmoney" id="editValueVoucher">
                    </div>
                    <div class="mb-2">
                        <label for="valuePercentage">Desconto em %</label>
                        <input type="number" class="form-control maskmoney" id="editPercentageValueDiscount">
                    </div>
                    <div class="mb-2">
                        <label for="value">Valor que o cliente vai pagar</label>
                        <input disabled type="number" class="form-control maskmoney" id="editPayValueVoucher">
                    </div>
                    <div class="mb-2">
                        <label for="cityVoucher">Cidade de funcionamento do voucher</label>
                        <select class="custom-select" required name="cityId" id="editCityId"></select>
                    </div>
                    <div class="mb-2">
                        <label for="editUserVoucher">Para quem será ofertado</label>
                        <select class="custom-select" required name="editUserSelect" id="editUserSelect">
                            <option value="client">Cliente final</option>
                            <option value="central">Central</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="editVoucher">Editar</button>
            </div>
        </div>
    </div>
</div>