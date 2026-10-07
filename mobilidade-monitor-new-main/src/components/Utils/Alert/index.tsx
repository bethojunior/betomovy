import { FC, useEffect } from 'react';
import { AlertComponent } from './styles';

interface AlertProps {
	visibility: boolean;
	setVisibility: (arg: boolean) => void;
	message: string;
	typeAlert: 'success' | 'info' | 'warning' | 'error';
}

const Alert: FC<AlertProps> = ({
	visibility,
	setVisibility,
	message,
	typeAlert,
}) => {
	useEffect(() => {
		if (visibility) setTimeout(() => setVisibility(false), 5000);
	}, [visibility, setVisibility]);

	return (
		<AlertComponent visible={visibility} message={message} type={typeAlert} />
	);
};

export default Alert;
