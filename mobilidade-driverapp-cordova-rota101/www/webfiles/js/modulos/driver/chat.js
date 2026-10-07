viewController.setObserver("chat-trip", function (trip) {

    const captureAudio = {
        element: null,
        time: 15,
        isPress: true,
        audio: null,
        nameAudio: "",

        isLocked: false,
        isLockedTime: 0,
        startX: 0,
        startY: 0,
        elapsed: 0,
        timerInterval: null
    };

    const chatTripController = new ChatTripController();

    const chatRepository = new ChatRepository();

    const cityConfig = Session.get("cityConfig");

    const userLogged = Session.get("user");

    const elementProperty = new ElementProperty();

    if(cityConfig.enableCallInChat == true){
        document.querySelector("#callNumberClient").style.display = "flex";
    }else{
        document.querySelector("#callNumberClient").style.display = "none";
    }

    elementProperty.addEventInElement(".close-chat-trip", "onclick", closeChat);
    elementProperty.addEventInElement(".btn-send-message", "onclick", sendMessage);

    elementProperty.addEventInElement(".btn-send-audio-locked", "onclick", sendLockedAudio);
    elementProperty.addEventInElement(".btn-cancel-audio-locked", "onclick", cancelLockedAudio);
    
    clearMessage();

    requestPermissionAudio();

    if (cityConfig.status_realtime_database) {
        getMessagesByFirebase();
    } else {
        getMessageBySocket();
    }

    function getMessagesByFirebase() {
        chatRepository.getCurrentMessages(trip.tripReference, (result) => {

            result.map(({item, type}) => {
                if (type === chatRepository.typeAdded) {
                    elementProperty.getElement(".preload-audio", element => {
                        element.remove();
                    });

                    elementProperty.getElement(".preview-message", element => {
                        element.remove();
                    });

                    const dateSend = new Date();

                    dateSend.setTime(item.date.seconds * 1000);

                    if (item.isAudio) {
                        addAudio(item.message, dateSend.toLocaleTimeString(), item.userId == userLogged.idUser, item.idMessagesChatTrip);
                        return;
                    }

                    addMessage(item.message,
                        dateSend.toLocaleTimeString(),
                        item.userId == userLogged.idUser,
                        item.idMessagesChatTrip,
                        item.viewed);
                }
            });

            const lastMessage = result[result.length - 1];

            if (lastMessage) {
                if (lastMessage.item.viewed) {
                    viewController.elementProperty.removeClass(".not-viewed", "not-viewed");
                }
            }

        });
    }

    function getMessageBySocket() {
        updateMessages();
    }

    function updateMessages() {

        getMessagesByFirebase()
        
        // chatTripController.getMessages(trip.tripReference, result => {
        //     if (!result.status) {
        //         return;
        //     }

        //     clearMessage();

        //     elementProperty.getElement(".preload-audio", element => {
        //         element.remove();
        //     });

        //     result.data.map(item => {
        //         if (document.getElementById("chat" + item.idMessagesChatTrip) !== null)
        //             return;

        //         if (item.isAudio == true) {
        //             addAudio(item.message, DateCustom.getTimeNow(item.date), item.userId === userLogged.idUser, item.idMessagesChatTrip);
        //             return;
        //         }

        //         addMessage(item.message,
        //             DateCustom.getTimeNow(item.date),
        //             item.userId === userLogged.idUser, item.idMessagesChatTrip);
        //     });
        // });
    }

    elementProperty.visibleElements([".container-chat-trip"]);

    elementProperty.getElement(".name-establishment-chat", element => {
        element.innerHTML = trip.customerName;
    });

    function closeChat() {
        window.history.back();
    }

    function sendMessage() {

        elementProperty.getElement("#messageTripDriver", element => {
            if (element.value.trim().length === 0)
                return;

            addPreviewMessage(element.value);

            chatTripController.sendMessage(trip.tripReference, element.value, userLogged.idUser, result => {
            });
            element.value = "";

            elementProperty.removeClass(".option-message", "active");

            element.focus();
        });
    }

function addMessage(message, date, isDriver, idMessagesChatTrip, viewed) {
    if (message === null) {
        return;  
    }

    const element = $("#messagesDriver");
    const whoSent = isDriver ? `message-driver ${viewed ? "" : "not-viewed"}` : "message-client";

    if (message?.includes("call-number")) {
        element.append(`<li class="${message}" id="chat${idMessagesChatTrip}" content-call-customer="${getTextTranslate("chat","content-call-customer")}" content-call-driver="${getTextTranslate("chat","content-call-driver")}"></li>`);
        $("#continer-messages").scrollTop(element.height());
        return;
    }

    element.append(`<li class="${whoSent}" id="chat${idMessagesChatTrip}" content-read="${getTextTranslate("chat","content-read")}" content-delivery="${getTextTranslate("chat","content-delivery")}">
                    <div class="container-message">
                        <div class="time-message">${date}</div>
                        <pre class="message">${message}</pre>
                    </div>
                </li>`);
    $("#continer-messages").scrollTop(element.height());
}


    function addPreviewMessage(message) {
        const element = $("#messagesDriver");

        const whoSent = "message-driver";

        if (message.includes("call-number"))
            return;

        element.append(`<li class="${whoSent} preview-message" >
                        <div class="container-message">
                            <div class="time-message"></div>
                            <div class="message">${message}</div>
                        </div>
                    </li>`);
        $("#continer-messages").scrollTop(element.height());

    }

    function clearMessage() {
        /*if (trip.tripReference === Session.get("chatTripReferenceCurrent"))
            return;*/

        elementProperty.getElement("#messagesDriver", element => {
            element.innerHTML = "";
        });

        Session.set("chatTripReferenceCurrent", trip.tripReference)
    }

    elementProperty.addEventInElement(".back-page", "onclick", comeBackIndex);

    viewController.onBack(function () {
        chatRepository.close();
    });

    function comeBackIndex() {
        chatRepository.close();
        Route.backPage()
    }

    elementProperty.addEventInElement("#messageTripDriver", "oninput", function (event) {
        event.stopPropagation();
        this.style = "";

        elementProperty.removeClass(".option-message", "active");

        if (this.value.length > 0)
            elementProperty.addClass(".option-message", "active");

    });

    elementProperty.addEventInElement("#captureAudio", "ontouchstart", function (e) {
        if (captureAudio.audio != null && captureAudio.isLocked){
            return;
        }

        if(captureAudio.audio != null)
            return;
            
        captureAudio.startX = e.changedTouches[0].pageX;
        captureAudio.startY = e.changedTouches[0].pageY;

        captureAudio.nameAudio = new Date().getTime() + '.mp3';

        const src = cordova.file.externalDataDirectory +  captureAudio.nameAudio;

        captureAudio.audio = new Media(src, function (e) {
        }, function (err) {
        });

        captureAudio.audio.setRate(15);

        captureAudio.audio.startRecord();

        this.classList.add("active");
        captureAudio.element = null;
        captureAudio.isPress = true;  
        captureAudio.isLocked = false;  
        captureAudio.elapsed = 0;
        startTimerCountdown();

    });

    elementProperty.addEventInElement("#captureAudio", "ontouchmove", function (e) {
        this.classList.remove("delete");

        elementProperty.removeClass(".delete-audio", "active");

        const currentX = e.changedTouches[0].pageX;
        const diftX = currentX - captureAudio.startX;
        const difty = e.changedTouches[0].pageY - captureAudio.startY;

        if(diftX < -50 && Math.abs(difty) < 50 && !captureAudio.isLocked){

            captureAudio.isLocked = true;

            document.dispatchEvent(new Event("audioLocked"));

            this.classList.remove("active");

            elementProperty.addClass(".contentDataSend", "locked-recording"); 
            elementProperty.removeClass(".delete-audio", "active");

            elementProperty.getElement("#messageTripDriver", element => {
                element.setAttribute("placeholder", `Gravando...`);
            });
        }


        captureAudio.element = document.elementFromPoint(currentX, e.changedTouches[0].pageY);

        if (captureAudio.element && captureAudio.element.classList.contains("delete-audio")) {
            elementProperty.addClass(".delete-audio", "active");
            this.classList.add("delete");
        }
    });

    elementProperty.addEventInElement("#captureAudio", "ontouchend", endAudio);

    function startTimerCountdown() {
        clearInterval(captureAudio.timerInterval);

        captureAudio.elapsed = 0;

        captureAudio.timerInterval = setInterval(() => {

            captureAudio.elapsed++;

            let currentDuration = captureAudio.time - captureAudio.elapsed;
            if (currentDuration < 0) currentDuration = 0;

            
            const min = Math.floor(currentDuration / 60);
            const sec = currentDuration % 60;
            
            if (captureAudio.isLocked) {
                elementProperty.getElement(".audio-timer-locked", e => {
                    e.innerHTML = `${("00"+min).slice(-2)}:${("00"+sec).slice(-2)}`;
                });
            } else {
                elementProperty.getElement("#messageTripDriver", e => {
                    e.setAttribute("placeholder", `${("00"+min).slice(-2)}:${("00"+sec).slice(-2)}`);
                });
            }

            if (currentDuration <= 0) {
                clearInterval(captureAudio.timerInterval);

                if (captureAudio.isLocked) {
                    sendLockedAudio();
                } else {
                    endAudio();
                }

                return;
            }

        }, 1000);
    }

    function endAudio() {
    
    if (captureAudio.isLocked) {
        return; 
    }
    
    clearInterval(captureAudio.timerInterval);

    captureAudio.isPress = false; 

    elementProperty.getElement("#messageTripDriver", element => {
        element.setAttribute("placeholder", `Mensagem...`);
    });

    const captureAudioElement = document.getElementById("captureAudio");
    captureAudioElement.classList.remove("active");

    if (captureAudio.audio === null) {
        document.dispatchEvent(new Event("audioUnlocked"));
        return;
    }

    if (captureAudio.elapsed < 1) {
        removeAudio();
         document.dispatchEvent(new Event("audioUnlocked"));
        return;
    }

    if (captureAudio.element !== null && captureAudio.element.classList.contains("delete-audio")) {
        removeAudio();
        return;
    }
    captureAudio.audio.stopRecord();
    captureAudio.audio.stop();

    FileUpload.getFile(captureAudio.audio.src).then(file => {
        addAudioPre(file.localURL)
        captureAudio.audio.release();

        captureAudio.audio = null;

        FileUpload.prepareAudio(file).then(file => {

            document.dispatchEvent(new Event("audioUnlocked"));
                    
            chatTripController.sendMessageAudio(file, {
                tripReference: trip.tripReference, 
                userId: userLogged.idUser
            })
                .then(({status, data}) => {
                    captureAudio.elapsed = 0;
                    captureAudio.isPress = true;
                    captureAudio.element = null;
                    captureAudio.isLocked = false;
                    document.dispatchEvent(new Event("audioUnlocked"));

                }).catch(err => {
                    captureAudio.elapsed = 0;
                    captureAudio.isPress = true;
                    captureAudio.element = null;
                    captureAudio.isLocked = false;
                    clearInterval(captureAudio.timerInterval);
                    
                    document.dispatchEvent(new Event("audioUnlocked"));
                });
        });
    });

    }

    function removeAudio() {
        const captureAudioElement = document.getElementById("captureAudio");

        captureAudioElement.classList.remove("delete");
        elementProperty.removeClass(".delete-audio", "active");
        captureAudioElement.classList.add("animation-delete");

        elementProperty.removeClass(".contentDataSend", "locked-recording");
        elementProperty.getElement("#messageTripDriver", element => {
            element.setAttribute("placeholder", `Mensagem...`);
        });

        setTimeout(function () {
            captureAudioElement.classList.remove("animation-delete");
        }, 1500);

        if (captureAudio.audio != null) {
            captureAudio.audio.stopRecord();
            captureAudio.audio.stop();
            captureAudio.audio.release();
            captureAudio.audio = null;
        }
        captureAudio.elapsed = 0;
        captureAudio.isPress = true;
        captureAudio.element = null;
        captureAudio.isLocked = false;
        clearInterval(captureAudio.timerInterval);

    }
    
    function sendLockedAudio(){
        clearInterval(captureAudio.timerInterval); 

        if(!captureAudio.isLocked || captureAudio.audio == null){
            return;
        }

        document.dispatchEvent(new Event("audioUnlocked")); 

        elementProperty.removeClass(".contentDataSend", "locked-recording");

        elementProperty.getElement("#messageTripDriver", element => {
            element.setAttribute("placeholder", `Mensagem...`);
        });

        captureAudio.audio.stopRecord();
        captureAudio.audio.stop();

        FileUpload.getFile(captureAudio.audio.src).then(file => {
            addAudioPre(file.localURL)
            captureAudio.audio.release();

            captureAudio.audio = null; 

            FileUpload.prepareAudio(file).then(file => {
                chatTripController.sendMessageAudio(file, {
                    tripReference: trip.tripReference, 
                    userId: userLogged.idUser
                })
                    .then(({status, data}) => {
                        captureAudio.isLocked = false;
                        captureAudio.isPress = true;
                        captureAudio.elapsed = 0;
                        captureAudio.element = null;
                       
                     });
            }).catch(err => {
                captureAudio.isLocked = false;
                captureAudio.isPress = true;
                captureAudio.elapsed = 0;
                captureAudio.element = null;
            });

        });
    }


    function cancelLockedAudio() {
        if (!captureAudio.isLocked || captureAudio.audio == null) {
            clearInterval(captureAudio.timerInterval);
            return;
        }
        
        removeAudio(); 
        document.dispatchEvent(new Event("audioUnlocked"));

    }

    function addAudio(message, date, isDriver, idMessagesChatTrip) {

        const config = Session.get("configGeneral");
        const picturesLink = config?.find(item => {
            return item?.key === 'link_storage_pictures';
        });

        const finalLink = `${picturesLink?.value}chat/trip/`

        const element = $("#messagesDriver");

        const whoSent = isDriver ? "message-driver-audio" : "message-client-audio";

        element.append(`<li class="${whoSent}" id="chat${idMessagesChatTrip}">
                        <div>
                       <audio controls><source src="${finalLink}${trip.tripReference}/${message}" type="audio/mpeg"></audio>
                        </div>
                    </li>`);
        $("#continer-messages").scrollTop(element.height());
    }

    function addAudioPre(src) {
        const element = $("#messagesDriver");

        element.append(`<li class="message-driver-audio preload-audio">
                        <div>
                       <audio controls><source src="${src}" type="audio/mpeg"></audio>
                       </div>
                    </li>`);

        $("#continer-messages").scrollTop(element.height());

    }

    elementProperty.addEventInElement("#callNumberClient", "onclick", function () {
        window.plugins.CallNumber.callNumber((result) => {
            const trip = Session.get("tripDriver");

            chatTripController.sendMessage(trip.tripReference, "call-number call-customer", userLogged.idUser, result => {
            });

        }, (result) => {
            SwalCustom.messageDialog("", "Ops... não foi possível fazer a ligação", undefined, "warning");
        }, `0${trip.customer.phone.replace(/[^0-9\.]+/g, '')}`, true);

    });


    function requestPermissionAudio() {
        const permissions = cordova.plugins.permissions;

        permissions.requestPermission(permissions.RECORD_AUDIO, ()=>{
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE,()=>{},()=>{})
        }, ()=>{

        });
 
    }

    window.addEventListener('keyboardDidShow', (event) => {
        viewController.elementProperty.getElement("#continer-messages", element => {
            let total = (element.offsetHeight + element.scrollTop);

            let percent = element.scrollHeight * 0.1;

            if (total >= element.scrollHeight - percent) {
                const elementScroll = $("#messagesDriver");
                $("#continer-messages").scrollTop(elementScroll.height());
            }

        })
    });

});