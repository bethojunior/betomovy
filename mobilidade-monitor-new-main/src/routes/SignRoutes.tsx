import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from '../pages/Login';

const SignRoutes: React.FC = () => {
	return (
		<Router>
			<Route path="/">
				<Login />
			</Route>
		</Router>
	);
};

export default SignRoutes;
