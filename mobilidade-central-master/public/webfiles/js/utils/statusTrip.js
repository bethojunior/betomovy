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
