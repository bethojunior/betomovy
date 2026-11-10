<!-- Movy Central Deploy: 2026-10-31 - Mobile address bottom-sheet + layout fix -->
<div class="container-main-map">
    <div class="list-trips-active-partner">
        <div class="container-trips">
            <div class="header-trips">
                <i class="material-icons close-trip-actives">arrow_back</i>
                <svg class="header-trips__whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                <p style="display: none">Active Trips</p>
                <button type="button" class="header-trips__scheduled-toggle active" id="toggleScheduledTrips" style="display: none">
                    <span class="header-trips__scheduled-count" id="scheduledTripsCount">0</span>
                    Scheduled
                    <i class="material-icons">visibility_off</i>
                </button>
                <button type="button" class="header-trips__filter-toggle" id="toggleActiveTripsFilter" aria-label="Filter trips">
                    <i class="material-icons">tune</i>
                </button>
                <div class="header-trips__filter-dropdown" id="activeTripsFilterDropdown">
                    <label class="header-trips__filter-label">Customer</label>
                    <input type="text" class="header-trips__filter-text-input" id="activeTripsFilterCustomerName" placeholder="Customer name">

                    <label class="header-trips__filter-label">Driver</label>
                    <input type="text" class="header-trips__filter-text-input" id="activeTripsFilterDriverName" placeholder="Driver name">

                    <label class="header-trips__filter-label">Status</label>
                    <select class="header-trips__filter-select" id="activeTripsFilterStatus">
                        <option value="">All statuses</option>
                        <option value="searching">Searching driver</option>
                        <option value="pre_accepted">Accepted (waiting)</option>
                        <option value="accepted">Accepted</option>
                        <option value="boarding">Boarding</option>
                        <option value="in_progress">In progress</option>
                    </select>

                    <div class="header-trips__filter-actions">
                        <button type="button" class="header-trips__filter-clear" id="btnClearActiveTripsFilter">Clear</button>
                        <button type="button" class="header-trips__filter-apply" id="btnApplyActiveTripsFilter">Filter</button>
                    </div>
                </div>
            </div>
            <div class="body-trips">
                <div class="mt-4 list-trip-message-wrap">
                    <p class="text-center" id="listTripMessage"></p>
                    <svg class="list-trip-message__whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                </div>
                <ul class="border-0" id="listTripPartner"></ul>
            </div>
        </div>
        <div class="nav-drawer">
            <i class="material-icons">
                arrow_forward_ios
            </i>
        </div>
    </div>
    <div id="mapWrapper" class="map-client">
        <div class="container-trip-active">
            <button type="button" class="btn btn-primary" id="showMessageTripActive">Active Trips</button>
            <button type="button" class="btn btn-success btn-whatsapp-call" id="showWhatsappTripActive">
                <svg class="trip-active-map-btn__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                <span class="trip-active-map-btn__label">WhatsApp Calls</span>
            </button>
        </div>
        <div class="container-chat-map">
            <div class="box-chat">
                <img class="img-chattrip" src="<?php echo Host::getLocal() ?>webfiles/img/icon/chat.png">
            </div>
            <div class="container-box-chat">
                <i class="material-icons close-chat">arrow_back</i>
                <ul class="list-chat"></ul>
                <div class="container-chat-open">
                    <div class="title-chat">
                        <span id="nameDriverChat"></span>
                        <i class="material-icons close-box-chat">arrow_back</i>
                    </div>
                    <div class="container-chat">
                        <ul id="centralMessages"></ul>
                        <div>
                            <input type="text" placeholder="Type a message..." id="sendMessageByCentral" />
                            <button type="button" class="btn-send-messaga" id="btnSendMessage">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="mapClient" class="map-client map-loading"></div>
        <div class="btn-call-trip">
            <button type="button" class="option-selected-customer-trip" id="openModalFindCustomer">FIND PASSENGER</button>
            <button type="button" class="option-selected-customer-trip" id="openModalFindDriver">FIND DRIVER</button>
            <button type="button" class="option-selected-customer-trip" id="callToCentral">DISPATCH RIDE</button>
        </div>
        <!-- MOVY SEARCH DRIVER — UBER-STYLE BOTTOM SHEET -->
        <div class="search-driver-in-trip">
            <!-- Overlay escuro atrás do sheet -->
            <div class="sdit-overlay"></div>

            <!-- Bottom Sheet principal -->
            <div class="sdit-sheet">

                <!-- Handle bar -->
                <div class="sdit-handle"></div>

                <!-- Linear Indeterminate Progress Bar (Uber Style) -->
                <div class="sdit-progress-bar">
                    <div class="sdit-progress-indeterminate"></div>
                </div>

                <!-- ══════ STATE: SEARCHING ══════ -->
                <div class="sdit-state sdit-state-searching">

                    <!-- Header com Título e Subtítulo -->
                    <div class="sdit-header">
                        <span class="sdit-category-badge" id="searchTripCategoryPill">
                            <span id="searchTripCategoryName">Movy</span>
                        </span>
                        <h3 class="sdit-title" id="pharseTrip">Searching for nearby drivers...</h3>
                        <p class="sdit-subtitle">Please wait, connecting you with the closest eligible driver</p>
                    </div>

                    <!-- Animação do carro + radar -->
                    <div class="sdit-anim-wrap">
                        <!-- Radar rings -->
                        <div class="radar-ring radar-ring-1"></div>
                        <div class="radar-ring radar-ring-2"></div>
                        <div class="radar-ring radar-ring-3"></div>
                        <!-- Estrada -->
                        <div class="road-track">
                            <div class="road-dashes">
                                <span class="road-dash"></span>
                                <span class="road-dash"></span>
                                <span class="road-dash"></span>
                                <span class="road-dash"></span>
                                <span class="road-dash"></span>
                            </div>
                        </div>
                        <!-- Carro animado -->
                        <div class="car-anim-container">
                            <img id="searchTripVehicleImg" src="webfiles/img/icon/carro_eco.png" alt="Veículo" class="car-anim-img" />
                        </div>
                    </div>

                    <!-- Meta row: Fare / Duration / Payment -->
                    <div class="sdit-meta-row">
                        <div class="sdit-meta-item">
                            <span class="sdit-meta-label">Fare</span>
                            <b class="sdit-meta-val sdit-price" id="searchTripPriceValue">—</b>
                        </div>
                        <div class="sdit-meta-sep"></div>
                        <div class="sdit-meta-item">
                            <span class="sdit-meta-label">Duration</span>
                            <span class="sdit-meta-val" id="searchTripEta">—</span>
                        </div>
                        <div class="sdit-meta-sep"></div>
                        <div class="sdit-meta-item">
                            <span class="sdit-meta-label">Payment</span>
                            <span class="sdit-meta-val" id="searchTripPayment">—</span>
                        </div>
                    </div>

                    <!-- Pickup & Dropoff Route -->
                    <div class="sdit-route">
                        <div class="sdit-route-item">
                            <span class="sdit-route-dot sdit-route-dot-origin"></span>
                            <p class="sdit-route-text" id="searchTripOriginText">Pickup location</p>
                        </div>
                        <div class="sdit-route-line-wrap"><div class="sdit-route-line"></div></div>
                        <div class="sdit-route-item">
                            <span class="sdit-route-dot sdit-route-dot-dest"></span>
                            <p class="sdit-route-text sdit-route-dest" id="searchTripDestText">Dropoff destination</p>
                        </div>
                    </div>

                    <!-- Cancel search button -->
                    <button type="button" class="sdit-cancel-btn cancel-search-trip">
                        <i class="material-icons">close</i>
                        <span>Cancel Search</span>
                    </button>
                </div>

            </div><!-- /sdit-sheet -->
        </div><!-- /search-driver-in-trip -->

        <div class="trip-client">
            <div class="trip-client-card" id="tripClientCard">
                <header class="trip-client-card-header">
                    <span class="trip-client-badge">
                        <i class="material-icons">directions_car</i> Driver En Route
                    </span>
                    <button type="button" class="trip-client-btn-close" id="btnMinimizeTripClient" aria-label="Minimize">
                        <i class="material-icons">expand_more</i>
                    </button>
                </header>

                <div class="trip-client-driver-row">
                    <div class="trip-client-avatar-wrapper">
                        <div class="image-profile-driver"></div>
                    </div>
                    <div class="trip-client-driver-details">
                        <h3 id="nameDriver" class="name-driver-trip">Driver</h3>
                        <div class="trip-client-car-plate-badge">
                            <span id="carPlateDriver" class="car-plate-driver">---</span>
                        </div>
                        <p id="carBrandDriver" class="car-brand-driver"></p>
                    </div>
                </div>

                <div class="trip-client-route-preview">
                    <div class="trip-client-route-item origin">
                        <span class="route-dot origin"></span>
                        <div class="route-text">
                            <label>Pickup</label>
                            <p id="tripClientOriginText">Pickup point</p>
                        </div>
                    </div>
                    <div class="trip-client-route-item destination">
                        <span class="route-dot destination"></span>
                        <div class="route-text">
                            <label>Dropoff</label>
                            <p id="tripClientDestText">Destination</p>
                        </div>
                    </div>
                </div>

                <div class="trip-client-actions">
                    <button type="button" class="trip-client-action-btn btn-share" id="shareTripApp">
                        <i class="material-icons">share</i> Share
                    </button>
                    <button type="button" class="trip-client-action-btn btn-cancel-trip" id="cancelTrip">
                        <i class="material-icons">close</i> Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="container-menu" id="containerMenu">
        <div class="container-logo" id="callRunning">
            <header class="trip-panel-header" id="tripPanelHeader">
                <button type="button" class="trip-panel-dismiss" id="btnCloseTripPanel" aria-label="Close panel">
                    <i class="material-icons" aria-hidden="true">close</i>
                </button>
                <h2 class="trip-panel-title">Trip Route & Dispatch</h2>
            </header>
            <div class="form-trip" id="formPassenger">
                <div class="form-data-passenger">
                    <div class="address-fields">
                        <div>
                            <input type="text" id="originSelected" class="input-custom select-type-place origin-place" readonly place="origin" placeholder="Enter pickup location" autocomplete="off">
                            <i class="material-icons clear-input" for="origin">close</i>
                        </div>
                        <div id="containerInputDestination">
                            <input type="text" id="destinationSelected" class="input-custom select-type-place destination-place" readonly place="destination" autocomplete="off" placeholder="Where to?">
                            <i class="material-icons clear-input" for="destination">close</i>
                        </div>
                    </div>
                    <button type="button" id="swapAddressBtn" class="swap-address-btn" aria-label="Swap pickup and destination">
                        <i class="material-icons">swap_vert</i>
                        <span class="app-tooltip app-tooltip--left">Swap pickup and destination</span>
                    </button>
                </div>
            </div>
            <div class="container-footer-local">
                <a href="#" class="small add-place-stop">Add stop</a>
                <button type="button" id="btnCalculatePriceByPlaces" class="btn-route-advance">Continue</button>
            </div>
            <div class="container-search-local">
                <i class="material-icons back-address">arrow_back</i>
                <div class="content-search-local">
                    <input type="text" class="search-address-location" />
                </div>
                <div class="history-trips">

                    <div class="places-save">
                        <ul id="containerCustomerPlaces"></ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-container-trip">
        <!-- Uber Drag Handle -->
        <div class="uber-sheet-handle"></div>

        <!-- Uber Header -->
        <div class="uber-sheet-header">
            <h3 class="uber-sheet-title">Ride Categories</h3>
            <span class="uber-sheet-subtitle">Select a category to dispatch</span>
        </div>

        <div class="container-box-price">
            <div class="type-cars"></div>
            <div class="indication-list-prices" style="display: none;"></div>
            <div class="arrows-indication-list" style="display: none;">
                <div class="prev-container-price">
                    <i class="material-icons">keyboard_arrow_left</i>
                </div>
                <div class="next-container-price">
                    <i class="material-icons">keyboard_arrow_right</i>
                </div>
            </div>
        </div>

        <!-- Uber-Style Bottom Action Bar (2 Rows) -->
        <div class="uber-bottom-action-bar">
            <!-- Row 1: Payment Method Pill -->
            <div class="uber-payment-row">
                <div class="payment-trip" id="choicePaymentTrip" role="button" tabindex="0" title="Payment Method">
                    <div class="uber-payment-pill-left">
                        <i class="material-icons payment-pill-icon">credit_card</i>  
                        <p id="namePaymentForm">Cash</p>
                    </div>
                    <i class="material-icons payment-pill-chevron">chevron_right</i>
                </div>
                <div id="cardSelectedPayTrip" style="display: none;"></div>
            </div>

            <!-- Row 2: Confirm Primary Button + Schedule + QR -->
            <div class="uber-confirm-row">
                <div class="switch-type-trip">
                    <button type="button" class="btn-qrcode-driver-trip" title="Scan QR Code"><i class="material-icons">qr_code_scanner</i></button>
                    <button type="button" class="btn-search-trip btn-search" style="display: none" id="list-active-drivers">
                        Custom Ride
                    </button>
                    <button type="button" class="btn-search-trip btn-search">CONTINUE</button>
                </div>
                <div class="schedule-trip" id="choiceScheduleTrip" role="button" tabindex="0" title="Schedule Trip">
                    <i class="material-icons">event</i>
                    <p id="nameScheduleTrip" style="display: none;">Schedule</p>
                </div>
            </div>
        </div>

        <div id="container-anti-uber" style="display: none">
            <hr class="anti-uber-section-sep">
            <div class="title-anti-uber">
                <h4>Competitor Rate Analyzer</h4>
                <div id="div-get-cookies" class="anti-uber-cookie-row">
                    <input class="form-control" type="text" id="cookie-anti-uber" autocomplete="off" placeholder="Paste cookie JSON here">
                    <button type="button" class="btn btn-info anti-uber-search-btn" id="generate-value-au" aria-label="Search competitor prices">
                        <span class="anti-uber-search-label">Search</span>
                        <i class="material-icons anti-uber-search-icon" aria-hidden="true">search</i>
                    </button>
                </div>
            </div>
            <hr class="anti-uber-section-sep">
            <div class="anti-uber-items" id="can-show-antiuber">
                <p id="anti-uber-placeholder" class="anti-uber-placeholder">
                    Paste cookie in the field above.
                </p>
                <div class="anti-uber-results-wrap anti-uber-results-wrap--hidden">
                    <button type="button" class="anti-uber-scroll-btn anti-uber-scroll-btn--prev" id="antiUberScrollPrev" aria-label="Previous options">
                        <i class="material-icons" aria-hidden="true">chevron_left</i>
                    </button>
                    <div class="anti-uber-results-inner">
                        <div id="anti-uber-results" class="anti-uber-results" aria-live="polite"></div>
                        <div id="spinner-antiuber" class="anti-uber-spinner" role="status" style="display: none;" aria-hidden="true">
                            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        </div>
                    </div>
                    <button type="button" class="anti-uber-scroll-btn anti-uber-scroll-btn--next" id="antiUberScrollNext" aria-label="Next options">
                        <i class="material-icons" aria-hidden="true">chevron_right</i>
                    </button>
                </div>
            </div>
        </div>

        <div class="list-drivers-favorite">
            <h4>Available Preferred Drivers</h4>
            <ul id="listDriversFavorites"></ul>
        </div>
    </div>
    <div class="footer-payment-form">
        <div class="title-footer">
            <p>Payment Methods</p>
            <i class="material-icons close-payment-form">close</i>
        </div>
        <p>Select Payment Method</p>
        <ul class="list-payment-forms"></ul>
        <a id="addPaymentForm" class="add-payment-form" href="javascript:void(0)">Add Credit Card</a>
    </div>

    <div class="container-cards" id="containerCardsModal" style="position: fixed; inset: 0; z-index: 1200; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box;">
        <div class="cards-modal-dialog" style="background: #ffffff; border-radius: 20px; width: 100%; max-width: 440px; border: 1px solid rgba(226, 232, 240, 0.9); box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.25), 0 8px 16px -6px rgba(15, 23, 42, 0.08); overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box;">
            <div class="cards-modal-header" style="display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; background: #ffffff;">
                <div class="cards-modal-header-info" style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
                    <span class="cards-modal-title" style="font-size: 18px; font-weight: 700; color: #0f172a; line-height: 1.25; letter-spacing: -0.2px;">Select Payment Card</span>
                    <span class="cards-modal-subtitle" style="font-size: 13px; color: #64748b; font-weight: 500; line-height: 1.3;">Choose the card to charge for this trip</span>
                </div>
                <button type="button" class="cards-modal-close-btn close-cards-modal" aria-label="Close modal" style="width: 36px; height: 36px; border-radius: 50%; border: none; background: #f1f5f9; color: #475569; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; flex-shrink: 0;">
                    <i class="material-icons" style="font-size: 20px; line-height: 1;">close</i>
                </button>
            </div>
            <div class="cards-modal-body" style="padding: 16px 20px; max-height: 360px; overflow-y: auto;">
                <ul id="listCardPaymentModal" class="cards-modal-list" style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px;"></ul>
            </div>
            <div class="cards-modal-footer" style="padding: 16px 20px 20px; background: #ffffff; border-top: 1px solid #f1f5f9;">
                <a id="addCardModal" class="cards-modal-add-btn" href="javascript:void(0)" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px 20px; border-radius: 12px; background: #2563eb; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; box-sizing: border-box; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);">
                    <i class="material-icons" style="font-size: 20px; line-height: 1;">add_card</i>
                    <span>Add New Card</span>
                </a>
            </div>
        </div>
    </div>

    <div class="container-add-card" id="containerAddCard" style="position: fixed; inset: 0; width: 100%; height: 100%; display: none; z-index: 1300; background-color: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); justify-content: center; align-items: center; padding: 16px; box-sizing: border-box;">
        <div style="background: #ffffff; width: min(460px, 94vw); max-height: 92vh; display: flex; flex-direction: column; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.15); border: 1px solid #e2e8f0;">
            <nav style="min-height: 60px; background: #2563eb; width: 100%; padding: 14px 20px; color: #fff; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button type="button" id="backPaymentForm" style="width: 34px; height: 34px; border-radius: 50%; border: none; background: rgba(255, 255, 255, 0.12); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;">
                        <i class="material-icons" style="font-size: 20px; line-height: 1;">arrow_back</i>
                    </button>
                    <div>
                        <p style="margin: 0; font-size: 16px; font-weight: 700; color: #ffffff; line-height: 1.2;">Add Credit Card</p>
                        <span style="font-size: 12px; color: #94a3b8;">Credit card for trip fare billing</span>
                    </div>
                </div>
            </nav>
            <form method="post" id="addCard" name="addCard" autocomplete="off" style="overflow-y: auto; padding: 22px 24px 24px; margin: 0;">
                <div style="margin-bottom: 18px;">
                    <label for="cardholderName" style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Cardholder Name</label>
                    <input type="text" id="cardholderName" data-checkout="cardholderName" placeholder="Ex: JOHN DOE" style="width: 100%; height: 46px; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 0 14px; font-size: 14px; color: #0f172a; text-transform: uppercase; outline: none; box-sizing: border-box;" />
                </div>
                <div class="divider-container" style="margin-bottom: 18px;">
                    <div>
                        <label for="documentCard" style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Tax ID / SSN</label>
                        <input type="tel" id="documentCard" placeholder="000-00-0000" style="width: 100%; height: 46px; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 0 14px; font-size: 14px; color: #0f172a; outline: none; box-sizing: border-box;" />
                    </div>
                </div>
                <div style="margin-bottom: 18px;">
                    <label for="cardNumber" style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Card Number</label>
                    <div style="position: relative;">
                        <i class="material-icons" style="position: absolute; left: 14px; top: 13px; color: #94a3b8; font-size: 20px;">credit_card</i>
                        <input type="tel" id="cardNumber" data-checkout="cardNumber" placeholder="0000 0000 0000 0000" autocomplete="off" style="width: 100%; height: 46px; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 0 14px 0 44px; font-size: 14px; letter-spacing: 1px; color: #0f172a; outline: none; box-sizing: border-box;" />
                    </div>
                </div>
                <div class="divider-container" style="display: flex; gap: 14px; margin-bottom: 22px;">
                    <div style="flex: 1;">
                        <label for="dateMonthYear" style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Expiration</label>
                        <input type="tel" id="dateMonthYear" placeholder="MM/YY" style="width: 100%; height: 46px; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 0 14px; font-size: 14px; text-align: center; color: #0f172a; outline: none; box-sizing: border-box;" />
                    </div>
                    <div style="flex: 1;">
                        <label for="securityCode" style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">CVC / CVV</label>
                        <input type="tel" id="securityCode" data-checkout="securityCode" placeholder="123" autocomplete="off" style="width: 100%; height: 46px; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 0 14px; font-size: 14px; text-align: center; color: #0f172a; outline: none; box-sizing: border-box;" />
                    </div>
                </div>
                <div hidden>
                    <input type="text" id="cardExpirationMonth" data-checkout="cardExpirationMonth"/>
                    <input type="text" id="cardExpirationYear" data-checkout="cardExpirationYear"/>
                    <input type="text" id="docNumber" data-checkout="docNumber"/>
                    <select id="docType" data-checkout="docType"><option value="CPF" selected>CPF</option></select>
                </div>
                <button type="submit" style="width: 100%; height: 48px; border: none; background: #0284c7; color: #ffffff; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25);">
                    Save Card
                </button>
            </form>
        </div>
    </div>
    <div class="footer-schedule-form" id="footerScheduleForm">
        <div class="title-footer">
            <p>Schedule Trip</p>
            <i class="material-icons close-schedule-form">close</i>
        </div>
        <div class="schedule-picker-panel" id="schedulePickerPanel">
            <label for="schedulePickerTime" class="schedule-picker-section-label">Pickup Time</label>
            <div class="schedule-picker-time-row">
                <input type="time" id="schedulePickerTime" class="form-control" />
            </div>
            <div class="schedule-picker-time-chips" id="schedulePickerTimeChips"></div>

            <p class="schedule-picker-section-label">Pickup Date</p>
            <div class="schedule-picker-calendar">
                <div class="schedule-picker-calendar__header">
                    <button type="button" class="schedule-picker-calendar__nav" id="schedulePickerPrevMonth" aria-label="Previous month">
                        <i class="material-icons">chevron_left</i>
                    </button>
                    <span id="schedulePickerMonthLabel"></span>
                    <button type="button" class="schedule-picker-calendar__nav" id="schedulePickerNextMonth" aria-label="Next month">
                        <i class="material-icons">chevron_right</i>
                    </button>
                </div>
                <div class="schedule-picker-calendar__weekdays">
                    <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div class="schedule-picker-calendar__days" id="schedulePickerCalendarDays"></div>
            </div>

            <div class="schedule-picker-summary">
                <span id="schedulePickerCount">0 dates selected</span>
                <button type="button" class="schedule-picker-clear" id="schedulePickerClear">Clear</button>
            </div>

            <p class="schedule-picker-section-label">Drivers</p>
            <label class="schedule-picker-toggle" for="scheduleDriverPoolToggle">
                <input type="checkbox" id="scheduleDriverPoolToggle">
                <span>Assign to specific drivers</span>
            </label>
            <button type="button" class="schedule-picker-driver-pool-btn" id="scheduleDriverPoolOpen" style="display: none;">
                <i class="material-icons">group</i>
                <span id="scheduleDriverPoolSummary">Select drivers</span>
            </button>
        </div>

        <button type="button" class="schedule-picker-apply" id="btnApplyScheduleForm">APPLY</button>
    </div>
