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

function hashPassword(password, name, email, callback) {
	var salt = crypto.randomBytes(128).toString("base64");
	var iterations = 10000;
	crypto.pbkdf2(
		password,
		salt,
		iterations,
		32,
		"sha512",
		(err, derivedKey) => {
			if (err) throw err;

			axios
				.post("http://localhost:3000/user/create-user", {
					name: name,
					email: email,
					salt: salt,
					hash: derivedKey.toString("hex"),
				})
				.then((response) => {
					alert(response.data.msg);
					callback(response.data.success);
				})
				.catch(function (error) {
					alert(error);
				});
		}
	);
}

const SignUpForm = withRouter(({ history, ...props }) => {
	const { switchToSignin } = useContext(AccountContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		var name = event.target.name.value;
		var email = event.target.email.value;
		var pass = event.target.pass.value;
		var p1 = event.target.passConfirm.value;
		if (pass === p1) {
			hashPassword(pass, name, email, function (s) {
				s && switchToSignin();
			});
		} else {
			alert("Passwords didn't match!! Try Again.");
		}
	};

	return (
		<BoxContainer>
			<FormContainer onSubmit={handleSubmit} id='myform'>
				<Input type='text' placeholder='Full Name' name='name' />
				<Input type='email' placeholder='Email' name='email' />
				<Input type='password' placeholder='Password' name='pass' />
				<Input
					type='password'
					placeholder='Confirm Password'
					name='passConfirm'
				/>
			</FormContainer>
			<Marginer direction='vertical' margin={10} />
			<SubmitButton type='submit' form='myform'>
				Signup
			</SubmitButton>
			<Marginer direction='vertical' margin='1em' />
			<MutedLink href='#'>
				Already have an account?
				<BoldLink href='#' onClick={switchToSignin}>
					Signin
				</BoldLink>
			</MutedLink>
		</BoxContainer>
	);
});

export default SignUpForm;
