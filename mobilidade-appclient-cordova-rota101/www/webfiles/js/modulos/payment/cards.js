Route.waitView().then(() => {
    const elementProperty = new ElementProperty();
    const paymentCard = new PaymentCard();
    let callbackSelectCard = null;

    elementProperty.addEventInElement(".close-cards-modal", "onclick", function (e) {
        if (e && e.stopPropagation) e.stopPropagation();
        elementProperty.removeClass(".container-cards", "active");
    });

    elementProperty.addEventInElement("#containerCardsModal", "onclick", function (e) {
        if (e.target === this) {
            elementProperty.removeClass(".container-cards", "active");
        }
    });

    window.showModalCards = (callback) => {
        if (callback !== undefined)
            callbackSelectCard = callback;

        showCard().then(addEventSelectedCard);
        elementProperty.addClass(".container-cards", "active");
    };

    function addEventSelectedCard() {
        const items = document.querySelectorAll("#listCardPaymentModal .cards-list-select");
        items.forEach(item => {
            item.onclick = function (e) {
                if (e && e.stopPropagation) e.stopPropagation();
                elementProperty.removeClass(".container-cards", "active");
                try {
                    const rawVal = this.getAttribute("value");
                    const parsedCard = JSON.parse(rawVal);
                    if (callbackSelectCard !== null) {
                        callbackSelectCard(parsedCard);
                    }
                } catch (err) {
                    console.error("Erro ao selecionar cartão:", err);
                }
            };
        });
    }

    function showCard() {
        return new Promise(resolve => {
            elementProperty.getElement("#listCardPaymentModal", element => {
                const cards = Session.get("cards") || [];
                const currentSelected = Session.get("cardSelected") || {};
                const currentId = currentSelected.idCard || currentSelected.cardId || currentSelected.id || currentSelected.mpCardId;

                if (!cards || cards.length === 0) {
                    element.innerHTML = `
                    <li class="cards-empty-state" style="display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; text-align: center !important; padding: 36px 20px 28px !important; margin: 4px 0 !important; background: #f8fafc !important; border: 1.5px dashed #cbd5e1 !important; border-radius: 16px !important; list-style: none !important; width: 100% !important; box-sizing: border-box !important;">
                        <div class="cards-empty-icon-wrapper" style="width: 64px !important; height: 64px !important; border-radius: 16px !important; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important; color: #0284c7 !important; display: flex !important; align-items: center !important; justify-content: center !important; margin: 0 auto 16px auto !important; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.12) !important;">
                            <i class="material-icons" style="font-size: 32px !important; color: #0284c7 !important; line-height: 1 !important;">credit_card</i>
                        </div>
                        <h4 class="cards-empty-title" style="font-size: 16px !important; font-weight: 700 !important; color: #0f172a !important; margin: 0 0 6px 0 !important; font-family: inherit !important;">Nenhum cartão cadastrado</h4>
                        <p class="cards-empty-desc" style="font-size: 13px !important; color: #64748b !important; line-height: 1.5 !important; margin: 0 auto !important; max-width: 280px !important; font-family: inherit !important;">Cadastre um cartão de crédito para pagar suas viagens de forma rápida e segura.</p>
                    </li>`;
                    resolve();
                    return;
                }

                element.innerHTML = cards.map(card => {
                    const thisId = card.idCard || card.cardId || card.id || card.mpCardId;
                    const isSelected = currentId && thisId && String(currentId) === String(thisId);
                    const last4 = card.last4 || card.last_four || card.lastFourDigits || card.mpLastFourDigits || (card.number ? String(card.number).slice(-4) : "••••");
                    const rawBrand = (card.brand || card.paymentMethodName || card.mpPaymentMethodName || card.mpPaymentMethodId || "Cartão").toLowerCase();
                    const brandDisplay = rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1);
                    const exp = (card.expirationMonth && card.expirationYear) ? `${String(card.expirationMonth).padStart(2, '0')}/${String(card.expirationYear).slice(-2)}` : "";
                    const safe = JSON.stringify(card).replace(/'/g, "&apos;");

                    let brandBg = "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";
                    if (rawBrand.includes("visa")) {
                        brandBg = "linear-gradient(135deg, #1a1f71 0%, #0d1242 100%)";
                    } else if (rawBrand.includes("master")) {
                        brandBg = "linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)";
                    } else if (rawBrand.includes("elo")) {
                        brandBg = "linear-gradient(135deg, #00a4e8 0%, #000000 100%)";
                    } else if (rawBrand.includes("hiper")) {
                        brandBg = "linear-gradient(135deg, #b20000 0%, #660000 100%)";
                    }

                    return `<li class="cards-list-select ${isSelected ? 'active' : ''}" value='${safe}' style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 14px 16px !important; border: 1.5px solid ${isSelected ? '#0284c7' : '#e2e8f0'} !important; border-radius: 14px !important; background: ${isSelected ? '#f0f9ff' : '#ffffff'} !important; cursor: pointer !important; margin-bottom: 10px !important; list-style: none !important; box-sizing: border-box !important;">
                        <div style="display: flex !important; align-items: center !important; gap: 14px !important; min-width: 0 !important;">
                            <div style="width: 48px !important; height: 32px !important; border-radius: 8px !important; background: ${brandBg} !important; color: #ffffff !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 11px !important; font-weight: 800 !important; letter-spacing: 0.5px !important; flex-shrink: 0 !important; box-shadow: 0 2px 6px rgba(0,0,0,0.18) !important;">
                                ${brandDisplay.slice(0, 8)}
                            </div>
                            <div style="display: flex !important; flex-direction: column !important; min-width: 0 !important; text-align: left !important;">
                                <div style="display: flex !important; align-items: center !important; gap: 8px !important;">
                                    <span style="font-size: 14px !important; font-weight: 700 !important; color: #0f172a !important; letter-spacing: 0.5px !important;">•••• ${last4}</span>
                                    ${isSelected ? '<span style="display: inline-block !important; padding: 2px 8px !important; font-size: 10px !important; font-weight: 700 !important; background: #e0f2fe !important; color: #0284c7 !important; border-radius: 10px !important;">Atual</span>' : ''}
                                </div>
                                <span style="font-size: 12px !important; color: #64748b !important; margin-top: 2px !important;">${brandDisplay}${exp ? ` • Validade ${exp}` : ''}</span>
                            </div>
                        </div>
                        <div style="display: flex !important; align-items: center !important; flex-shrink: 0 !important; margin-left: 12px !important;">
                            ${isSelected 
                                ? '<div style="width: 28px !important; height: 28px !important; border-radius: 50% !important; background: #0284c7 !important; color: #ffffff !important; display: flex !important; align-items: center !important; justify-content: center !important;"><i class="material-icons" style="font-size: 18px !important; line-height: 1 !important;">check</i></div>'
                                : '<div style="width: 28px !important; height: 28px !important; border-radius: 50% !important; border: 2px solid #cbd5e1 !important; background: #ffffff !important;"></div>'
                            }
                        </div>
                    </li>`;
                }).join("");

                resolve();
            });
        });
    }

    elementProperty.addEventInElement("#addCardModal", "onclick", function (e) {
        if (e && e.preventDefault) e.preventDefault();
        const cards = Session.get("cards") || [];
        if (cards.length >= 5) {
            SwalCustom.messageDialog("", "Você só pode ter no máximo 5 cartões adicionados.", undefined, "info");
            return;
        }
        paymentCard.addCard();
        elementProperty.addClass(".container-add-card", "active");

        setTimeout(function () {
            if (typeof window.addCardManager !== "undefined") {
                window.addCardManager.callback = addCard;
            }
        }, 500);
    });

    function addCard() {
        setTimeout(function(){
            showModalCards(callbackSelectCard);
        }, 1000);
    }
});
