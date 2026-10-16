import {createUseStore} from '../hooks/useStore';

const [useIniTripModal, setIniTripModal] = createUseStore<boolean>(false);

export {useIniTripModal, setIniTripModal};
