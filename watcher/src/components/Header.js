import React from "react";
import {
	AppBar,
	Toolbar,
	Grid,
	IconButton,
	makeStyles,
	Typography,
} from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import FaceIcon from "@material-ui/icons/Face";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: "#fff",
	},
	searchInput: {
		opacity: "0.6",
		padding: `0px ${theme.spacing(1)}px`,
		fontSize: "0.8rem",
		"&:hover": {
			backgroundColor: "#f2f2f2",
		},
		"& .MuiSvgIcon-root": {
			marginRight: theme.spacing(1),
		},
	},
}));

const WhiteTextTypography = withStyles({
	root: {
		color: "#000000",
		fontFamily: "Roboto",
		fontWeight: "bold",
	},
})(Typography);

const Header = withRouter(({ history, ...props }) => {
	const classes = useStyles();

	const logout = () => {
		localStorage.removeItem("email");
		history.push("/login");
	};

	return (
		<AppBar position='static' title='Watcher' className={classes.root}>
			<Toolbar>
				<Grid container alignItems='center'>
					<Grid item>
						<WhiteTextTypography variant='h4' component='div'>
							WATCHER
							<FaceIcon fontSize='large' />
						</WhiteTextTypography>
					</Grid>
					<Grid item sm></Grid>
					<Grid item>
						<IconButton>
							<PowerSettingsNewIcon
								fontSize='small'
								onClick={logout}
								title='Logout'
							/>
						</IconButton>
					</Grid>
				</Grid>
			</Toolbar>
		</AppBar>
	);
});

export default Header;
