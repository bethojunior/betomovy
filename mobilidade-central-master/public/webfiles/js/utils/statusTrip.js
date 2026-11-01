const STATUS_AUTHORIZED = "1";
const STATUS_BLOCKED = "3";

const STATUS_SEARCHING = "searching";
const STATUS_PRE_ACCEPTED = "pre_accepted";
const STATUS_ACCEPTED = "accepted";
const STATUS_BOARDING = "boarding";
const STATUS_IN_PROGRESS = "in_progress";
const STATUS_FINISHED = "finished";
const STATUS_CANCELED = "canceled";
const STATUS_NOT_ANSWERED = "not_answered";
const STATUS_BACK_OFF = "back_off";
const STATUS_PAYMENT_REFUSED = "payment_refused";
const STATUS_SEARCHING_FAVORITE = "searching_favorite";
const TYPE_RETURN_ID = "1";
const PAYMENT_CARD_CREDIT = 3;
const PAYMENT_VOUCHER_CENTRAL = 11;
const STATUS_SCHEDULED = 'scheduled';

function isPaymentFormCard(paymentFormOrId) {
    if (!paymentFormOrId) {
        const stored = Session?.getLocal("paymentForm") || Session?.get("paymentForm");
        if (stored) return isPaymentFormCard(stored);
        return false;
    }

    if (typeof paymentFormOrId === "object") {
        const id = parseInt(paymentFormOrId.idTripPaymentForm || paymentFormOrId.id || 0, 10);
        const typeId = parseInt(paymentFormOrId.paymentFormTypeId || 0, 10);
        const name = (paymentFormOrId.name || "").toUpperCase();

        if (typeId === 3 || id === 3 || id === 18) return true;
        if (name.includes("STRIPE") || name.includes("CARTAO") || name.includes("CARTÃO") || name.includes("CARD")) return true;
        return false;
    }

    const numericId = parseInt(paymentFormOrId, 10);
    if (numericId === 3 || numericId === 18) return true;

    const stored = Session?.getLocal("paymentForm") || Session?.get("paymentForm");
    if (stored) {
        const sId = parseInt(stored.idTripPaymentForm || stored.id || 0, 10);
        const sTypeId = parseInt(stored.paymentFormTypeId || 0, 10);
        const sName = (stored.name || "").toUpperCase();
        if (sId === numericId) {
            if (sTypeId === 3 || sName.includes("STRIPE") || sName.includes("CARTAO") || sName.includes("CARTÃO") || sName.includes("CARD")) {
                return true;
            }
        }
    }

    return false;
}

function showStatusTrip(status) {
    switch (status) {
        case STATUS_SEARCHING:
        case STATUS_SEARCHING_FAVORITE: {
            return "Buscando motorista para a viagem";
        }
        case STATUS_PRE_ACCEPTED : {
            return "O motorista está finalizando uma viagem, antes de atender o cliente.";
        }
        case STATUS_ACCEPTED: {
            return "O motorista está caminho do destino de origem";
        }
        case STATUS_BOARDING: {
            return "O esperando no local de origem";
        }
        case STATUS_IN_PROGRESS : {
            return "No percurso do destino da viagem";
        }
        case STATUS_CANCELED: {
            return "Viagem cancelada";
        }
        case STATUS_NOT_ANSWERED: {
            return "Nenhum motorista atendeu a viagem"
        }
        case STATUS_BACK_OFF: {
            return "Motorista desistiu da viagem";
        }
        case STATUS_PAYMENT_REFUSED: {
            return "Pagamento da viagem recusado";
        }
        case STATUS_FINISHED:{
            return "Viagem finalizada"
        }
        case STATUS_SCHEDULED: {
            return "Viagem agendada";
        }
        default: {
            return "Status de viagem não reconhecido.";
        }
    }
}

function showStatusByTrip(trip) {
    if (trip?.status === STATUS_SCHEDULED && !!trip?.driver) {
        return "Agendamento aceito pelo motorista"
    } else {
        return showStatusTrip(trip?.status);
    }
}
