import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState
} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import api from "../../api";

function DeliveryManOrderModal({onDriverSelected}, ref) {
    const [active, setActive] = useState(false);
    const [list, setList] = useState([]);
    const [driverId, setDriverId] = useState(null);

    useImperativeHandle(
        ref,
        () => ({
            showModal: () => {
                getDataDeliveryMan();
                setActive(true);
            }
        }),
        []
    );

    async function getDataDeliveryMan() {
        setList([]);
        const {
            data: {response}
        } = await api.get(
            `company/${
                document.querySelector("#header-company-id").value
            }/deliveryManActive`
        );

        setList(response);
    }

    return (
        <Modal show={active} onHide={() => setActive(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Escolher entregador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Entregadores</Form.Label>
                    <Form.Control
                        defaultValue=""
                        as="select"
                        onChange={event => {
                            setDriverId(event.target.value);
                        }}
                        custom
                    >
                        <option value="" disabled>
                            Selecione algum entregador
                        </option>
                        {list.map(item => {
                            return (
                                <option value={item.driverId} key={item.id}>
                                    {item.driver.user.name}
                                </option>
                            );
                        })}
                    </Form.Control>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {
                        if (driverId) {
                            onDriverSelected(driverId);
                            setActive(false);
                        } else {
                            alert("Selecione um entregador");
                        }
                    }}
                >
                    Continuar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default forwardRef(DeliveryManOrderModal);
