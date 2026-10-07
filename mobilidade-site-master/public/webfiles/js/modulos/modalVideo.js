const MOBILE = screen.width
const elementClickVideoYoutubePC = document.getElementById("videoYoutubeId")
const elementClickVideoYoutubeMobile = document.getElementById("videoYoutubeIdMobile")

// divs viewport
const elementModalOpenPC = document.getElementById("modal-video")
const elementModalOpenMobile = document.getElementById("modal-video-mobile")

function modalVideo(status,viewport){ 
    if(status){ 
        document.getElementsByTagName("body")[0].style.overflowY = "hidden"
        if(viewport === "PC"){
            elementModalOpenPC.style.display = "flex"
            elementClickVideoYoutubePC
            .setAttribute("src",elementClickVideoYoutubePC.getAttribute("src")
            .concat("&amp;autoplay=1"))
        }
        if (viewport === "MOBILE"){
            elementModalOpenMobile.style.display = "flex"
            elementClickVideoYoutubeMobile
            .setAttribute("src",elementClickVideoYoutubeMobile.getAttribute("src")
            .concat("&amp;autoplay=1"))
        }
        return
    } 
}

function closeModal(status,viewport) {
    if(status){
        document.getElementsByTagName("body")[0].style.overflowY  = "scroll"
        if(viewport === "PC"){
            elementModalOpenPC.style.display = "none"
            elementClickVideoYoutubePC.setAttribute("src",
            elementClickVideoYoutubePC
                .getAttribute("src")
                .replace("&amp;autoplay=1",""))
        }
        if (viewport === "MOBILE"){
            elementModalOpenMobile.style.display = "none"
            elementClickVideoYoutubeMobile.setAttribute("src",
            elementClickVideoYoutubeMobile
                .getAttribute("src")
                .replace("&amp;autoplay=1",""))
        }   
    }
}

window.onload = ()=>{
    if(MOBILE > 1024){ 
        document.getElementById("openModalEstablishment").onclick = ()=> modalVideo(true,"PC")
        // Close modal and pause modal
        document.getElementById("modal-video").onclick = ()=> closeModal(true,"PC")
        return
    } 
    document.getElementById("openModalEstablishment").onclick = ()=> modalVideo(true,"MOBILE")
    // Close modal and pause modal
    document.getElementById("modal-video-mobile").onclick = ()=> closeModal(true,"MOBILE")
}

 
     
 
 