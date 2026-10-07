let elementProperty = new ElementProperty();

elementProperty.addEventInElement('#filter-by-date','onclick',function () {
    mountFilter('filter-by-date');
    elementProperty.getElement('#value-search-filter',these => {
        these.disabled = true;
    })
});

elementProperty.addEventInElement('#filter-by-status','onclick',function () {
    mountFilter('filter-by-status');
    elementProperty.getElement('#value-search-filter',these => {
        these.disabled = true;
    })
});

elementProperty.addEventInElement('#filter-by-client','onclick',function () {
    elementProperty.getElement('#value-search-filter',these => {
        these.disabled = false;
    })
});

elementProperty.addEventInElement('.open-order','onclick',function () {
    $('#modal-data-order-choose').modal('show');
});

function mountFilter(active) {

    let fields = [
        'filter-by-status',
        'filter-by-date'
    ];

    fields.map(id => {
        if(id === active){
            return elementProperty.getElement('.'+id , these => {
                these.classList.remove('hidden');
            })
        }
        elementProperty.getElement('.'+id , these => {
            these.classList.add('hidden');
        })
    });

    $('#modal-filter-date').modal('show');
}
