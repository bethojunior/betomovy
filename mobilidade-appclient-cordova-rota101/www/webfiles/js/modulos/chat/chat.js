viewController.setObserver("chat-trip", function () {
    const captureAudio = {
        element: null,
        time: 15,
        isPress: true,
        audio: null,
        nameAudio: "",
        currentTime: 0
    };

    const chatTripSocket = new WebSocket(keyChat);

    const chatRepository = new ChatRepository();

    chatTripSocket.setChannel("chat-channel");

    const trip = Storaged.get("tripChat");

    const cityConfig = Session.get("cityConfig");

    if (typeof (checkEnabledCall) !== "undefined")
        checkEnabledCall();

    chatTripSocket.stopWebSocket(trip.tripReference);

    const userLogged = Session.get("user");

    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".close-chat-trip", "onclick", closeChat);
    elementProperty.addEventInElement(".btn-send-message", "onclick", sendMessage);

    clearMessage();

    stopNotificationChat();

    getPermission();


    if (cityConfig.status_realtime_database) {

        chatRepository.getCurrentMessages(trip.tripReference, (result) => {
            result.map(({item, id, type}) => {
                if (type === chatRepository.typeAdded) {
                    if (item.userId != Session.getValueInSession("user", "idUser")) {
                        if (!item.viewed) {
                            chatRepository.setViewMessage(id);
                        }
                    }

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
                        item.viewed || false);
                }

            });

            const lastMessage = result[result.length - 1];

            if (lastMessage) {
                if (lastMessage.item.viewed) {
                    viewController.elementProperty.removeClass(".not-viewed", "not-viewed");
                }
            }

        });
    } else {
        updateMessages();
        chatTripSocket.observerSocket(trip.tripReference, result => {
            updateMessages();
        });
    }

    function updateMessages() {
        ChatController.getMessages(trip.tripReference, result => {
            if (!result.status) {
                return;
            }

            clearMessage();

            elementProperty.getElement(".preload-audio", element => {
                element.remove();
            });

            elementProperty.getElement(".preview-message", element => {
                element.remove();
            });

            result.data.map(item => {
                if (document.getElementById("chat" + item.idMessagesChatTrip) !== null)
                    return;

                if (item.isAudio == true) {
                    addAudio(item.message,
                        DateCustom.getTimeNow(item.date),
                        item.userId === userLogged.idUser,
                        item.idMessagesChatTrip);
                    return;
                }

                addMessage(
                    item.message,
                    DateCustom.getTimeNow(item.date),
                    item.userId === userLogged.idUser,
                    item.idMessagesChatTrip,
                    item.viewed);
            });
        });
    }

    elementProperty.getElement(".name-establishment-chat", element => {
        element.innerHTML = trip.driver.nickname;
    });

    function closeChat() {
        window.history.back();
    }

    function sendMessage() {
        //  document.getElementById("continer-messages").style.height = "115vw";
        elementProperty.getElement("#messageTripDriver", element => {
            if (element.value.trim().length === 0)
                return;

            addPreviewMessage(element.value);

            ChatController.sendMessage(trip.tripReference, element.value, userLogged.idUser, result => {
            });
            element.value = "";

            elementProperty.removeClass(".option-message", "active");

            element.focus();
        });
    }

    function addMessage(message, date, isCustomer, idMessagesChatTrip, viewed = true) {
     if (message === null) {
        return; // Retorna sem fazer nada se a mensagem for nula
    }
        const whoSent = isCustomer ? `message-me ${viewed ? "" : "not-viewed"}` : "message-your";

        const element = $("#messagesDriver");

        if (message.includes("call-number")) {
            element.append(`<li class="${message}" id="chat${idMessagesChatTrip}"></li>`);
            $("#continer-messages").scrollTop(element.height());
            return;
        }

        element.append(`<li class="${whoSent}" id="chat${idMessagesChatTrip}">
                        <div class="container-message">
                            <div class="time-message">${date}</div>
                            <pre class="message">${message}</pre>
                        </div>
                    </li>`);

        $("#continer-messages").scrollTop(element.height());
    }

    function addAudioPre(src) {
        const element = $("#messagesDriver");

        const type = device.platform === "iOS" ?
            `<audio controls preload="auto"></audio>` :
            `<audio controls><source src="${src}" type="audio/mpeg"></audio>`;

        element.append(`<li class="message-me-audio preload-audio">
                       ${type}
                    </li>`);

        $("#continer-messages").scrollTop(element.height());
    }

    function addAudio(message, date, isCustomer, idMessagesChatTrip) {

        const element = $("#messagesDriver");

        const whoSent = !isCustomer ? "message-your-audio" : "message-me-audio";

        element.append(`<li class="${whoSent}" id="chat${idMessagesChatTrip}">
             <audio controls>
                <source src="${environment.hosts.hostAudioMessage}${trip.tripReference}/${message}">
             </audio>
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

    elementProperty.addEventInElement(".back-page", "onclick", function () {
        if (Keyboard.isVisible)
            return Keyboard.hide();

        chatTripSocket.stopWebSocket(trip.tripReference);
        stopNotificationChat();
        Route.backPage();
    });


    viewController.onBack(function () {
        chatRepository.close();
        chatTripSocket.stopWebSocket(trip.tripReference);
        stopNotificationChat();
    });

    function stopNotificationChat() {
        elementProperty.getElement(".chat-client", element => {
            element.classList.remove("active");
        })
    }

    elementProperty.addEventInElement("#messageTripDriver", "oninput", function () {
        elementProperty.removeClass(".option-message", "active");

        if (this.value.length > 0)
            elementProperty.addClass(".option-message", "active");

    });

    elementProperty.addEventInElement("#captureAudio", "ontouchstart", function (e) {
        Keyboard.hide();
        if (captureAudio.audio != null)
            return;

        captureAudio.nameAudio = new Date().getTime();

        const src = (device.platform === "iOS") ?
            captureAudio.nameAudio + '.wav'
            : cordova.file.externalDataDirectory + captureAudio.nameAudio + '.mp3';

        captureAudio.audio = new Media(src, function (e) {
        }, function (err) {
            console.log(err);
        });

        captureAudio.audio.setRate(15);

        captureAudio.audio.startRecord();

        this.classList.add("active");
        captureAudio.element = null;
        captureAudio.isPress = true;
        countTimeAudio(captureAudio.time);
    });

    elementProperty.addEventInElement("#captureAudio", "ontouchmove", function (e) {
        this.classList.remove("delete");

        elementProperty.removeClass(".delete-audio", "active");

        captureAudio.element = document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY);

        if (captureAudio.element.classList.contains("delete-audio")) {
            elementProperty.addClass(".delete-audio", "active");
            this.classList.add("delete");
        }
    });

    elementProperty.addEventInElement("#captureAudio", "ontouchend", endAudio);

    function countTimeAudio(time) {
        captureAudio.currentTime = time;

        if (time < 0 || !captureAudio.isPress) {
            endAudio();
            return;
        }
        elementProperty.getElement("#messageTripDriver", element => {
            element.setAttribute("placeholder", `00:${("00" + time).slice(-2)}`);
        });

        time--;

        setTimeout(function () {
            countTimeAudio(time);
        }, 1000);
    }

    function endAudio() {
        if (!captureAudio.isPress)
            return;

        elementProperty.getElement("#messageTripDriver", element => {
            element.setAttribute("placeholder", `Mensagem...`);
        });

        captureAudio.isPress = false;

        const captureAudioElement = document.getElementById("captureAudio");
        captureAudioElement.classList.remove("active");

        if (captureAudio.currentTime === captureAudio.time) {
            removeAudio();
            return;
        }

        if (captureAudio.element !== null) {
            if (captureAudio.element.classList.contains("delete-audio")) {
                removeAudio();
                return;
            }
        }

        captureAudio.audio.stopRecord();
        captureAudio.audio.stop();

        FileUpload.getFileAudio(captureAudio.audio.src).then(file => {
            addAudioPre(file.localURL);
            captureAudio.audio.release();
            captureAudio.audio = null;

            FileUpload.prepareAudio(file).then(file => {
                ChatController.sendMessageAudio(file, {
                    tripReference:
                    trip.tripReference, userId: userLogged.idUser
                }).then(({status, data}) => {

                });
            });
        });

    }

    function removeAudio() {
        const captureAudioElement = document.getElementById("captureAudio");

        captureAudioElement.classList.remove("delete");
        elementProperty.removeClass(".delete-audio", "active");
        captureAudioElement.classList.add("animation-delete");

        setTimeout(function () {
            captureAudioElement.classList.remove("animation-delete");
        }, 1500);

        if (captureAudio.audio != null) {
            captureAudio.audio.stopRecord();
            captureAudio.audio.stop();
            captureAudio.audio.release();
            captureAudio.audio = null;
        }
    }

    elementProperty.addEventInElement("#callNumberClient", "onclick", function () {
        window.plugins.CallNumber.callNumber((result) => {
            ChatController.sendMessage(trip.tripReference, "call-number call-driver", userLogged.idUser, result => {
            });
        }, (result) => {
            SwalCustom.messageDialog("", "Ops... não foi possível fazer a ligação", undefined, "warning");
        }, `0${trip.driver.phone.replace(/[^0-9\.]+/g, '')}`, true);
    });


    function getPermission() {
        const permissions = cordova.plugins.permissions;

        permissions.requestPermission(permissions.RECORD_AUDIO, () => {
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, () => {
            }, () => {
            })
        }, () => {

        });
    }

    function addPreviewMessage(message) {
        const element = $("#messagesDriver");

        const whoSent = "message-me";


        element.append(`<li class="${whoSent} preview-message" >
                        <div class="container-message">
                            <div class="time-message"></div>
                            <div class="message">${message}</div>
                        </div>
                    </li>`);
        $("#continer-messages").scrollTop(element.height());

    }

    /*elementProperty.addEventInElement("#messageTripDriver","onblur",()=>{
        Keyboard.hide();
    });*/
});
