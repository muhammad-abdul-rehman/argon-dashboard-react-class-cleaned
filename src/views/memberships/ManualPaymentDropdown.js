import React from 'react';
import {
	Button,
	Card,
	CardHeader,
	Label,
	Col,
	Input,
	InputGroup,
	Container,
	Row,
	CardBody,
	Form,
	FormFeedback,
	FormGroup,
	Table,
	Progress,
} from 'reactstrap';
const ManualPaymentDropdown = ({ defaultValue }) => {
	return (
		<>
			<legend>Payment Type</legend>
			<FormGroup check>
				<Input
					name='gateway_manual'
					type='radio'
					value='Stripe Phone Payment'
				/>
				<Label check>Stripe Phone Payment</Label>
			</FormGroup>
			<FormGroup check>
				<Input
					name='gateway_manual'
					type='radio'
					value='Stripe Payment link'
				/>
				<Label check>Stripe Payment link</Label>
			</FormGroup>
			<FormGroup check>
				<Input name='gateway_manual' type='radio' value='Paypal' />{' '}
				<Label check>PayPal</Label>
			</FormGroup>
			<FormGroup check>
				<Input
					name='gateway_manual'
					type='radio'
					value='Bank Transfer'
				/>
				<Label check>Bank Transfer</Label>
			</FormGroup>
			<FormGroup check>
				<Input name='gateway_manual' type='radio' value='Cheque' />
				<Label check>Cheque</Label>
			</FormGroup>
			<FormGroup check>
				<Input name='gateway_manual' type='radio' value='Cash' />
				<Label check>Cash</Label>
			</FormGroup>
			<FormGroup check>
				<Input name='gateway_manual' type='radio' value='Honorary' />
				<Label check>Honorary</Label>
			</FormGroup>
		</>
	);
};

export default ManualPaymentDropdown;
