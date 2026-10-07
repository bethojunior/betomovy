<div class="container-default-monitor">
    <div class="container">
        <button type="button" class="btn btn-outline-primary btn-sm mb-2" data-toggle="modal"
                data-target="#modalAddMilitaryGraduation">
            Adicionar Patente
        </button>
        <table class="table">
            <thead>
            <tr>
                <th scope="col">Patente</th>
                <th scope="col">Órgão Militar</th>
            </tr>
            </thead>
            <tbody id="listMilitaryForceGraduation">
            </tbody>
        </table>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" id="backPage">
                    <a class="page-link" href="#" aria-label="Previous" >
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" id="nextPage">
                    <a class="page-link" href="#" aria-label="Next" >
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>

<div class="modal fade" id="modalAddMilitaryGraduation" tabindex="-1" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <form id="formAddMilitaryGraduation">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Adicionar Patente</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="namePatentLabel">Nome da Patente</label>
                        <input required type="text" class="form-control" id="namePatent"
                               placeholder="Terceiro Sargento">
                    </div>
                    <div class="form-group">
                        <label for="level">Ordem de Amostragem</label>
                        <input type="number" value="1" class="form-control" id="level">
                    </div>
                    <div class="form-group">
                        <label for="forceMilitary">Categorias Militares</label>
                        <select class="form-control" id="categoryMilitarySelect">
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary btn-add-military-graduation">Adicionar</button>
                </div>
        </form>
    </div>
</div>
</div>
