<div class="container-main">
    <div class="tl-page">

        <div class="tl-header">
            <h1 class="tl-title">Trips</h1>
        </div>

        <div class="tl-filters">
            <select class="tl-select" id="tripStatus">
                <option value="">All Statuses</option>
                <option value="searching">Searching Driver</option>
                <option value="searching_favorite">Searching Favorite Driver</option>
                <option value="pre_accepted">Pre-accepted</option>
                <option value="accepted">Accepted</option>
                <option value="boarding">Boarding</option>
                <option value="in_progress">In Progress</option>
                <option value="finished">Completed</option>
                <option value="canceled">Canceled</option>
                <option value="payment_refused">Payment Refused</option>
                <option value="not_answered">Unattended</option>
                <option value="back_off">Abandoned</option>
                <option value="scheduled">Scheduled</option>
            </select>
            <input type="text" class="tl-text-input" id="filterCustomerName" placeholder="Customer name">
            <select class="tl-select" id="filterDriverId">
                <option value="">All Drivers</option>
            </select>
            <div class="tl-date-range">
                <input type="date" class="tl-date-input" id="dateStart">
                <span class="tl-date-sep">—</span>
                <input type="date" class="tl-date-input" id="dateEnd">
            </div>
            <button type="button" class="tl-btn-filter" id="btnFilterTrip">Filter</button>
        </div>

        <ul class="list-trips"></ul>
        <div class="container-pagination tl-pagination"></div>

    </div>
</div>
