import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

//@mui
import { Switch, withStyles } from '@material-ui/core';

// reactstrap components
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

import PhoneInput from 'react-phone-input-2';

//Country Selector

class ClubMember extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validate: {
				emailState: '',
			},
		};
	}
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

	render() {
		return (
			<div id='group_members'>
				<FormGroup row>
					<Label
						sm={4}
						for={
							'members[' +
							this.props.memberIndex +
							'][first_name]'
						}
					>
						First Name
					</Label>
					<Col md={6}>
						<Input
							id={
								'members[' +
								this.props.memberIndex +
								'][first_name]'
							}
							name={
								'members[' +
								this.props.memberIndex +
								'][first_name]'
							}
							placeholder='First Name'
							type='text'
							onChange={e => {
								this.props.handleChange(e);
							}}
							required
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label
						sm={4}
						for={
							'members[' + this.props.memberIndex + '][last_name]'
						}
					>
						Last Name
					</Label>
					<Col md={6}>
						<Input
							id={
								'members[' +
								this.props.memberIndex +
								'][last_name]'
							}
							name={
								'members[' +
								this.props.memberIndex +
								'][last_name]'
							}
							placeholder='Last Name'
							type='text'
							onChange={e => {
								this.props.handleChange(e);
							}}
							required
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label
						for={'members[' + this.props.memberIndex + '][email]'}
						sm={4}
					>
						Email
					</Label>
					<Col md={6}>
						<Input
							id={
								'members[' + this.props.memberIndex + '][email]'
							}
							name={
								'members[' + this.props.memberIndex + '][email]'
							}
							placeholder='Email'
							type='email'
							valid={
								this.state.validate.emailState === 'has-success'
							}
							invalid={
								this.state.validate.emailState === 'has-danger'
							}
							onChange={e => {
								this.validateEmail(e);
								this.props.handleChange(e);
							}}
							required
						/>
						<FormFeedback>
							Please use a valid email address.
						</FormFeedback>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label
						for={
							'members[' + this.props.memberIndex + '][password]'
						}
						sm={4}
					>
						Password
					</Label>
					<Col md={6}>
						<Input
							id={
								'members[' +
								this.props.memberIndex +
								'][password]'
							}
							name={
								'members[' +
								this.props.memberIndex +
								'][password]'
							}
							placeholder='Password'
							type='password'
							required
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label
						sm={4}
						for={
							'members[' + this.props.memberIndex + '][workplace]'
						}
					>
						Workplace
					</Label>
					<Col md={6}>
						<Input
							name={
								'members[' +
								this.props.memberIndex +
								'][workplace]'
							}
							type='text'
							placeholder='Workplace'
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Label
						sm={4}
						for={
							'members[' +
							this.props.memberIndex +
							'][reference_club]'
						}
					>
						Job Title
					</Label>
					<Col md={6}>
						<Input
							name={
								'members[' +
								this.props.memberIndex +
								'][reference_club]'
							}
							type='text'
							placeholder='Job Title'
						/>
					</Col>
				</FormGroup>
				<Row className='mb-4'>
					<Col className='d-flex justify-content-end'>
						<Button onClick={this.props.increment}>
							Add More Members
						</Button>
						<Button onClick={this.props.decrement}>
							Delete Members
						</Button>
					</Col>
				</Row>
			</div>
		);
	}
}
export default ClubMember;
