<div class="container-main">
    <div class="drv-page">

        <div class="drv-header">
            <h1 class="drv-title">Drivers</h1>
            <div class="drv-toolbar">
                <button
                    type="button"
                    class="drv-btn"
                    data-toggle="modal"
                    data-target="#modalAddDriverInCentral">
                    Add Driver
                </button>
                <a href="<?php echo Host::getLocal(); ?>driver/signup" class="drv-btn drv-btn--outline">
                    Register Driver
                </a>
            </div>
        </div>

        <div class="drv-table-wrap">
            <table class="drv-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Registered</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="resultTable"></tbody>
            </table>
        </div>

        <div class="container-pagination drv-pagination"></div>

    </div>
</div>
