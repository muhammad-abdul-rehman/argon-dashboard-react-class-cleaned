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
import {
	withStyles,
	TextField,
	Button,
	FormControl,
	FormControlLabel,
	Select,
	MenuItem,
	InputLabel,
	Input,
	Switch,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';

class EditPayment extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			payment: null,
			form: {
				subscription: '',
				object_id: '',
				date: '',
				amount: '',
				transaction_id: '',
				gateway: '',
				gateway_manual: '',
				subscription_key: '',
				payment_id: '',
				discount_code: '',
				status: '',
				subscription_id: '',
				subscription_key: '',
				transaction_id: '',
			},
		};

		this.current_payment_url =
			this.props.rcp_url.domain +
			this.props.rcp_url.base_url +
			'payments/' +
			this.props.match.params.id;

		this.update_payment_url =
			this.props.rcp_url.domain +
			this.props.rcp_url.base_url +
			'payments/update/' +
			this.props.match.params.id;
	}

	componentDidMount() {
		if (this.state.user === null && this.props.user.token !== null)
			this.fetchPayment(this.current_payment_url);
	}

	componentDidUpdate({ user: prevUser }) {
		if (prevUser !== this.props.user && this.props.user.token !== null) {
			this.fetchPayment(this.current_payment_url);
		}
	}

	fetchPayment = async url => {
		const queryUrl = new URL(url);
		const params = {
			acf_format: 'standard',
		};
		for (let key in params) {
			queryUrl.searchParams.set(key, params[key]);
		}
		const res = await fetch(queryUrl, {
			headers: {
				Authorization: 'Bearer ' + this.props.user.token,
			},
		});
		if (!res.ok) return;
		const data = await res.json();

		this.setState(prevState => ({
			payment: data,
			form: {
				...prevState.form,
				payment_id: data?.id,
				subscription: data?.subscription,
				object_id: data?.object_id,
				date: data?.date.split(' ')[0],
				amount: data?.amount,
				status: data?.status,
				transaction_id: data?.transaction_id,
				gateway: data?.gateway,
				gateway_manual: data?.gateway_manual,
				subscription_key: data?.subscription_key,
				subscription_id: data?.subscription_id,
				transaction_id: data?.transaction_id,
				payment_id: data?.payment_id,
				discount_code: data?.discount_code,
			},
		}));
	};

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

	updatePayment = e => {
		e.preventDefault();
		const formData = new FormData(e.target);

		fetch(this.update_payment_url, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + this.props.user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(Object.fromEntries(formData)),
		})
			.then(res => {
				console.log(res);
				if (!res.ok) {
					return;
				} else {
					return res.json();
				}
			})
			.then(data => {
				this.setState(prevState => ({
					payment: data,
					form: {
						...prevState.form,
						payment_id: data?.id,
						subscription: data?.subscription,
						object_id: data?.object_id,
						date: data?.date.split(' ')[0],
						amount: data?.amount,
						status: data?.status,
						transaction_id: data?.transaction_id,
						gateway: data?.gateway,
						gateway_manual: data?.gateway_manual,
						subscription_key: data?.subscription_key,
						subscription_id: data?.subscription_id,
						transaction_id: data?.transaction_id,
						payment_id: data?.payment_id,
						discount_code: data?.discount_code,
					},
				}));
			})
			.catch(err => console.error(err));
	};

	render() {
		if (!this.state.payment && this.props.user.token)
			this.fetchPayment(this.current_payment_url);
		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>Payment</h3>
								</CardHeader>
								<CardBody>
									<Form
										name='update_payment'
										id='update_payment'
										onSubmit={this.updatePayment}
									>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Payment ID'
													name='payment_id'
													variant='outlined'
													helperText={
														'You cannot change this.'
													}
													required
													value={
														this.state.payment
															?.customer_id || ''
													}
													InputLabelProps={{
														shrink:
															this.state.payment
																?.customer_id !==
															'',
													}}
													disabled
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Amount'
													name='amount'
													variant='outlined'
													required
													type='number'
													value={
														this.state.form
															?.amount || ''
													}
													InputLabelProps={{
														shrink:
															this.state.payment
																?.amount !== '',
													}}
													onChange={this.handleChange}
													pattern='^[+\-]?[0-9]{1,3}(?:,?[0-9]{3})*(\.[0-9]{2})?$'
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Subscription'
													name='subscription'
													variant='outlined'
													helperText={
														'You cannot change this.'
													}
													required
													value={
														this.state.form
															?.subscription || ''
													}
													InputLabelProps={{
														shrink:
															this.state.payment
																?.subscription !==
															undefined,
													}}
													disabled
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Discount Code'
													name='discount_code'
													variant='outlined'
													onChange={e =>
														this.handleChange(e)
													}
													value={
														this.state.form
															?.discount_code ===
														''
															? 'No discount code used'
															: this.state.form
																	?.discount_code
													}
													InputLabelProps={{
														shrink:
															this.state.payment
																?.discount_code !==
															undefined,
													}}
													disabled
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Input
													type='date'
													name='date'
													className={
														this.props.classes
															.date +
														' MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl'
													}
													value={
														this.state.form?.date ||
														''
													}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<FormControl
													style={{
														minWidth: '120px',
													}}
												>
													<InputLabel id='gateway_label'>
														Gateway
													</InputLabel>
													<Select
														labelId='gateway_label'
														id='gateway'
														name='gateway'
														onChange={
															this.handleChange
														}
														value={
															this.state.form
																?.gateway || ''
														}
													>
														<MenuItem
															value={'stripe'}
														>
															Stripe
														</MenuItem>
														<MenuItem
															value={'manual'}
														>
															Manual
														</MenuItem>
													</Select>
												</FormControl>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<FormControl
													style={{
														minWidth: '120px',
													}}
												>
													<InputLabel id='gateway_manual_label'>
														Payment Type
													</InputLabel>
													<Select
														labelId='gateway_manual_label'
														id='gateway_manual'
														name='gateway_manual'
														onChange={
															this.handleChange
														}
														value={
															this.state.form
																?.gateway_manual ||
															''
														}
													>
														<MenuItem
															value={
																'Stripe Phone Payment'
															}
														>
															Stripe Phone Payment
														</MenuItem>
														<MenuItem
															value={
																'Stripe Payment link'
															}
														>
															Stripe Payment link
														</MenuItem>
														<MenuItem
															value={'Paypal'}
														>
															Paypal
														</MenuItem>
														<MenuItem
															value={
																'Bank Transfer'
															}
														>
															Bank Transfer
														</MenuItem>
														<MenuItem
															value={'Cheque'}
														>
															Cheque
														</MenuItem>
														<MenuItem
															value={'Cash'}
														>
															Cash
														</MenuItem>
														<MenuItem
															value={'Honorary'}
														>
															Honorary
														</MenuItem>
													</Select>
												</FormControl>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Transaction ID'
													name='transaction_id'
													variant='outlined'
													onChange={e =>
														this.handleChange(e)
													}
													value={
														this.state.form
															?.transaction_id ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state.payment
																?.transaction_id !==
															undefined,
													}}
													disabled
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Subscription ID'
													name='subscription_id'
													variant='outlined'
													onChange={e =>
														this.handleChange(e)
													}
													value={
														this.state.form
															?.subscription_id ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state.payment
																?.subscription_id !==
															undefined,
													}}
													disabled
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Subscription Key'
													name='subscription_key'
													variant='outlined'
													onChange={e =>
														this.handleChange(e)
													}
													value={
														this.state.form
															?.subscription_key ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state.payment
																?.subscription_key !==
															undefined,
													}}
													disabled
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<FormControl
													style={{
														minWidth: '120px',
													}}
												>
													<InputLabel id='status_label'>
														Status
													</InputLabel>
													<Select
														labelId='status_label'
														id='status'
														name='status'
														onChange={
															this.handleChange
														}
														value={
															this.state.form
																?.status || ''
														}
													>
														<MenuItem
															value={'pending'}
														>
															Pending
														</MenuItem>
														<MenuItem
															value={'complete'}
														>
															Complete
														</MenuItem>
														<MenuItem
															value={'failed'}
														>
															Failed
														</MenuItem>
														<MenuItem
															value={'refunded'}
														>
															Refunded
														</MenuItem>
														<MenuItem
															value={'abandoned'}
														>
															Abandoned
														</MenuItem>
													</Select>
												</FormControl>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<FormControlLabel
													control={
														<Switch
															checked={
																this.state
																	.payment
																	?.auto_renew
															}
															disabled
														/>
													}
													label='Auto Renew'
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Col xs={12}></Col>
										</FormGroup>
										<FormGroup>
											<Col>
												<Button
													variant='contained'
													type='submit'
												>
													Update Payment
												</Button>
											</Col>
										</FormGroup>
									</Form>
								</CardBody>
							</Card>
						</div>
					</Row>
				</Container>
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		rcp_url: state.rcp_url,
		user: state.user,
	};
};

const mapDispatchToProps = { setUserLoginDetails };

const styles = {
	date: {
		'&:hover': {
			borderColor: 'inherit',
		},
		'&:focus': {
			borderColor: '#3f51b5',
			borderWidth: '2px',
		},
	},
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(EditPayment));
