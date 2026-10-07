import React, {useEffect, useState} from "react";
import api from "../../api";

export default function NavbarStatusCompany() {
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrderConfig();
    }, [])

    async function getOrderConfig() {
        const {
            data: {response}
        } = await api.get(
            `company/${
                document.querySelector("#header-company-id").value
            }/deliveryOrderConfig`
        );

        setActive(response.isOpen == true);

        setLoading(false);
    }

    async function changeOpeningStatus(isOpen) {
        const {
            data: {response}
        } = await api.put(
            `company/${
                document.querySelector("#header-company-id").value
            }/changeOpeningStatus`,{
                isOpen
            }
        );
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
            <div className="container-fluid d-flex justify-content-end align-items-center">
                {loading ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) :
                    (<div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id="customSwitch1" checked={active}
                               disabled={loading}
                               onChange={(event) => {
                                   const checked = event.target.checked;
                                   changeOpeningStatus(checked)
                                   setActive(checked);
                               }}/>
                        <label className="custom-control-label" htmlFor="customSwitch1">
                            {active ? 'Estabelecimento aberto' : 'Estabelecimento fechado'}
                        </label>
                    </div>)}
            </div>
        </nav>
    );
}
