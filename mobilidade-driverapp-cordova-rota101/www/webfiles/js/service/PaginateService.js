class PaginateService extends ElementProperty {
    setList({currentPage, lastPage, showEndButton, totalRows, nextPage}, nameElement, callback) {
        this.currentPage = currentPage;
        this.lastPage = lastPage;
        this.nextPage = nextPage;
        this.showEndButton = showEndButton;
        this.totalRows = totalRows;
        this.nameElement = nameElement;
        this.callback = callback;

        this.getElement(nameElement, element => {
            element.innerHTML = '';
            element.scrollTop = 0;
        });

    }

    setNewPage(transactions) {
        const _that = this;

        this.getElement(_that.nameElement, element => {
            element.innerHTML = ' ' + element.innerHTML;
            transactions.map(transaction => {
                _that.callback(transaction, element)
            })
        })
    }


    updatePage(callback) {
        const _that = this;
        this.addEventInElement(this.nameElement, "onscroll", function () {

            if (this.offsetHeight + this.scrollTop > (this.scrollHeight - this.scrollHeight * 0.1)) {
                if ((_that.currentPage < _that.lastPage) && (_that.nextPage === (_that.currentPage + 1))) {
                    _that.currentPage = parseInt(_that.currentPage) + 1;

                    callback(_that.currentPage);
                }
            }
        });
    }
}
