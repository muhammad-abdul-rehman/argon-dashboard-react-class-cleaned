import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import {
	Card,
	CardHeader,
	CardBody,
	Media,
	Container,
	Row,
	Col,
	Form,
	FormGroup,
} from 'reactstrap';

//MUI
import { DataGrid } from '@material-ui/data-grid';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import {
	LinearProgress,
	Avatar,
	Grid,
	TextField,
	Chip,
	Button,
	ButtonGroup,
} from '@material-ui/core';

import MatEdit from 'views/MatEdit';

class UpdateCustomer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props.customer?.address_two);
		return (
			<Form
				name='update_customer'
				id='update_customer'
				onSubmit={this.props.updateCustomer}
			>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='First Name'
							name='first_name'
							variant='outlined'
							required
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.first_name || ''}
							InputLabelProps={{
								shrink: this.props.customer?.first_name !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Last Name'
							name='last_name'
							variant='outlined'
							required
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.last_name || ''}
							InputLabelProps={{
								shrink: this.props.customer?.last_name !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col sm={8}>
						<TextField
							className='w-100'
							id='outlined-basic'
							label='Address'
							name='address_one'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.address_one || ''}
							InputLabelProps={{
								shrink: this.props.customer?.address_one !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col sm={8}>
						<TextField
							className='w-100'
							id='outlined-basic'
							label='Address Secondary'
							name='address_two'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.address_two || ''}
							InputLabelProps={{
								shrink: this.props.customer?.address_two !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='County'
							name='county'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.county || ''}
							InputLabelProps={{
								shrink: this.props.customer?.county !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Country'
							name='country'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.country || ''}
							InputLabelProps={{
								shrink: this.props.customer?.country !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Workplace'
							name='workplace'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.workplace || ''}
							InputLabelProps={{
								shrink: this.props.customer?.workplace !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Job Title'
							name='reference_club'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.reference_club || ''}
							InputLabelProps={{
								shrink:
									this.props.customer?.reference_club !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Town'
							name='town'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.town || ''}
							InputLabelProps={{
								shrink: this.props.customer?.town !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Eircode'
							name='eircode'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.eircode || ''}
							InputLabelProps={{
								shrink: this.props.customer?.eircode !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Phone'
							name='phone'
							variant='outlined'
							onChange={e => this.props.handleChange(e)}
							value={this.props.form?.phone || ''}
							InputLabelProps={{
								shrink: this.props.customer?.phone !== '',
							}}
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='Customer ID'
							name='customer_id'
							variant='outlined'
							helperText={'You cannot change this.'}
							required
							value={this.props.customer?.id || ''}
							InputLabelProps={{
								shrink: this.props.customer?.id !== '',
							}}
							disabled
						/>
					</Col>
					<Col>
						<TextField
							id='outlined-basic'
							label='User ID'
							name='user_id'
							variant='outlined'
							helperText={'You cannot change this.'}
							required
							value={this.props.customer?.user_id || ''}
							InputLabelProps={{
								shrink: this.props.customer?.user_id !== '',
							}}
							disabled
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col>
						<TextField
							id='outlined-basic'
							label='ATPI Membership number'
							name='user_login'
							variant='outlined'
							helperText={'You cannot change this.'}
							required
							value={this.props.customer?.user_login || ''}
							InputLabelProps={{
								shrink:
									this.props.customer?.user_login !==
									undefined,
							}}
							disabled
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col xs={12}></Col>
				</FormGroup>
				<FormGroup>
					<Col>
						<Button variant='contained' type='submit'>
							Update User
						</Button>
					</Col>
				</FormGroup>
			</Form>
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

export default connect(mappropsToProps, mapDispatchToProps)(UpdateCustomer);