</div>
    <div class="map-zoom-controls" id="mapZoomControls" role="group" aria-label="Map zoom controls">
        <button type="button" class="map-zoom-btn map-zoom-btn-in" id="mapZoomIn" aria-label="Zoom in" title="Zoom in">
            <svg class="map-zoom-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
        <div class="map-zoom-divider" aria-hidden="true"></div>
        <button type="button" class="map-zoom-btn map-zoom-btn-out" id="mapZoomOut" aria-label="Zoom out" title="Zoom out">
            <svg class="map-zoom-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
    </div>
<div class="container-cancel-request-trip">
    <div>
        <h4>Cancel Trip</h4>
        <p id="messageCancelTrip">We are searching for your driver.</p>
        <div>
            <button type="button" id="btnCancelTripRequest">YES, CANCEL</button>
            <button type="button" id="btnCancelModalTripRequest">NO</button>
        </div>
    </div>
</div>
<div class="preloader-search-trip">
    <div>
        <img class="setas-return" src="webfiles/img/icon/setas-return.png">
        <img class="car-return" src="<?php echo Host::getCentral(); ?>default.jpg">
    </div>
    <p>Dispatching Ride</p>
    <h3 class="time-search-trip"></h3>
    <i class="fa fa-times-circle cancel-search-trip"></i>
