import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import { Col, Form, FormGroup } from 'reactstrap';

//MUI

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';

class WebsiteAccessRole extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	updateUserRole = async e => {
		e.preventDefault();
		const form = new FormData(e.target);
		const url =
			this.props.rcp_url.domain +
			this.props.rcp_url.base_wp_url +
			'users/' +
			this.props.user_id;

		const res = await fetch(url, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + this.props.user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ roles: form.getAll('roles[]') }),
		});
		if (!res.ok) return;
		const data = await res.json();
		this.props.updateStateUserRole(data.roles);
	};

	render() {
		return (
			<>
				<h2>Website Access Role</h2>

				<Form
					name='update_access_role'
					id='update_user_role'
					onSubmit={this.updateUserRole}
				>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									name='roles[]'
									defaultChecked={this.props.user_roles.includes(
										'club_owner'
									)}
									value='club_owner'
								/>
							}
							label='Club Owner'
						/>
						<FormControlLabel
							control={
								<Checkbox
									name='roles[]'
									defaultChecked={this.props.user_roles.includes(
										'club_member'
									)}
									value='club_member'
								/>
							}
							label='Club Member'
						/>
						<FormControlLabel
							control={
								<Checkbox
									name='roles[]'
									defaultChecked={this.props.user_roles.includes(
										'individual_member'
									)}
									value='individual_member'
								/>
							}
							label='Individual Member'
						/>
						<FormControlLabel
							control={
								<Checkbox
									name='roles[]'
									defaultChecked={this.props.user_roles.includes(
										'site_manager'
									)}
									value='site_manager'
								/>
							}
							label='ATPI site Manager'
						/>
						<FormControlLabel
							control={
								<Checkbox
									name='roles[]'
									defaultChecked={this.props.user_roles.includes(
										'administrator'
									)}
									value='administrator'
								/>
							}
							label='Administrator'
						/>
					</FormGroup>
					<FormGroup>
						<Col>
							<Button variant='contained' type='submit'>
								Update User Role
							</Button>
						</Col>
					</FormGroup>
				</Form>
			</>
		);
	}
}

const mappropsToProps = props => {
	return {
		rcp_url: props.rcp_url,
		user: props.user,
	};
};

const mapDispatchToProps = { setUserLoginDetails };

export default connect(mappropsToProps, mapDispatchToProps)(WebsiteAccessRole);
