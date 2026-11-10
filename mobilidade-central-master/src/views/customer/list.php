<div class="container-main">
    <div class="cust-page">

        <div class="cust-header">
            <h1 class="cust-title">Customers</h1>
            <button type="button" class="cust-btn-add" id="openAddCustomer">
                <i class="material-icons">add</i> New Customer
            </button>
        </div>

        <div class="cust-toolbar">
            <div class="cust-search">
                <i class="material-icons cust-search__icon">search</i>
                <input type="text" id="filterCustomer" class="cust-search__input" placeholder="Search customer...">
            </div>
            <div class="cust-filter-group">
                <label class="cust-filter-pill">
                    <input type="radio" class="radio-type-filter" name="typeFilter" value="name" checked>
                    <span>Name</span>
                </label>
                <label class="cust-filter-pill">
                    <input type="radio" class="radio-type-filter" name="typeFilter" value="phone">
                    <span>Phone</span>
                </label>
                <label class="cust-filter-pill">
                    <input type="radio" class="radio-type-filter" name="typeFilter" value="document">
                    <span>Tax ID / Document</span>
                </label>
            </div>
        </div>

        <div class="cust-table-wrap">
            <table class="cust-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Tax ID / Doc</th>
                        <th>Phone</th>
                        <th>Birthday / Registered</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="resultTable"></tbody>
            </table>
        </div>

        <div class="container-pagination cust-pagination"></div>

    </div>
</div>
