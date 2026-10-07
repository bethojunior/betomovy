<div class="container-main">
    <div class="drv-page">

        <div class="drv-header">
            <h1 class="drv-title">Motoristas</h1>
            <div class="drv-toolbar">
                <button
                    type="button"
                    class="drv-btn"
                    data-toggle="modal"
                    data-target="#modalAddDriverInCentral">
                    Adicionar motorista
                </button>
                <a href="<?php echo Host::getLocal(); ?>driver/signup" class="drv-btn drv-btn--outline">
                    Cadastrar motorista
                </a>
            </div>
        </div>

        <div class="drv-table-wrap">
            <table class="drv-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Código</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Criado em</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody id="resultTable"></tbody>
            </table>
        </div>

        <div class="container-pagination drv-pagination"></div>

    </div>
</div>
