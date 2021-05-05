import React from "react";
import "./App.css";
import Settings from "../pages/Employees/settings";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import styled from "styled-components";
import { AccountBox } from "../components/accountBox";
import Dashboard from "../components/Dashboard";

const AppContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	margin: 60px;
	align-items: center;
	justify-content: center;
`;

function App() {
	return (
		<Router>
			<Switch>
				<Route path='/settings' exact component={Settings} />
				<Route path='/login' exact>
					<AppContainer>
						<AccountBox />
					</AppContainer>
				</Route>
				<Route
					exact
					path='/'
					render={() => {
						if (localStorage.getItem("email")) {
							return <Dashboard />;
						} else {
							return <Redirect to='/login' />;
						}
					}}
				/>
			</Switch>
		</Router>
	);
}

export default App;
