var chatRepositoryRiderGlobal = null;

viewController.setObserver("chat-trip-selected-rider", (rider) => {
    const trip = rider.trip;

    const captureAudio = {
        element: null,
        time: 15,
        isPress: true,
        audio: null,
        nameAudio: "",
        currentTime: 0
    };

    document.querySelector("#callNumberClient").style.display = "none";

    const chatTripController = new ChatController();

    if (chatRepositoryRiderGlobal)
        chatRepositoryRiderGlobal.close();

    const chatRepository = new ChatRepository();
    chatRepositoryRiderGlobal = chatRepository;

    const elementProperty = new ElementProperty();

    const userLogged = Session.get("user");

    getMessagesByFirebase();

    clearMessage();

    requestPermissionAudio();

    elementProperty.addEventInElement(".btn-send-message", "onclick", sendMessage);
    elementProperty.addEventInElement(".close-chat-trip", "onclick", closeChat);

    elementProperty.addEventInElement("#messageTripDriver", "oninput", function (event) {
        event.stopPropagation();
        this.style = "";

        elementProperty.removeClass(".option-message", "active");

        if (this.value.length > 0)
            elementProperty.addClass(".option-message", "active");

    });

    viewController.elementProperty.getElement(".name-establishment-chat", element => {
        element.innerHTML = rider.driver.name;
    });

    viewController.onBack(function () {
        chatRepository.close();
    });

    function getMessagesByFirebase() {
        chatRepository.getCurrentMessagesRider(trip.tripReference, userLogged.idUser, (result) => {
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

    function closeChat() {
        window.history.back();
    }


    function sendMessage() {

        elementProperty.getElement("#messageTripDriver", element => {
            if (element.value.trim().length === 0)
                return;

            addPreviewMessage(element.value);

            ChatController.sendMessage(trip.tripReference, element.value, rider.userId, result => {
            });
            element.value = "";

            elementProperty.removeClass(".option-message", "active");

            element.focus();
        });
    }

    function addMessage(message, date, isCustomer, idMessagesChatTrip, viewed) {
        const element = $("#messagesDriver");

        const whoSent = isCustomer ? `message-me ${viewed ? "" : "not-viewed"}` : "message-your";

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

    function addPreviewMessage(message) {
        const element = $("#messagesDriver");

        const whoSent = "message-me";

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

    function addAudio(message, date, isCustomer, idMessagesChatTrip) {

        const element = $("#messagesDriver");

        const whoSent = isCustomer ? "message-me-audio" : "message-your-audio";

        element.append(`<li class="${whoSent}" id="chat${idMessagesChatTrip}">
                        <div>
                       <audio controls><source src="${environment.hosts.hostAudioMessage}${trip.tripReference}/${message}" type="audio/mpeg"></audio>
                        </div>
                    </li>`);
        $("#continer-messages").scrollTop(element.height());
    }

    function addAudioPre(src) {
        const element = $("#messagesDriver");

        element.append(`<li class="message-me-audio preload-audio">
                        <div>
                       <audio controls><source src="${src}" type="audio/mpeg"></audio>
                       </div>
                    </li>`);

        $("#continer-messages").scrollTop(element.height());
    }

    function clearMessage() {
        elementProperty.getElement("#messagesDriver", element => {
            element.innerHTML = "";
        });

        Session.set("chatTripReferenceCurrent", trip.tripReference)
    }

    function requestPermissionAudio() {
        const permissions = cordova.plugins.permissions;

        permissions.requestPermission(permissions.RECORD_AUDIO, () => {
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, () => {
            }, () => {
            })
        }, () => {

        });
    }

    elementProperty.addEventInElement("#captureAudio", "ontouchstart", function (e) {
        if (captureAudio.audio != null)
            return;

        captureAudio.nameAudio = new Date().getTime() + '.mp3';

        const src = cordova.file.externalRootDirectory + "return/audio/" + captureAudio.nameAudio;

        captureAudio.audio = new Media(src, function (e) {
        }, function (err) {
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

        addAudioPre(captureAudio.audio.src);

        FileUpload.getFile(captureAudio.audio.src).then(file => {

            //captureAudio.audio.play();
            //captureAudio.audio.pause();
            captureAudio.audio.release();

            captureAudio.audio = null;

            FileUpload.prepare(file).then(file => {
                ChatController.sendMessageAudio(file, {
                    tripReference:
                    trip.tripReference, userId: userLogged.idUser
                })
                    .then(({status, data}) => {
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
