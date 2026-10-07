<div class="container-default-monitor">
    <div class="container d-flex flex-column">
        <div class="header-container">
            <div class="w-100">
                <div class="filter-container">
                    <div class="form-group relative">
                        <label>Filtro</label>
                        <div class="d-flex">
                            <input class="form-control input-filter" placeholder="Filtrar">
                            <button class="btn btn-primary btn-sm material-icons btn-filter absolute"
                                    onclick="filter()">search
                            </button>
                        </div>
                    </div>

                    <div class="select-container">
                        <label>Status</label>
                        <select class="form-control select-status-partner">
                            <option class="option-status" value="">TODOS</option>
                        </select>
                    </div>
                </div>

                <div class="d-flex options-filter-container">
                    <div class="d-flex radio-container">
                        <div class="form-check">
                            <input class="form-check-input type-filter" type="radio" name="flexRadioDefault" value="0"
                                   checked>
                            <label class="form-check-label" for="flexRadioDefault1">Nome</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input type-filter" type="radio" name="flexRadioDefault" value="1">
                            <label class="form-check-label" for="flexRadioDefault2">E-mail</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input type-filter" type="radio" name="flexRadioDefault" value="2">
                            <label class="form-check-label" for="flexRadioDefault3">Telefone</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <ul id="listPartner"></ul>
        </div>
    </div>
</div>