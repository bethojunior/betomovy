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
        ContactController.getReport(page).then(res => {
            let list = concat ? element.innerHTML : "";
            let data = res.response.data;
            lastPage = res.response.last_page;

            if(parseInt(page) <= parseInt(res.response.last_page)){
                list += data.map(message => {
                    return `

                    <div class='container'>
                        <div id="${message.idTripReport}" class="content  row col-lg-12">
                        
                            <label class="date">${new Date(message.created_at).toLocaleDateString()}</label>
                            
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label>Nome</label>
                                    <input value="${message.nameUser}" disabled class="form-control">
                                </div>
                                    <div class="form-group">
                                    <label>Tipo</label>
                                    <input disabled class="form-control" value="${message.userType}">
                                </div>
                            </div>
                            
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label>Telefone</label>
                                    <a target="_blank" href="https://api.whatsapp.com/send?phone=55${Mask.whats(message.phoneName)}&text=Ol%C3%A1%2C%20somos%20o%20suporte%20da%20${NAME_APP}%20%2C%20gostar%C3%ADamos%20de%20falar%20sobre%3A${message.message}"><img src="/webfiles/img/icon/whatsapp.png"></a>
                                    <input disabled class="form-control" value="${message.phoneName}">
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input disabled class="form-control" value="${message.emailUser}">
                                </div>
                             
                            </div>
                            
                            <div class="col-lg-4 messagens data-contact" id="${message.idTripReport}" >
                                <label>Assunto</label>
                                <textarea class="form-control" disabled>${message.message.substr(0,300)}
                                </textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div id="modal${message.idTripReport}" class="modal">
                        <div class="modalContent">
                            ${message.message}
                        </div>                
                    </div>
                `;
                }).join('');

                $(document).ready(function()
                {
                    $(".mostrar").hide();
                    $(".esconder").click(function()
                    {
                        $(this).next(".mostrar").slideToggle(400);
                    });
                });

                element.innerHTML = list;

                elementProperty.addEventInElement('.messagens','onclick',function(){
                    id = this.getAttribute('id');
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