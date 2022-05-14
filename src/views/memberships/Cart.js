import React from 'react';

// reactstrap components
import { Table } from 'reactstrap';

class Cart extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
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
						<td className='font-weight-bold'>Memberhsip</td>
						<td>{this.props.membership.name}</td>
					</tr>
					<tr>
						<td className='font-weight-bold'>Discount</td>
						<td>{`${
							this.props.discount.total_discount !== undefined
								? this.props.discount.total_discount
								: '0'
						} ${this.props.membership.currency_symbol}`}</td>
					</tr>
					<tr>
						<td className='font-weight-bold'>Duration</td>
						<td>
							{`${this.props.membership.duration} ${this.props.membership.duration_unit}`}
						</td>
					</tr>
					<tr>
						<td className='font-weight-bold'>Price</td>
						<td>
							{this.props.discount?.total !== undefined ? (
								<>
									<s className='text-red'>
										{this.props.membership.price}
									</s>
									{`${this.props.discount.total} ${this.props.membership.currency_symbol}`}
								</>
							) : (
								<>
									{`${this.props.membership.price} ${this.props.membership.currency_symbol}`}
								</>
							)}
						</td>
					</tr>
				</tbody>
			</Table>
		);
	}
}

export default Cart;
