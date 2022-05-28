import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

//MUI
import {
	withStyles,
	TextField,
	Switch,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
	FormControlLabel,
	Input as InputMui,
} from '@material-ui/core';

//Stripe
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';

// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	Label,
	Col,
	Input,
	Container,
	Row,
	CardBody,
	Form,
	FormGroup,
} from 'reactstrap';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import { setMembershipLevels } from 'features/levels/levelsSlice';
import ManualPaymentDropdown from './ManualPaymentDropdown';
import MembershipDetails from 'views/customers/MembershipDetails';
import Cart from './Cart';

class RenewMembership extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			membership: null,
			validate: {
				emailState: '',
			},
			enable_payment: false,
			enable_manual_payment: false,
			error_message: [],
			form: {
				object_id: '',
				customer_name: '',
				recurring_amount: '',
				created_date: '',
				expiration_date: '',
				auto_renew: '',
				maximum_renewals: '',
				times_billed: '',
				status: '',
				gateway_customer_id: '',
				gateway_subscription_id: '',
			},
			selectedMembership: null,
		};
		this.handleChange = this.handleChange.bind(this);
		this.submit_edit_membership = this.submit_edit_membership.bind(this);
	}

	async componentDidMount() {
		if (null === this.state.membership && null !== this.props.user.token) {
			const data = await this.fetchMembership(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'memberships',
				this.props.match.params.id
			);

			if (null === this.state.selectedMembership) {
				this.setState({
					selectedMembership: this.props.levels.levels.find(
						el => el.id === parseInt(data?.object_id)
					),
				});
			}
		}
	}

	async componentDidUpdate({ user: prevUser }) {
		if (
			null !== this.props.user.token &&
			prevUser.token !== this.props.user.token &&
			null === this.state.membership
		) {
			const data = await this.fetchMembership(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'memberships',
				this.props.match.params.id
			);
			if (null === this.state.selectedMembership) {
				this.setState({
					selectedMembership: this.props.levels.levels.find(
						el => el.id === parseInt(data?.object_id)
					),
				});
			}
		}
	}

	async fetchMembership(url, id) {
		const urlQuery = new URL(url);
		const paramsOptions = {
			id: id,
		};
		for (let key in paramsOptions) {
			urlQuery.searchParams.set(key, paramsOptions[key]);
		}

		const response = await fetch(urlQuery, {
			method: 'get',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this.props.user.token,
			},
		});
		const data = await response.json();

		this.setState({
			membership: data,
			form: {
				object_id: data?.object_id,
				customer_name: data?.customer_name,
				recurring_amount: data?.recurring_amount,
				created_date: data?.created_date,
				expiration_date: data?.expiration_date,
				auto_renew: data?.auto_renew,
				maximum_renewals: data?.maximum_renewals,
				times_billed: data?.times_billed,
				status: data?.status,
				gateway_customer_id: data?.gateway_customer_id,
				gateway_subscription_id: data?.gateway_subscription_id,
			},
		});

		return data;
	}

	handleChange = event => {
		const { target } = event;
		const value =
			target.type === 'checkbox' ? target.checked : target.value;
		const { name } = target;

		if (event.target.name === 'object_id') {
			this.setState(prevState => ({
				...prevState,
				form: {
					...prevState.form,
					[name]: value,
				},
				selectedMembership: this.props.levels.levels.find(
					el => el.id === value
				),
			}));
		} else {
			this.setState(prevState => ({
				...prevState,
				form: {
					...prevState.form,
					[name]: value,
				},
			}));
		}
	};

	validateEmail(e) {
		const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

		const { validate } = this.state;

		if (emailRegex.test(e.target.value)) {
			validate.emailState = 'has-success';
		} else {
			validate.emailState = 'has-danger';
		}

		this.setState({ validate });
	}

	/**
	 * Handle Payment
	 * @param {*} event
	 */
	async handlePayment(event) {
		const { stripe, elements } = this.props.stripe;
		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}
		const cardElement = elements.getElement('card');
		try {
			const membership = this.props.levels.levels.find(
				el => el.id === parseInt(this.state.membership.object_id)
			);
			const formData = new FormData();
			formData.append('object_id', membership.id);
			const res = await fetch(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_url +
					'payments/payment_intent',
				{
					method: 'post',
					headers: {
						Authorization: 'Bearer ' + this.props.user.token,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(Object.fromEntries(formData)),
				}
			);
			const { client_secret } = await res.json();
			const paymentMethodReq = await stripe.createPaymentMethod({
				type: 'card',
				card: cardElement,
				billing_details: {
					name: membership.customer_name,
				},
			});

			if (paymentMethodReq.error) {
				throw paymentMethodReq.error;
			}

			const { error, ...transaction } = await stripe.confirmCardPayment(
				client_secret,
				{
					payment_method: paymentMethodReq.paymentMethod.id,
				}
			);

			if (error) {
				throw error;
			}

			return Promise.resolve(transaction.paymentIntent);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	/**
	 * Submit the form.
	 */
	async submit_edit_membership(event) {
		event.persist();
		event.preventDefault();
		if (this.state.enable_payment) {
			const transaction = await this.handlePayment(event);
			console.log(transaction);
			this.addPayment(this.state.selectedMembership, transaction)
				.then(res => {
					if (res.status > 400) return Promise.reject(res);
					return res.json();
				})
				.then(data_payment => {
					const { errors } = data_payment;
					if (errors) return Promise.reject(errors);
					return this.updateMembership(event);
				})
				.then(res => {
					if (res.ok) return res.json();
				})
				.then(data => {
					if (this.state.update) {
						this.setState({
							membership: data,
							form: {
								object_id: data?.object_id,
								customer_name: data?.customer_name,
								recurring_amount: data?.recurring_amount,
								created_date: data?.created_date,
								expiration_date: data?.expiration_date,
								auto_renew: data?.auto_renew,
								maximum_renewals: data?.maximum_renewals,
								times_billed: data?.times_billed,
								status: data?.status,
								gateway_customer_id: data?.gateway_customer_id,
								gateway_subscription_id:
									data?.gateway_subscription_id,
							},
						});
					}
				})
				.catch(e => console.error(e));
		} else if (this.state.enable_manual_payment) {
			this.addManualPayment(event, this.state.selectedMembership)
				.then(res => {
					if (res.status > 400) return Promise.reject(res);
					return res.json();
				})
				.then(data_payment => {
					const { errors } = data_payment;
					if (errors) return Promise.reject(errors);
					return this.updateMembership(event);
				})
				.then(res => {
					if (res.ok) return res.json();
				})
				.then(data => {
					if (this.state.update) {
						this.setState({
							membership: data,
							form: {
								object_id: data?.object_id,
								customer_name: data?.customer_name,
								recurring_amount: data?.recurring_amount,
								created_date: data?.created_date,
								expiration_date: data?.expiration_date,
								auto_renew: data?.auto_renew,
								maximum_renewals: data?.maximum_renewals,
								times_billed: data?.times_billed,
								status: data?.status,
								gateway_customer_id: data?.gateway_customer_id,
								gateway_subscription_id:
									data?.gateway_subscription_id,
							},
						});
					}
				})
				.catch(e => console.error(e));
		} else {
			this.updateMembership(event)
				.then(res => {
					if (res.status !== 200) return Promise.reject(res);
					return res.json();
				})
				.then(data => {
					const { errors } = data;
					if (errors) return Promise.reject(errors);
					this.setState({
						membership: data,
						form: {
							...this.state.form,
							object_id: data?.object_id,
							//@todo add in the api.
							// customer_name: data?.customer_name,
							// recurring_amount: data?.recurring_amount,
							// created_date: data?.created_date,
							// expiration_date: data?.expiration_date,
							// auto_renew: data?.auto_renew,
							// maximum_renewals: data?.maximum_renewals,
							// times_billed: data?.times_billed,
							// status: data?.status,
							// gateway_customer_id: data?.gateway_customer_id,
							// gateway_subscription_id:
							// 	data?.gateway_subscription_id,
						},
					});
					return data;
				})
				.catch(e => console.error(e));
		}
	}

	renew_membership(membership) {
		return fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_url +
				'memberships/' +
				this.state.membership.id +
				'/renew',
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + this.props.user.token,
				},
				body: JSON.stringify({
					id: membership.id,
					status: membership.status,
					expiration: membership.expiration,
				}),
			}
		);
	}

	updateMembership(event) {
		const formData = new FormData(event.target);
		return fetch(
			this.props.rcp_url.proxy_domain +
				this.props.rcp_url.base_url +
				'memberships/new',
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + this.props.user.token,
				},
				body: JSON.stringify({
					...Object.fromEntries(formData),
					// paid_by: event.target.paid_by.value,
				}),
			}
		);
	}

	addPayment(membership, transaction) {
		const args = {
			subscription: membership.name,
			object_id: membership.id,
			user_id: this.state.membership.user_id,
			amount: transaction.amount,
			transaction_id: transaction.id,
			status: transaction.status === 'succeeded' ? 'complete' : 'failed',
			gateway: 'stripe',
		};

		return fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_url +
				'payments/new',
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + this.props.user.token,
				},
				body: JSON.stringify(args),
			}
		);
	}

	addManualPayment(event, membership) {
		const formData = new FormData(event.target);
		const fields = [
			'transaction_id',
			'gateway',
			'date',
			'transaction_id',
			'gateway_manual',
		];
		const payment_args = {
			subscription: membership.name,
			object_id: membership.id,
			user_id: this.state.membership.user_id,
			amount: this.state.discountDetails?.total
				? this.state.discountDetails?.total
				: membership.price,
			status: 'complete',
		};
		formData.forEach((val, key) => {
			if (fields.includes(key)) {
				payment_args[key] = val;
			}
		});
		return fetch(
			this.props.rcp_url.proxy_domain +
				this.props.rcp_url.base_url +
				'payments/new',
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + this.props.user.token,
				},
				body: JSON.stringify(payment_args),
			}
		);
	}

	render() {
		const cardElementOptions = {
			style: { base: {}, invalid: {} },
			hidePostalCode: true,
		}; // @todo for styling card element.

		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<Row className='justify-content-between'>
										<h3 className='mb-0 ml-3'>
											Renew Membership
										</h3>
										<Button
											disabled={
												this.state.membership === null
											}
											className='mr-3'
											onClick={e =>
												this.submit_edit_membership(
													e
												).bind(this)
											}
										>
											Renew
										</Button>
									</Row>
								</CardHeader>
								<CardBody>
									<Form
										id='edit_membership'
										onSubmit={this.submit_edit_membership}
									>
										<Input
											type='hidden'
											name='customer_id'
											value={
												this.state.membership
													?.customer_id
											}
										/>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='ATPI Membership Number'
													name='user_login'
													variant='outlined'
													helperText={
														'You cannot change this.'
													}
													value={
														this.state.membership
															?.user_login || ''
													}
													InputLabelProps={{
														shrink:
															this.state
																.membership
																?.user_login !==
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
														minWidth: '100%',
													}}
												>
													<InputLabel id='object_id_label'>
														Membership Type
													</InputLabel>
													<Select
														labelId='object_id_label'
														id='object_id'
														name='object_id'
														onChange={
															this.handleChange
														}
														value={
															this.state.form
																?.object_id ||
															''
														}
													>
														{this.props.levels.levels.map(
															(item, key) => (
																<MenuItem
																	key={key}
																	value={
																		item.id
																	}
																>
																	{item.name}
																</MenuItem>
															)
														)}
													</Select>
												</FormControl>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Customer Name'
													name='customer_name'
													variant='outlined'
													value={
														this.state.form
															?.customer_name ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state
																.membership
																?.customer_name !==
															undefined,
													}}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Recurring Amount'
													name='recurring_amount'
													variant='outlined'
													value={
														this.state.form
															?.recurring_amount ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state
																.membership
																?.recurring_amount !==
															undefined,
													}}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label>Created Date</Label>
												<Input
													type='date'
													name='created_date'
													className={
														this.props.classes
															.date +
														' MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl'
													}
													value={
														this.state.form?.created_date?.split(
															' '
														)[0] || ''
													}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<Label>Expiration Date</Label>
												<Input
													type='date'
													name='expiration_date'
													className={
														this.props.classes
															.date +
														' MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl'
													}
													value={
														this.state.form?.expiration_date?.split(
															' '
														)[0] || ''
													}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<FormControlLabel
													control={
														<Switch
															defaultChecked={
																this.state
																	.membership
																	?.auto_renew
															}
															name='auto_renew'
															onChange={
																this
																	.handleChange
															}
														/>
													}
													label='Auto Renew'
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Maximum Renewals'
													name='maximum_renewals'
													variant='outlined'
													value={
														this.state.form
															?.maximum_renewals ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state
																.membership
																?.maximum_renewals !==
															undefined,
													}}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Times Billed'
													name='times_billed'
													variant='outlined'
													type='number'
													value={
														this.state.form
															?.times_billed || ''
													}
													InputLabelProps={{
														shrink:
															this.state
																.membership
																?.times_billed !==
															undefined,
													}}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<FormControl
													style={{
														minWidth: '100%',
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
															value={'active'}
														>
															Active
														</MenuItem>
														<MenuItem
															value={'expired'}
														>
															Expired
														</MenuItem>
														<MenuItem
															value={'cancelled'}
														>
															Cancelled
														</MenuItem>
														<MenuItem
															value={'pending'}
														>
															Pending
														</MenuItem>
													</Select>
												</FormControl>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Gateway Customer ID'
													name='gateway_customer_id'
													variant='outlined'
													value={
														this.state.form
															?.gateway_customer_id ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state
																.membership
																?.gateway_customer_id !==
															undefined,
													}}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Gateway Subscription ID'
													name='gateway_subscription_id'
													variant='outlined'
													value={
														this.state.form
															?.gateway_subscription_id ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state
																.membership
																?.gateway_subscription_id !==
															undefined,
													}}
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<TextField
													id='outlined-basic'
													label='Gateway'
													name='gateway'
													variant='outlined'
													value={
														this.state.form
															?.gateway || ''
													}
													InputLabelProps={{
														shrink:
															this.state
																.membership
																?.gateway !==
															undefined,
													}}
													disabled
												/>
											</Col>
										</FormGroup>
										{this.state.selectedMembership &&
											this.state.selectedMembership
												?.price !== 0 && (
												<Cart
													membership={
														this.state
															.selectedMembership
													}
												/>
											)}
										<FormGroup
											disabled={
												this.state.enable_manual_payment
											}
											row
										>
											<Label sm={4} for='payment_enable'>
												Pay with card.
											</Label>
											<Col md={6}>
												<Switch
													name='payment_enable'
													onChange={e =>
														this.setState({
															enable_payment:
																e.target
																	.checked,
														})
													}
												/>
											</Col>
										</FormGroup>

										{this.state.selectedMembership
											?.price !== 0 &&
											this.state.enable_payment ===
												true && (
												<FormGroup row>
													<Col md={12}>
														<CardElement
															options={
																cardElementOptions
															}
														/>
													</Col>
												</FormGroup>
											)}
										<FormGroup
											disabled={this.state.enable_payment}
											row
										>
											<Label
												sm={4}
												for='enable_manual_payment'
											>
												Pay manually.
											</Label>
											<Col md={6}>
												<Switch
													name='enable_manual_payment'
													onChange={e =>
														this.setState({
															enable_manual_payment:
																e.target
																	.checked,
														})
													}
												/>
											</Col>
										</FormGroup>
										{this.state.selectedMembership
											?.price !== 0 &&
											this.state.enable_manual_payment ===
												true && (
												<FormGroup tag='fieldset'>
													<Input
														name='gateway'
														value='manual'
														type='hidden'
													/>
													<ManualPaymentDropdown />
													<FormGroup row>
														<Label sm={4}>
															Payment date
														</Label>
														<Col
															className='mt-sm-2 mt-md-0'
															md={6}
														>
															<Input
																id='payment_date'
																name='date'
																placeholder='Payment date'
																type='date'
																onChange={e => {
																	this.handleChange(
																		e
																	);
																}}
															/>
														</Col>
													</FormGroup>
													<FormGroup row>
														<Label sm={4}>
															Payment Reference:
														</Label>
														<Col
															className='mt-sm-2 mt-md-0'
															md={6}
														>
															<Input
																id='transaction_id'
																name='transaction_id'
																placeholder='Payment Reference:'
																type='text'
																onChange={e => {
																	this.handleChange(
																		e
																	);
																}}
															/>
														</Col>
													</FormGroup>
												</FormGroup>
											)}
										<FormGroup row>
											<Col
												sm={{
													size: 10,
												}}
											>
												<Button type='submit'>
													Update Membership
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

const injectedRenewMembership = props => (
	<ElementsConsumer>
		{(stripe, elements) => (
			<RenewMembership {...props} stripe={stripe} elements={elements} />
		)}
	</ElementsConsumer>
);

const mapStateToProps = state => {
	return {
		rcp_url: state.rcp_url,
		user: state.user,
		levels: state.levels,
	};
};

const mapDispatchToProps = { setUserLoginDetails, setMembershipLevels };

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
)(withStyles(styles)(injectedRenewMembership));
