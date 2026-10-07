$(document).ready(function(){

    const dataUser = Session.get("user");
    $('.modal').modal();
    let listNotification = "";

    PromotionController.teste(data =>{
        data.map(res => {
            listNotification += `
                <div value='${res.id}' data='${JSON.stringify(res)}' class="card col s12">
                    <div class="col s6">
                        <img class="responsive-img" src="${res.img}"> 
                    </div>
                    <div class="col s6">
                        <span class="titleCard">${res.title}</span>
                        <div class="divider"></div>
                        <span class="bodyCard">${res.body}</span>
                    </div>
                </div>       
            `;
        });

        document.getElementById("listPromotion").innerHTML = listNotification;

        for(let i in document.getElementsByClassName("card")){
            document.getElementsByClassName("card")[i].onclick = function(){
                $('#modalCard').modal('open');
                let dados = this.getAttribute("data");
                let dataCard = JSON.parse(dados);
                document.getElementById("imageModal").src = dataCard.img;
                document.getElementById("titleModal").innerHTML = dataCard.title;
                document.getElementById("bodyModal").innerHTML  = dataCard.body;
            }
        }

    });

});