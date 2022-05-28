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
	Table,
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
	Switch,
	FormControlLabel,
} from '@material-ui/core';

import MatEdit from 'views/MatEdit';

class MembershipDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {},
		};
	}

	handleChange = event => {
		const { target } = event;
		const value =
			target.type === 'checkbox' ? target.checked : target.value;
		const { name } = target;

		this.setState(prevState => ({
			...prevState,
			form: {
				...prevState.form,
				[name]: value,
			},
		}));
	};

	render() {
		if (this.props.membership === null) return null;

		return (
			<>
				<Table bordered striped className='mb-2'>
					<thead>
						<tr>
							<th className='border-right-0'>
								<h2>Memberhsip Details</h2>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className='font-weight-bold'>
								Memberhsip Type
							</td>
							<td>{this.props.membership?.type}</td>
						</tr>
						<tr>
							<td className='font-weight-bold'>
								Memberhsip Status
							</td>
							<td>{this.props.membership?.status}</td>
						</tr>
						<tr>
							<td className='font-weight-bold'>
								Expiration Date
							</td>
							<td>{this.props.membership?.expired_date}</td>
						</tr>
						<tr>
							<td className='font-weight-bold'>Auto Renew</td>
							<td>
								<Switch
									checked={this.props.membership?.auto_renew}
									name='auto_renew'
									onChange={this.handleChange}
									disabled
								/>
							</td>
						</tr>
					</tbody>
				</Table>
				<Col>
					<Button
						variant='contained'
						className='mb-4'
						href={
							'/admin/membership/edit/' + this.props.membership.id
						}
					>
						Edit Membership
					</Button>
				</Col>
			</>
			// 	{/* <Form
			// 	name='update_customer_membership'
			// 	id='update_customer_membership'
			// 	onSubmit={this.updateCustomerMembership}
			// ><FormGroup row>
			// 		<Col>
			// 			<TextField
			// 				id='outlined-basic'
			// 				label='Membership Type'
			// 				name='object_type'
			// 				variant='outlined'
			// 				required
			// 				value={this.props.membership?.type || ''}
			// 				onChange={this.handleChange}
			// 				InputLabelProps={{
			// 					shrink:
			// 						this.props.membership?.type !== undefined,
			// 				}}
			// 				disabled
			// 			/>
			// 		</Col>
			// 	</FormGroup>
			// 	<FormGroup row>
			// 		<Col>
			// 			<TextField
			// 				id='outlined-basic'
			// 				label='Membership Status'
			// 				name='status'
			// 				variant='outlined'
			// 				required
			// 				onChange={this.handleChange}
			// 				value={this.props.membership?.status || ''}
			// 				InputLabelProps={{
			// 					shrink: this.props.membership?.status !== '',
			// 				}}
			// 				disabled
			// 			/>
			// 		</Col>
			// 	</FormGroup>
			// 	<FormGroup row>
			// 		<Col>
			// 			<TextField
			// 				id='outlined-basic'
			// 				label='Expired Date'
			// 				name='expired_date'
			// 				variant='outlined'
			// 				required
			// 				onChange={this.handleChange}
			// 				value={this.props.membership?.expired_date || ''}
			// 				InputLabelProps={{
			// 					shrink:
			// 						this.props.membership?.expired_date !==
			// 						undefined,
			// 				}}
			// 				disabled
			// 			/>
			// 		</Col>
			// 	</FormGroup>
			// 	<FormGroup row>
			// 		<Col>
			// 			<FormControlLabel
			// 				control={
			// 					<Switch
			// 						checked={this.props.membership?.auto_renew}
			// 						name='auto_renew'
			// 						onChange={this.handleChange}
			// 						disabled
			// 					/>
			// 				}
			// 				label='Auto Renew'
			// 			/>
			// 		</Col>
			// 	</FormGroup>
			// 	<FormGroup row>
			// 		<Col xs={12}></Col>
			// 	</FormGroup>
			// 	<FormGroup>
			// 		<Col>
			// 			<Button variant='contained' type=''>
			// 				Edit Membership
			// 			</Button>
			// 		</Col>
			// 	</FormGroup>
			// </Form> */}
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

export default connect(mappropsToProps, mapDispatchToProps)(MembershipDetails);
