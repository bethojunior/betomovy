<div class="row">
    <button class="btn btn-primary btn-add-coupon">Novo Cupom</button>

    <div class="modal" id="couponModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Novo Cupom</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="left-side-container">
                       <div class="top-container-modal">
                         <div class="form-group coupon-name-container">
                            <span class="code-span">Código do cupom</span>
                            <input class="form-control code" id="coupon-name">
                         </div>

                         <div class="city-select">
                           <span class="select-span"> Cidades </span>
                           <div class="row select-div">
                              <select class="form-control"  id="mount-cities">
                              <option value="">Todas</option>
                              </select>
                           </div>
                         </div>

                         <div>
                           <span class="select-span"> Tipo de pagamento </span>
                           <div class="row select-div">
                               <select class="form-control" id="mount-type-payment">
                                   <option value="">Todos</option>
                               </select>
                               </div>
                           </div>
                         </div>

                       <div class="mid-container-modal">
                        <div class="row value-container">
                          <form class="form-group value-form">
                              <span class="cash-span">Valor inicial:</span>
                              <input class="form-control cash-input" type="tel" id="fromValue">
                          </form>

                          <form class="form-group value-form">
                              <span class="cash-span">Valor até: </span>
                              <input class="form-control cash-input" type="tel" id="limitedTo">
                          </form>

                          <div class="discount-container">
                            <form class="form-group value-form">
                              <span>Desconto:</span>
                              <input class="form-control cash-input" type="tel" id="value-discount">
                            </form>

                            <div class="type-value-coupon">
                              <div class="form-check">
                                <input class="form-check-input check-label-discount" type="radio" name="valueType" id="%" value="%" checked>
                                <label class="form-check-label" for="%">%</label>
                              </div>

                              <div class="form-check">
                                  <input class="form-check-input value-type check-label-discount" type="radio" name="valueType" id="$" value="$">
                                  <label class="form-check-label" for="$">$</label>
                              </div>
                            </div>
                          </div>

                            <form class="form-group value-form">
                                <span class="cash-span">Valor máximo: </span>
                                <input class="form-control cash-input" type="tel" id="maxDiscountValue">
                            </form>
                        </div>
                       </div>

                       <div class="bottom-container-modal">
                          <form class="form-group">
                              <span>Data inicio</span>
                              <input class="form-control time-coupon" type="datetime-local" step="1" id="date-initial">
                          </form>
                          <form class="form-group">
                              <span>Data final</span>
                              <input class="form-control time-coupon"  type="datetime-local" step="1" id="date-end">
                          </form>
                       </div>
                    </div>

                  <div class="right-side-container">
                      <div class="container-gestor-desconto">
                        <b>Gestor do desconto</b>
                        <div class="form-check col-lg-12 btn-radio">
                            <input class="form-check-input" type="radio" name="bonusDriver" id="true" value="true" checked>
                            <label class="form-check-label" for="true">Motorista</label>
                        </div>
                        <div class="form-check col-lg-12 btn-radio">
                            <input class="form-check-input" type="radio" name="bonusDriver" id="false" value="false">
                            <label class="form-check-label" for="false">App</label>
                        </div>
                      </div>

                      <div class="valid-container">
                         <b>Limite por usuário</b>
                           <div class="form-check btn-radio">
                              <input class="form-check-input " type="radio" name="uniqueUse" id="true" value="true" checked>
                              <label class="form-check-label" for="true">Única vez</label>
                           </div>
                           <div class="form-check btn-radio">
                              <input class="form-check-input" type="radio" name="uniqueUse" id="false" value="false">
                              <label class="form-check-label" for="false">Sem limites</label>
                           </div>
                      </div>

                      <div class=" public-container">
                        <b>Público</b>
                        <div class="row btn-radio" id="mount-type-gender"> </div>
                      </div>
                </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                  <button type="button" class="btn btn-primary" id="do-coupon">Criar</button>
                </div>
            </div>
        </div>
    </div>

    <div class="row col-lg-12">
        <table class="table table-striped col-lg-12 table-responsive">
            <thead>
            <tr>
                <th scope="col">Código</th>
                <th scope="col">Validade</th>
                <th scope="col">Valor</th>
                <th scope="col">Valor máximo</th>
                <th scope="col">Cidade</th>
                <th scope="col">Gênero</th>
                <th scope="col">Forma de pagamento</th>
                <th scope="col">Desativar</th>
                <th scope="col">Excluir</th>
            </tr>
            </thead>
            <tbody id="mount-coupon">
            </tbody>
        </table>
    </div>
</div>