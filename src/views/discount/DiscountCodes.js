import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import { Card, CardHeader, CardBody, Media, Container, Row } from 'reactstrap';

//MUI
import { DataGrid } from '@material-ui/data-grid';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import {
	LinearProgress,
	Avatar,
	Chip,
	withStyles,
	Button,
} from '@material-ui/core';

class DiscountCodes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			discount_codes: [],
		};
	}

	componentDidMount() {
		if (
			this.state.discount_codes.length === 0 &&
			this.props.user.token !== null
		)
			this.fetchDiscountCodes(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'discounts'
			);
	}

	componentDidUpdate({ user: prevUser }) {
		if (prevUser !== this.props.user && this.props.user.token !== null) {
			this.fetchDiscountCodes(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'discounts'
			);
		}
	}

	fetchDiscountCodes = async url => {
		const queryUrl = new URL(url);
		const params = {
			per_page: 100,
			context: 'edit',
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
		const data = await res.json();
		this.setState({ discount_codes: data });
	};

	render() {
		const columns = [
			{
				field: 'id',
				headerName: 'ID',
				width: 100,
			},
			{
				field: 'name',
				headerName: 'Name',
				width: 180,
			},
			{
				field: 'code',
				headerName: 'Discount Code',
				width: 180,
				renderCell({ row, ...params }) {
					return <Chip className={row?.class} label={row?.code} />;
				},
			},
			{
				field: 'amount',
				headerName: 'Amount',
				width: 180,
				renderCell({ row }) {
					return (
						<span
							dangerouslySetInnerHTML={{ __html: row?.amount }}
						/>
					);
				},
			},
			{
				field: 'status',
				type: 'status',
				headerName: 'Status',
				width: 100,
			},
			{
				field: 'expiration',
				type: 'expiration',
				headerName: 'Expiration',
				width: 180,
			},
			{
				field: 'is_expired',
				type: 'is_expired',
				headerName: 'Expired',
				width: 100,
			},
			{
				field: 'used',
				type: 'used',
				headerName: 'Used',
				width: 100,
			},
		];

		const rows =
			this.state.discount_codes.length !== 0
				? this.state.discount_codes.map(item => {
						const date =
							item?.expiration !== null &&
							new Date(item?.expiration);
						return {
							id: item.id,
							name: item?.name,
							code: item?.code,
							amount: item?.amount,
							status: item?.status,
							expiration:
								item?.expiration === null
									? 'No Expiration'
									: date.getDay() +
									  '-' +
									  date.getMonth() +
									  '-' +
									  date.getFullYear(),
							is_expired: item?.is_expired,
							used: `${item?.use_count} / ${
								item?.max_uses == 0
									? 'unlimited'
									: item?.max_uses
							}`,
							class: this.props.classes.chip,
						};
				  })
				: [];

		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0 d-flex justify-content-between pl-3 pr-3'>
									<h3 className='mb-0'>Discount Codes</h3>
									<Button
										variant='contained'
										onClick={() =>
											this.props.history.push(
												'discount/create'
											)
										}
									>
										Create
									</Button>
								</CardHeader>
								<CardBody>
									<DataGrid
										loading={
											this.state.discount_codes.length ===
											0
										}
										components={{
											LoadingOverlay: LinearProgress,
										}}
										autoHeight
										rows={rows}
										columns={columns}
									/>
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

const styles = theme => ({
	chip: {
		position: 'relative',
		transition: 'transform 0.5s',
		'&:hover': {
			transform: 'translate(-2px,-2px)',
		},
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(DiscountCodes));
