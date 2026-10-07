
const modalVai = {

    isOpen : function (status = false) {
        return status;
    },

    open : function(id){
        document.body.style.background = "rgba(0,0,0,0.5)";
        document.getElementById(id).classList.add("modalOpen");
    },

    close : function(id){
        document.getElementById(id).style.display =  "none";
    },


};