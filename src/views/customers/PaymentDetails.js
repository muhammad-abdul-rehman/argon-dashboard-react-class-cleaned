import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import { Col, Table } from 'reactstrap';

//MUI

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import { Button } from '@material-ui/core';

class PaymentDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (this.props.payment === null) return null;

		return (
			<>
				<Table bordered striped className='mb-2'>
					<thead>
						<tr>
							<th className='border-right-0'>
								<h2>Payment Details</h2>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className='font-weight-bold'>Amount</td>
							<td>
								{this.props.payment?.amount +
									' ' +
									this.props.payment?.currency_symbol}
							</td>
						</tr>
						<tr>
							<td className='font-weight-bold'>Transaction ID</td>
							<td>{this.props.payment?.transaction_id}</td>
						</tr>
						<tr>
							<td className='font-weight-bold'>Status</td>
							<td>{this.props.payment?.status}</td>
						</tr>
						<tr>
							<td className='font-weight-bold'>Date</td>
							<td>{this.props.payment?.date}</td>
						</tr>
						{this.props.payment?.invoice_url && (
							<tr>
								<td className='font-weight-bold'>
									Invoice URL
								</td>
								<td>
									<a href={this.props.payment?.invoice_url}>
										Invoice URL
									</a>
								</td>
							</tr>
						)}
					</tbody>
				</Table>
				<Col>
					<Button
						className='mb-4'
						variant='contained'
						href={'/admin/payment/edit/' + this.props.payment.id}
					>
						Edit payment
					</Button>
				</Col>
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

export default connect(mappropsToProps, mapDispatchToProps)(PaymentDetails);