</div>
<div class="container-point-local-map">
    <div class="point-local-handle" aria-hidden="true"></div>
    <p class="point-local-hint">
        <i class="material-icons">open_with</i>
        Move map to adjust location
    </p>
    <div class="point-local-address">
        <i class="material-icons">place</i>
        <span id="namePointUser"></span>
    </div>
    <button type="button" id="btnConfirmationPointLocalUser">Confirm Location</button>
</div>

<div aria-live="polite" aria-atomic="true" style="position: absolute;top: 100px; right: 10px;z-index: 10">
    <!-- Position it -->
    <div id="toastAlert"></div>
</div>

<footer class="footer-monitoring-trip" id="footerMonitoring">

    <button class="footer-toggle-btn default-blue hidden" id="toggleMonitoringBtn">
        <span class="footer-toggle-label">Trip Summary</span>
        <i class="material-icons footer-toggle-icon">expand_less</i>
    </button>

    <div class="monitoring-content hidden" id="monitoringContent">

        <div class="monitoring-header hidden" id="monitoringHeader">
            <div class="monitoring-status-left">
                <span class="status-text">
                    <span class="mon-dot mon-dot--on"></span>
                    Available <strong id="infoAvailable">0</strong>
                </span>
                <span class="status-text">
                    <span class="mon-dot mon-dot--off"></span>
                    Busy <strong id="infoOccupied">0</strong>
                </span>
                <span class="status-text mon-time">
                    <span id="infoUpdatedAt">-</span>
                    <button class="reload-btn" id="reloadBtn" title="Refresh">
                        <i class="material-icons" style="font-size:14px;font-family:'Material Icons'">refresh</i>
                    </button>
                </span>
            </div>
        </div>

        <div class="monitoring-cards">

            <div class="stat-card monitoring-clickable" id="tripsCard">
                <p class="sc-title">Trips <span id="totalTrips">0</span></p>
                <div class="stat-details">
                    <p>Accepted <span id="acceptedTrips">0</span></p>
                    <p>Completed <span id="finishedTrips">0</span></p>
                </div>
            </div>

            <div class="stat-card monitoring-clickable" id="showCancelledTrips">
                <p class="sc-title sc-title--red">Cancelled <span id="cancelledTrips">0</span></p>
                <div class="stat-details">
                    <p>Driver <span id="cancelledByDriver">0</span></p>
                    <p>Customer <span id="cancelledByCustomer">0</span></p>
                </div>
            </div>

            <div class="stat-card" id="ridesCard">
                <p class="sc-title">Payments</p>
                <div class="stat-details stat-details--3">
                    <p>Cash <span id="cashTrips">0</span></p>
                    <p>Voucher <span id="voucherTrips">0</span></p>
                    <p>Card <span id="cardTrips">0</span></p>
                </div>
            </div>

            <div class="stat-card monitoring-clickable" id="showUnattendedTrips">
                <p class="sc-title">Unfulfilled</p>
                <p class="sc-big" id="unattendedTrips">0</p>
            </div>

            <div class="stat-card" id="revenueCard">
                <p class="sc-title">Gross Revenue</p>
                <div class="stat-details stat-details--1">
                    <p>Total <span id="totalRevenue">$0.00</span></p>
                    <p>Net <span id="netRevenue">$0.00</span></p>
                </div>
            </div>

        </div>
    </div>

    <div class="stat-card-dropdown" id="cancelledDropdown"></div>
    <div class="stat-card-dropdown" id="unattendedDropdown"></div>
    <div class="stat-card-dropdown" id="tripsDropdown"></div>

