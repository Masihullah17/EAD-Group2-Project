import React, { useContext } from "react";
import {
	BoldLink,
	BoxContainer,
	FormContainer,
	Input,
	MutedLink,
	SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import alert from "alert";
import axios from "axios";
import { withRouter } from "react-router-dom";

const crypto = require("crypto");

function checkLogin(email, password, callback) {
	axios
		.post("http://localhost:3000/user/get-salt/", {
			email: email,
		})
		.then((response) => {
			if (response.data.exists) {
				crypto.pbkdf2(
					password,
					response.data.salt,
					10000,
					32,
					"sha512",
					(err, derivedKey) => {
						if (err) throw err;

						axios
							.post(
								"http://localhost:3000/user/check-password/",
								{
									email: email,
									password: derivedKey.toString("hex"),
								}
							)
							.then((response) => {
								if (response.data.authorized) {
									localStorage.setItem(
										"email",
										response.data.email
									);
									// Redirect
									callback();
								} else {
									alert(response.data.msg);
								}
							})
							.catch((error) => {
								alert(error);
							});
					}
				);
			} else {
				alert(response.data.msg);
			}
		})
		.catch(function (error) {
			alert(error);
		});
}

const LoginForm = withRouter(({ history, ...props }) => {
	const { switchToSignup } = useContext(AccountContext);

	const handleSubmit = (event) => {
		event.preventDefault();
		checkLogin(event.target.email.value, event.target.pass.value, () => {
			history.push("/");
		});
	};

	return (
		<BoxContainer>
			<FormContainer onSubmit={handleSubmit} id='myform'>
				<Input type='email' placeholder='Email' name='email' />
				<Input type='password' placeholder='Password' name='pass' />
			</FormContainer>
			<Marginer direction='vertical' margin={10} />
			<MutedLink href='#'>Forget your password?</MutedLink>
			<Marginer direction='vertical' margin='1.6em' />
			<SubmitButton type='submit' form='myform'>
				Signin
			</SubmitButton>
			<Marginer direction='vertical' margin='1em' />
			<MutedLink href='#'>
				Don't have an accoun?{" "}
				<BoldLink href='#' onClick={switchToSignup}>
					Signup
				</BoldLink>
			</MutedLink>
		</BoxContainer>
	);
});

export default LoginForm;
