import React from "react";
import "./settings.css";
import { useState } from "react";

const Settings = () => {
	const [Newpswd, setNewpswd] = useState("");
	const [Oldpswd, setOldpswd] = useState("");
	const [Newpswdagn, setNewpswdagn] = useState("");
	const [Newemail, setNewemail] = useState("");
	return (
		<div>
			<h1>Settings</h1>
			<div class='MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2 MuiGrid-align-items-xs-center MuiGrid-justify-content-xs-center'>
				<div class='MuiTypography-root MuiTypography-body1 MuiTypography-paragraph'>
					<div class='MuiPaper-root MuiCard-root MuiPaper-elevation1 MuiPaper-rounded'>
						<div class='MuiCardHeader-root'>
							<div class='MuiCardHeader-avatar'>
								<div class='MuiAvatar-root MuiAvatar-circle MuiAvatar-colorDefault'>
									<svg
										class='MuiSvgIcon-root'
										focusable='false'
										viewBox='0 0 24 24'
										aria-hidden='true'
									>
										<path d='M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z'></path>
									</svg>
								</div>
							</div>
							<div class='MuiCardHeader-content'>
								<span class='MuiTypography-root MuiCardHeader-title MuiTypography-body2 MuiTypography-displayBlock'>
									<b>Change Password</b>
								</span>
							</div>
						</div>
						<form>
							<div class='MuiCardContent-root'>
								<div class='MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth'>
									<label
										class='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated'
										data-shrink='false'
									>
										Old password
									</label>
									<div class='MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl'>
										<input
											aria-invalid='false'
											autocomplete='off'
											type='password'
											class='MuiInputBase-input MuiInput-input'
											value={Oldpswd}
											onChange={(e) =>
												setOldpswd(e.target.value)
											}
										/>
									</div>
								</div>
								<div class='MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth'>
									<label
										class='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated'
										data-shrink='false'
									>
										New password
									</label>
									<div class='MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl'>
										<input
											aria-invalid='false'
											autocomplete='off'
											type='password'
											class='MuiInputBase-input MuiInput-input'
											value={Newpswd}
											onChange={(e) =>
												setNewpswd(e.target.value)
											}
										/>
									</div>
								</div>
								<div class='MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth'>
									<label
										class='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated'
										data-shrink='false'
									>
										New password again
									</label>
									<div class='MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl'>
										<input
											aria-invalid='false'
											autocomplete='off'
											type='password'
											class='MuiInputBase-input MuiInput-input'
											value={Newpswdagn}
											onChange={(e) =>
												setNewpswdagn(e.target.value)
											}
										/>
									</div>
								</div>
							</div>
							<div class='MuiCardActions-root MuiCardActions-spacing'>
								<div class='MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-content-xs-flex-end'>
									<div class='MuiGrid-root MuiGrid-item'>
										<button
											class='MuiButtonBase-root MuiButton-root MuiButton-contained'
											tabindex='-1'
											type='submit'
											disabled=''
										>
											<span class='MuiButton-label'>
												Make it so
											</span>
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
					<br />
					<div class='MuiPaper-root MuiCard-root MuiPaper-elevation1 MuiPaper-rounded'>
						<div class='MuiCardHeader-root'>
							<div class='MuiCardHeader-avatar'>
								<div class='MuiAvatar-root MuiAvatar-circle MuiAvatar-colorDefault'>
									<svg
										class='MuiSvgIcon-root'
										focusable='false'
										viewBox='0 0 24 24'
										aria-hidden='true'
									>
										<path d='M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z'></path>
									</svg>
								</div>
							</div>
							<div class='MuiCardHeader-content'>
								<span class='MuiTypography-root MuiCardHeader-title MuiTypography-body2 MuiTypography-displayBlock'>
									<b>Change Email</b>
								</span>
							</div>
						</div>
						<form>
							<div class='MuiCardContent-root'>
								<div class='MuiTypography-root MuiTypography-body2 MuiTypography-paragraph'>
									<b>Be careful!</b> This will take you
									through a verification process for the new
									email. You must confirm the new address: if
									you do not, you lose access to your account.
								</div>
								<div class='MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth'>
									<label
										class='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated'
										data-shrink='false'
									>
										New email
									</label>
									<div class='MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl'>
										<input
											aria-invalid='false'
											autocomplete='off'
											type='email'
											class='MuiInputBase-input MuiInput-input'
											value={Newemail}
											onChange={(e) =>
												setNewemail(e.target.value)
											}
										></input>
									</div>
								</div>
							</div>
							<div class='MuiCardActions-root MuiCardActions-spacing'>
								<div class='MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-content-xs-flex-end'>
									<div class='MuiGrid-root MuiGrid-item'>
										<span></span>
										<button
											class='MuiButtonBase-root MuiButton-root MuiButton-contained'
											tabindex='-1'
											type='submit'
											disabled=''
										>
											<span class='MuiButton-label'>
												Make it so
											</span>
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
