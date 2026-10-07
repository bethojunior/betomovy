import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import "./styles.css";

function CallModeModal({ onOptionDeliveryApp, onSelectDeliveryMan }, ref) {
    const modalRef = useRef();
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (active) {
            modalRef.current.classList.add("active");
        } else {
            modalRef.current.classList.remove("active");
        }
    }, [active]);

    useImperativeHandle(
        ref,
        () => ({
            showModal: () => {
                setActive(true);
            }
        }),
        []
    );

    return (
        <div ref={modalRef} className="modal-call-mode">
            <div>
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setActive(false)}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4>Despachar por:</h4>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            onSelectDeliveryMan();
                            setActive(false);
                        }}
                    >
                        Entregador próprio
                    </button>
                    <button
                        onClick={() => {
                            onOptionDeliveryApp();
                            setActive(false);
                        }}
                        type="button"
                        className="btn btn-primary"
                    >
                        Entregador app
                    </button>
                </div>
            </div>
        </div>
    );
}

export default forwardRef(CallModeModal);
