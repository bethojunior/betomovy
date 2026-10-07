<div class="container-default-monitor">
    <div class="form-group col-lg-4 relative">
        <label for="do-filter">Filtro</label>
        <input class="form-control" id="doFilter" aria-describedby="emailHelp">
        <button title="Buscar" id="searchCustomer"
                class="btn btn-primary btn-sm search-costumer material-icons">search
        </button>
    </div>
    <div class="table-responsive">
        <table class="table table-striped">
            <thead>
            <tr>
                <th scope="col">Central</th>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col"></th>
            </tr>
            </thead>
            <tbody id="listCustomer">
            </tbody>
        </table>
    </div>
    <nav>
        <ul class="pagination">
            <li class="page-item page-previous disabled">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item page-next disabled">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</div>