import React, { useState } from "react";
import EmployeeForm from "./EmployeeForm";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
	Paper,
	makeStyles,
	TableBody,
	TableRow,
	TableCell,
	Toolbar,
	InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import * as employeeService from "../../services/employeeService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

const useStyles = makeStyles((theme) => ({
	pageContent: {
		margin: theme.spacing(5),
		padding: theme.spacing(3),
	},
	searchInput: {
		width: "75%",
	},
	newButton: {
		position: "absolute",
		right: "10px",
	},
}));

const headCells = [
	{ id: "name", label: "Website Name" },
	{ id: "url", label: "url Address" },
	{ id: "content", label: "Selected Content for monitoring" },
	{ id: "notify", label: "Notify for change in" },
	{ id: "actions", label: "Actions", disableSorting: true },
];

export default function Employees() {
	const classes = useStyles();
	const [recordForEdit, setRecordForEdit] = useState(null);
	const [records, setRecords] = useState(employeeService.getAllNotifies());
	const [filterFn, setFilterFn] = useState({
		fn: (items) => {
			return items;
		},
	});
	const [openPopup, setOpenPopup] = useState(false);

	const {
		TblContainer,
		TblHead,
		TblPagination,
		recordsAfterPagingAndSorting,
	} = useTable(records, headCells, filterFn);

	const handleSearch = (e) => {
		let target = e.target;
		setFilterFn({
			fn: (items) => {
				if (target.value === "") return items;
				else
					return items.filter((x) =>
						x.name.toLowerCase().includes(target.value)
					);
			},
		});
	};

	const addOrEdit = (employee, resetForm) => {
		if (employee.id === 0) employeeService.insertEmployee(employee);
		else employeeService.updateEmployee(employee);
		resetForm();
		setRecordForEdit(null);
		setOpenPopup(false);
		setRecords(employeeService.getAllNotifies());
	};

	const openInPopup = (item) => {
		setRecordForEdit(item);
		setOpenPopup(true);
	};

	return (
		<>
			<PageHeader
				title='Your Website Watch Requests'
				subTitle='Monitor Any Website'
				icon={<PeopleOutlineTwoToneIcon fontSize='large' />}
			/>
			<Paper className={classes.pageContent}>
				<Toolbar>
					<Controls.Input
						label='Search Website Name'
						className={classes.searchInput}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<Search />
								</InputAdornment>
							),
						}}
						onChange={handleSearch}
					/>
					<Controls.Button
						text='Add New'
						variant='outlined'
						startIcon={<AddIcon />}
						className={classes.newButton}
						onClick={() => {
							setOpenPopup(true);
							setRecordForEdit(null);
						}}
					/>
				</Toolbar>
				<TblContainer>
					<TblHead />
					<TableBody>
						{recordsAfterPagingAndSorting().map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.Name}</TableCell>
								<TableCell>{item.url}</TableCell>
								<TableCell>{item.content}</TableCell>
								<TableCell>{item.department}</TableCell>
								<TableCell>
									<Controls.ActionButton
										color='primary'
										onClick={() => {
											openInPopup(item);
										}}
									>
										<EditOutlinedIcon fontSize='small' />
									</Controls.ActionButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</TblContainer>
				<TblPagination />
			</Paper>
			<Popup
				title='Employee Form'
				openPopup={openPopup}
				setOpenPopup={setOpenPopup}
			>
				<EmployeeForm
					recordForEdit={recordForEdit}
					addOrEdit={addOrEdit}
				/>
			</Popup>
		</>
	);
}