</footer>

<div class="trip-details-modal" id="tripDetailsModal">
    <div class="trip-details-content">
        <div class="trip-details-header">
            <h3 id="tripDetailsTitle">Trip Details</h3>
            <i class="material-icons close-modal" id="closeTripDetails">close</i>
        </div>
        <div class="trip-details-body" id="tripDetailsBody">
            <!-- Content populated via JavaScript -->
        </div>
    </div>
</div>

<div class="driver-not-found-modal" id="driverNotFoundDetailsModal" tabindex="-1" aria-hidden="true">
    <div class="driver-not-found-modal__card">

        <button type="button" class="driver-not-found-modal-dismiss" id="btnCloseDriverNotFoundModal" aria-label="Close">
            <i class="material-icons" aria-hidden="true">close</i>
        </button>

        <div class="driver-not-found-modal__body">
            <h5 class="driver-not-found-modal__title">
                No nearby driver accepted the trip. Select action:
            </h5>

            <div id="container-whatsapp-group" class="driver-not-found-modal__group" style="display: none">
                <select id="select-group-list" class="driver-not-found-modal__select">
                    <option selected disabled>Choose a group</option>
                </select>

                <label class="driver-not-found-modal__check" for="sendToWhatsappGroup">
                    <input type="checkbox" id="sendToWhatsappGroup">
                    <span>Broadcast to WhatsApp Group</span>
                </label>
            </div>
        </div>

        <div class="driver-not-found-modal__footer">
            <button
                type="button"
                class="driver-not-found-modal__btn"
                id="send-message-to-group-trip-not-found">
                Retry Dispatch
            </button>
        </div>

    </div>
</div>
