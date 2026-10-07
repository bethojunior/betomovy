class FinishTrip {
    static show(trip, callbackClose) {
        if (trip.tripCallTypeId === TRIP_CALL_CORPORATE)
            return new Promise(resolve => {
                Session.delete("tripDriver");
                SwalCustom.messageDialog("", "Viagem concluida!", () => {
                }, "success");
                resolve();
                PreloadRequest.clear();
                FinishTrip.setupQrCodeButton(trip);
                callbackClose();
            });

        return new Promise(resolve => {
            const elementProperty = new ElementProperty();

            elementProperty.visibleElements([".modal-finish"], true);
            document.querySelector(".updateBalanceNow").classList.add("active");
            
            // Limpa mensagens de erro/sucesso anteriores
            FinishTrip.hidePixError();
            const paymentStatusMessage = document.getElementById('paymentStatusMessage');
            if (paymentStatusMessage) {
                paymentStatusMessage.style.display = 'none';
            }
            elementProperty.getElement(".steering-wheel-animation", element => {
                element.classList.add("stop");
            });

            if (trip.recalculatedPrice != null) {
                document.querySelector(".obs-trip-finished").innerHTML = trip.recalculatedPrice.message || "";
                document.querySelector(".obs-trip-finished").classList.add("active");
            } else {
                document.querySelector(".obs-trip-finished").innerHTML = "";
                document.querySelector(".obs-trip-finished").classList.remove("active");
            }
            if (!trip.priceRange) {
                document.querySelector("#typeTripPriceNormal").style.display = "block";
                document.querySelector("#typeTripPriceRange").style.display = "none";
            } else {
                document.querySelector("#typeTripPriceNormal").style.display = "none";
                document.querySelector("#typeTripPriceRange").style.display = "block";

                document.querySelector("#descriptionFinishedTrip").innerHTML = trip.priceRange.description;
            }

            if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER) {
                viewController.elementProperty.getElement(".info-trip", element => element.style.display = "none");
                FinishTrip.close(trip, callbackClose);
            } else {
                viewController.elementProperty.getElement(".info-trip", element => element.style = "");
            }

            viewController.elementProperty.getElement("#nameClientFinish", element => {
                if (trip.customer != null)
                    element.innerHTML = trip.customer.name;
            });

            viewController.elementProperty.getElement(".match-finished", element => {
                element.innerHTML = trip.origin.address;
            });

            FinishTrip.populateWaypoints(trip);

            viewController.elementProperty.getElement(".destiny-finished", element => {
                element.innerHTML = trip.destination.name;
            });

            FinishTrip.showTripSummary(trip);

            viewController.elementProperty.getElement("#tripPaymentForm", element => {
                element.innerHTML = trip.tripPaymentForm;
            });

            showBonusTripFinish(trip);

            Session.delete("tripDriver");

            FinishTrip.setupQrCodeButton(trip);


            resolve();

            elementProperty.getElement(".image-profile-driver", element => {
                const config = Session.get("configGeneral");
                const picturesLink = config.find(item => {
                    return item.key === 'link_storage_pictures';
                });

                const profileImage = trip.customer.profileImage
                const finalLink = `${picturesLink.value}customer/profile/compressed/${profileImage}`;

                if (trip.customer === null || trip.customer.profileImage === null) {
                    element.src = 'webfiles/img/icon/default.png';
                    return;
                }
                // element.src = CLIENT_PROFILE + trip.customer.profileImage;
                element.src = finalLink;
            });

            elementProperty.getElement(".container-img", element => {
                if (trip.customer === null || trip.customer.profileImage === null) {
                    element.style.backgroundImage = 'url(webfiles/img/icon/default.png)';
                    return;
                }
                // element.style.backgroundImage = `url(${CLIENT_PROFILE + trip.customer.profileImage})`;
                element.style.backgroundImage = `url(${finalLink})`;
            });

            elementProperty.getElement(".name-client-trip", element => {
                if (trip.customer === null){
                    return;
                }
                element.innerHTML = trip.customer.nickname;
            });

            PreloadRequest.clear();

            FinishTrip.close(trip, callbackClose);
        });
    }

    static close(trip, callback) {

        const elementProperty = new ElementProperty();

        elementProperty.addEventInElement(".close-trip-finish", "onclick", function () {
            elementProperty.visibleElements(['.modal-finish'], false);
            /*elementProperty.getElement(".steering-wheel-animation", element => {
                element.classList.remove("stop");
                callback();
            });*/

            setMonitoring(false);

            callback();


            if (trip.tripCallTypeId === TRIP_CALL_PARTNER)
                return;

            if (trip.tripCallTypeId === TRIP_CALL_KNOB)
                return;

            if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER)
                return;

            const evaluation = new Evaluation();

            const config = Session.get("cityConfig");

            if (config.showUserRating == false) {
                return evaluation.hidden();
            }

            function evaluateLocation(){
                const places = [];
                document.querySelectorAll(".blacklist-address-selected.active").forEach(element => {
                    places.push(JSON.parse(element.getAttribute("label")));
                });

                if (places.length > 0)
                    AddressBlacklistController.insert(places);
            }

            function reportAreaRisk(){
                document.querySelectorAll(".risk-area-address-selected.active").forEach(element => {
                    const result = JSON.parse(element.getAttribute("label"));

                    AddressBlacklistController.riskArea({
                        address: result.address,
                        latitude: parseFloat(result.latitude),
                        longitude: parseFloat(result.longitude),
                        tripReference: trip.tripReference,
                        userId: Session.get("user").idUser
                    })
                });
            }

            evaluation.show(trip, function (rating) {

                TripRatingController.rating(rating, trip.tripReference);

                evaluateLocation();

                reportAreaRisk();

                evaluation.hidden();
            })
        });
    }

   static showPixError(message) {
      const pixErrorMessage = document.getElementById('pixErrorMessage');
      const pixErrorText = document.getElementById('pixErrorText');
      const paymentStatusMessage = document.getElementById('paymentStatusMessage');
      
      if (pixErrorMessage && pixErrorText) {
          pixErrorText.textContent = message || 'Erro ao processar pagamento PIX';
          pixErrorMessage.style.display = 'flex';
          if (paymentStatusMessage) {
              paymentStatusMessage.style.display = 'none';
          }
      }
  }

  static hidePixError() {
      const pixErrorMessage = document.getElementById('pixErrorMessage');
      if (pixErrorMessage) {
          pixErrorMessage.style.display = 'none';
      }
  }

   static setupQrCodeButton(trip) {
      if (!trip) return;

      const qrCodeBtn = document.getElementById("generateQRCodeBtn");
      const qrCodeImg = document.getElementById("qrcodeImage");
      const qrCodeContainer = document.getElementById("qrCodeContainer");

      if (!qrCodeBtn || !qrCodeImg) return;

      // Limpa qualquer erro anterior
      FinishTrip.hidePixError();

      // Verifica se a configuração enable_pix_trip_end_ipag está desabilitada (0)
      const enablePixTripEnd = ConfigGeneral().get("enable_pix_trip_end_ipag");
      if (enablePixTripEnd == "0" || enablePixTripEnd == 0) {
          qrCodeBtn.style.display = "none";
          if (qrCodeContainer) {
              qrCodeContainer.style.display = "none";
          }
          return;
      }

      const paymentForm = (trip.tripPaymentForm || "").toLowerCase();
      const isCash = paymentForm.includes("dinheiro");

      if (!isCash) {
          qrCodeBtn.style.display = "none";
          if (qrCodeContainer) {
              qrCodeContainer.style.display = "none";
          }
          return;
      }

      qrCodeBtn.style.display = "inline-block"; 

      qrCodeBtn.replaceWith(qrCodeBtn.cloneNode(true));
      const newQrCodeBtn = document.getElementById("generateQRCodeBtn");

      newQrCodeBtn.addEventListener("click", () => {
          newQrCodeBtn.innerHTML = "Gerando QR Code...";
          newQrCodeBtn.disabled = true;

          const payload = {
              tripReference: trip.tripReference,
              amount: parseFloat(trip.price)
          };

          const options = {
              width: 256,
              height: 256,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: 1
          };

          ConnectionServer.sendRequest(
              "trip/payWithPixAtEnd",
              "POST",
              payload,
              (response) => {
                  if (response?.data?.payment_code) {
                      cordova.plugins.qrcodejs.encode(
                          "TEXT_TYPE",
                          response.data.payment_code,
                          (base64EncodedQRImage) => {
                              qrCodeImg.src = base64EncodedQRImage;
                              qrCodeImg.style.display = "block";
                              newQrCodeBtn.style.display = "none";

                              // Ocultar erro anterior se houver
                              FinishTrip.hidePixError();
                              
                              if (response.data.idTransaction) {
                                  FinishTrip.checkPixPaymentStatus(response.data.idTransaction);
                              }
                          },
                          (err) => {
                              FinishTrip.showPixError("Ocorreu um erro ao gerar QR Code. Tente novamente.");
                              newQrCodeBtn.innerHTML = "Gerar QR Code";
                              newQrCodeBtn.disabled = false;
                          },
                          options
                      );
                  } else {
                      const errorMessage = response?.message || response?.data?.message || "Erro ao obter código de pagamento PIX";
                      FinishTrip.showPixError(errorMessage);
                      newQrCodeBtn.innerHTML = "Gerar QR Code";
                      newQrCodeBtn.disabled = false;
                  }
              },
              (error) => {
                  const errorMessage = error?.message || error?.data?.message || "Erro ao gerar QR Code. Verifique sua conexão e tente novamente.";
                  FinishTrip.showPixError(errorMessage);
                  newQrCodeBtn.innerHTML = "Gerar QR Code";
                  newQrCodeBtn.disabled = false;
              },
              undefined,
              false
          );
      });
  }

   static checkPixPaymentStatus(transactionId) {
    let checkCount = 0;
    const maxChecks = 60;
    const paymentStatusMessage = document.getElementById('paymentStatusMessage');
    let checkInterval = null;
    let isModalOpen = true;

    const isModalVisible = () => {
        const modalFinish = document.querySelector('.modal-finish');
        return modalFinish && modalFinish.style.display !== 'none' && !modalFinish.classList.contains('hidden');
    };

    const checkStatus = () => {
        if (!isModalVisible()) {
            isModalOpen = false;
            if (checkInterval) {
                clearTimeout(checkInterval);
            }
            return;
        }

        checkCount++;

        ConnectionServer.sendRequest(
            `trip/pixStatus?transactionId=${transactionId}`,
            'GET',
            null,
            (response) => {
                if (!isModalVisible()) {
                    isModalOpen = false;
                    return;
                }

                const statusCode = response?.data?.transactionStatusId;

                if (statusCode === 1 || statusCode === '1') {
                    if (paymentStatusMessage) paymentStatusMessage.style.display = 'flex';
                    FinishTrip.hidePixError();
                    isModalOpen = false; // Para verificação após sucesso
                    return;
                }

                if (checkCount < maxChecks && isModalOpen) {
                    checkInterval = setTimeout(checkStatus, 10000);
                } else {
                    if (paymentStatusMessage) paymentStatusMessage.style.display = 'none';
                    isModalOpen = false;
                }
            },
            (error) => {
                if (isModalVisible()) {
                    const errorMsg = error?.message || error?.data?.message || "Erro ao verificar status do pagamento PIX";
                    FinishTrip.showPixError(errorMsg);
                }
                isModalOpen = false;
                return;
            }
        );
    };

    checkStatus();
  }

    static populateWaypoints(trip) {
        const waypoints = trip.tripWayPoints || trip.trip_way_points || [];
        const waypointsCount = waypoints.length;
        
        const elements = FinishTrip.getWaypointsFinishElements();
        
        if (!elements.card) return;
        
        if (waypointsCount === 0) {
            FinishTrip.hideWaypointsCard(elements);
            return;
        }
        
        FinishTrip.showWaypointsCard(elements);
        FinishTrip.resetWaypointsFinishState(elements);
        
        if (waypointsCount === 1) {
            FinishTrip.handleSingleWaypointFinish(elements, waypoints[0]);
        } else {
            FinishTrip.handleMultipleWaypointsFinish(elements, waypoints, waypointsCount);
        }
    }
    
    static getWaypointsFinishElements() {
        return {
            card: document.getElementById('waypointsFinishCard'),
            firstWaypoint: document.querySelector('.first-waypoint-finish'),
            list: document.getElementById('waypointsFinishList'),
            toggle: document.getElementById('waypointsFinishToggle'),
            moreBtn: document.getElementById('waypointsFinishMoreBtn'),
            moreText: document.getElementById('waypointsFinishMoreText')
        };
    }
    
    static hideWaypointsCard(elements) {
        elements.card.classList.remove('show');
        if (elements.firstWaypoint) elements.firstWaypoint.innerHTML = '';
    }
    
    static showWaypointsCard(elements) {
        elements.card.classList.add('show');
    }
    
    static resetWaypointsFinishState(elements) {
        if (elements.toggle) elements.toggle.classList.remove('expanded');
        if (elements.list) {
            elements.list.classList.remove('expanded');
            elements.list.innerHTML = '';
        }
    }
    
    static handleSingleWaypointFinish(elements, waypoint) {
        if (elements.firstWaypoint) elements.firstWaypoint.innerHTML = waypoint.address;
        if (elements.moreBtn) elements.moreBtn.style.display = 'none';
    }
    
    static handleMultipleWaypointsFinish(elements, waypoints, waypointsCount) {
        if (elements.firstWaypoint) elements.firstWaypoint.innerHTML = '';
        if (elements.moreBtn) elements.moreBtn.style.display = 'flex';
        if (elements.moreText) {
            elements.moreText.innerHTML = `+ ${waypointsCount} paradas`;
        }
        
        FinishTrip.populateWaypointsFinishList(elements, waypoints);
        FinishTrip.setupWaypointsFinishToggle(elements);
    }
    
    static populateWaypointsFinishList(elements, waypoints) {
        if (!elements.list) return;
        
        const listHtml = waypoints
            .map(waypoint => `<li>${waypoint.address}</li>`)
            .join('');
        
        elements.list.innerHTML = listHtml;
    }
    
    static setupWaypointsFinishToggle(elements) {
        if (!elements.moreBtn) return;
        
        elements.moreBtn.onclick = () => {
            if (elements.toggle) elements.toggle.classList.toggle('expanded');
            if (elements.list) elements.list.classList.toggle('expanded');
        };
    }

    /**
     * Exibe o resumo de distância e tempo até embarque e da corrida
     * @param {Object} trip - Objeto da corrida finalizada
     */
    static showTripSummary(trip) {
        const summary = FinishTrip.calculateTripSummary(trip);

        const boardingElement = document.getElementById("boardingDistanceTime");
        const tripElement = document.getElementById("tripDistanceTime");

        if (boardingElement) {
            boardingElement.textContent = `${summary.boarding.distance} km | ${summary.boarding.time} min`;
        }

        if (tripElement) {
            tripElement.textContent = `${summary.trip.distance} km | ${summary.trip.time} min`;
        }

        Session.delete("boardingEstimate");
    }

    /**
     * Obtém resumo de distância e tempo da corrida
     * @param {Object} trip - Objeto da corrida
     * @returns {Object} Resumo com dados de embarque e corrida
     */
    static calculateTripSummary(trip) {
        let boardingDistance = 0;
        let boardingTime = 0;
        let tripDistance = 0;
        let tripTime = 0;

        if (trip.distanceToBoarding !== undefined && trip.timeToBoarding !== undefined) {
            boardingDistance = parseFloat(trip.distanceToBoarding);
            boardingTime = parseInt(trip.timeToBoarding);
        } else {
            const boardingEstimate = Session.get("boardingEstimate");
            if (boardingEstimate && boardingEstimate.tripReference === trip.tripReference) {
                boardingDistance = parseFloat(boardingEstimate.distance || 0) / 1000;
                boardingTime = Math.ceil(parseInt(boardingEstimate.time || 0) / 60);
            }
        }

        if (trip.recalculatedPrice && trip.recalculatedPrice.newDistance) {
            tripDistance = parseFloat(trip.recalculatedPrice.newDistance || 0);
            tripTime = parseInt(trip.recalculatedPrice.newTripTime || trip.estimatedTripTime || 0);
        } else {
            tripDistance = parseFloat(trip.distance || 0);
            tripTime = parseInt(trip.estimatedTripTime || 0);
        }

        return {
            boarding: {
                distance: boardingDistance.toFixed(2),
                time: boardingTime
            },
            trip: {
                distance: tripDistance.toFixed(2),
                time: tripTime
            }
        };
    }
}