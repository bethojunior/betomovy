let elementProperty = new ElementProperty();
let thisPage = 1;
let lastPage = 0;

mountList();

elementProperty.addEventInElement("#mountListContact", "onscroll", function () {
    if (this.scrollHeight - this.scrollTop === this.clientHeight) {
        thisPage = thisPage + 1;
        if (thisPage <= lastPage)
            mountList(thisPage , true);
    }
});

function mountList(page = 1 , concat = false , name = '') {
    elementProperty.getElement("#mountListContact", element => {
        ContactController.getMessages(page).then(res => {
            let list = concat ? element.innerHTML : "";
            let data = res.response.data;
            lastPage = res.response.last_page;
            if(parseInt(page) <= parseInt(res.response.last_page)){

                list += data.map(message => {
                    return `
                        <div class='container'>
                            <div class="content row col-lg-12">
                            
                                <label class="date">${new Date(message.created_at).toLocaleDateString()}</label>
                             
                                <div class="col-lg-4">
                                    <div class="form-group">
                                        <label>Nome</label>
                                        <input class="form-control" disabled value="${message.name}">
                                    </div>
                                    <div class="form-group">
                                        <label>Tipo</label>
                                        <input class="form-control" disabled value="${message.userType}">
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="form-group">
                                        <label>Telefone</label>
                                        <a target="_blank" href="https://api.whatsapp.com/send?phone=55${Mask.whats(message.phone)}&text=Ol%C3%A1%2C%20somos%20o%20suporte%20da%20${NAME_APP}%20%2C%20gostar%C3%ADamos%20de%20falar%20sobre%3A${message.message}"><img src="/webfiles/img/icon/whatsapp.png"></a>
                                        <input class="form-control" disabled value="${message.phone}" >
                                    </div>
                                                                    
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input class="form-control" disabled value="${message.email}" >
                                    </div>
                                                                       
                                </div>
                                <div id="${message.idContactUs}" class="data-contact col-lg-4">
                                    <label>Assunto</label>
                                    <textarea class="form-control"disabled>${message.message.substr(0,300)}</textarea>
                                </div>
                            </div> 
                        </div>
                        
                        <div id="modal${message.idContactUs}" class="modal">
                            <div class="modalContent">
                                ${message.message}
                            </div>                
                        </div>
                `;
                }).join('');


                element.innerHTML = list;

                elementProperty.addEventInElement('.data-contact','onclick',function(){
                    let id = this.getAttribute('id');
                    elementProperty.getElement('#modal'+id , modal => {
                        if(modal.classList.contains('show')){
                            modal.classList.remove('show');
                            return;
                        }
                        modal.classList.add('show');
                    });
                    elementProperty.addEventInElement('.modal' , 'onclick' , function(){
                        elementProperty.getElement('#modal'+id , element => {
                            element.classList.remove('show');
                        });
                    });
                });

                elementProperty.addEventInElement('.modalContent' , 'onclick' , function(e){
                    e.stopPropagation();
                });

            }

        });
    });

}