import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import * as employeeService from "../../services/employeeService";
import axios from "axios";
import alert from "alert";
const fetch = require("node-fetch");
const { v1: uuidv1 } = require("uuid");

const initialFValues = {
	id: 0,
	Name: "",
	url: "",
	content: "",
	frequency: "",
	notifyId: "",
};

export default function EmployeeForm(props) {
	const { addOrEdit, recordForEdit } = props;

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
		if ("Name" in fieldValues)
			temp.Name = fieldValues.Name ? "" : "This field is required.";
		if ("url" in fieldValues)
			temp.url = fieldValues.url ? "" : "url is not valid.";
		if ("content" in fieldValues)
			temp.content = fieldValues.content ? "" : "This field is required.";
		if ("frequency" in fieldValues)
			temp.frequency = fieldValues.frequency
				? ""
				: "This field is required.";
		if ("notifyId" in fieldValues)
			temp.notifyId =
				fieldValues.notifyId.length !== 0
					? ""
					: "This field is required.";
		setErrors({
			...temp,
		});

		if (fieldValues === values)
			return Object.values(temp).every((x) => x === "");
	};

	const {
		values,
		setValues,
		errors,
		setErrors,
		handleInputChange,
		resetForm,
	} = useForm(initialFValues, true, validate);

	const handleSubmit = async (e) => {
		e.preventDefault();

		var ipadd = await fetch("https://api.ipify.org?format=json")
			.then((response) => {
				return response.json();
			})
			.then((json) => {
				const ip = json.ip;
				return ip;
			})
			.catch((err) => {
				console.error(`Error getting IP Address: ${err}`);
			});

		if (validate()) {
			addOrEdit(values, resetForm);
			console.log(values);

			var content = "";
			var element = "";
			var elementAttr = "";
			var elementContent = "";
			var elementChange = false;
			var imageChange = "";
			if (values.notifyId === "1") {
				content = values.content;
			} else if (values.notifyId === "2") {
				element = values.content;
				elementAttr = values.elementAttr;
				elementContent = values.elementContent;
				elementChange = values.elementChange;
			} else {
				imageChange = values.content;
			}

			axios
				.post("http://localhost:3000/site/count-submissions/", {
					ip: ipadd,
				})
				.then((response) => {
					if (response.data.allowed) {
						axios({
							method: "post",
							url: "http://localhost:3000/site",
							data: {
								uid: uuidv1(),
								username: localStorage.getItem("email"),
								name: values.Name,
								url: values.url,
								interval: values.frequency,
								notifyId: values.notifyId,
								timeout: 5,
								content: content,
								element: element,
								elementChange: elementChange,
								elementAttr: elementAttr,
								elementContent: elementContent,
								imageChange: imageChange,
								ip: response.data.ip,
							},
						});
					} else {
						alert(response.data.message);
					}
				});
		}
	};

	useEffect(() => {
		if (recordForEdit != null)
			setValues({
				...recordForEdit,
			});
	}, [recordForEdit, setValues]);

	return (
		<Form onSubmit={handleSubmit}>
			<Grid container>
				<Grid item xs={6}>
					<Controls.Input
						name='Name'
						label='Website Name'
						value={values.Name}
						onChange={handleInputChange}
						error={errors.Name}
					/>
					<Controls.Input
						label='url'
						name='url'
						value={values.url}
						onChange={handleInputChange}
						error={errors.url}
					/>
					<Controls.Input
						label='Selected Content for monitoring'
						name='content'
						value={values.content}
						onChange={handleInputChange}
						error={errors.content}
					/>
					<Controls.Input
						label='Frequency'
						name='frequency'
						value={values.frequency}
						onChange={handleInputChange}
						error={errors.frequency}
					/>
				</Grid>
				<Grid item xs={6}>
					<Controls.Select
						name='notifyId'
						label='What changes to look for?'
						value={values.notifyId}
						onChange={handleInputChange}
						options={employeeService.getNotifiedCollection()}
						error={errors.notifyId}
					/>
					<Controls.Input
						label='Element attribute'
						name='elementAttr'
						value={values.elementAttr}
						onChange={handleInputChange}
						error={errors.elementAttr}
					/>

					<Controls.Input
						label='Element content'
						name='elementContent'
						value={values.elementContent}
						onChange={handleInputChange}
						error={errors.elementContent}
					/>

					<Controls.Checkbox
						label='Element change'
						name='elementChange'
						value={values.elementChange}
						onChange={handleInputChange}
						error={errors.elementChange}
					/>

					<div>
						<Controls.Button type='submit' text='Submit' />
						<Controls.Button
							text='Reset'
							color='default'
							onClick={resetForm}
						/>
					</div>
				</Grid>
			</Grid>
		</Form>
	);
}
