import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarExport,
} from '@material-ui/data-grid';
import { FormControlLabel, IconButton, Button } from '@material-ui/core';

// reactstrap components
import { Card, CardHeader, Container, Row } from 'reactstrap';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';

import MatEdit from 'views/MatEdit';

class Memberships extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			memberships: [],
			page: 1,
			number: 20,
			membershipLoading: true,
		};
	}

	componentDidMount() {
		this.setState({
			membershipLoading: this.state.memberships?.length === 0,
		});
		if (null === this.props.user.token) {
			this.fetchToken(
				this.props.rcp_url.domain +
					this.props.rcp_url.auth_url +
					'token'
			);
		} else if (this.state.memberships?.length === 0) {
			this.fetchMemberships(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'memberships',
				this.props.user.token,
				this.state.page
			);
		}
	}

	componentDidUpdate({ user: prevUser }, { page: prevPage }) {
		if (
			null !== this.props.user.token &&
			prevUser.token !== this.props.user.token &&
			this.state.memberships?.length === 0
		) {
			this.fetchMemberships(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_url +
					'memberships',
				this.props.user.token,
				this.state.page
			);
		}

		if (prevPage !== this.state.page) {
			this.fetchMemberships(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_url +
					'memberships',
				this.props.user.token,
				this.state.page
			);
		}
	}

	CustomToolbar = () => (
		<GridToolbarContainer>
			{/* <GridToolbarExport /> */}
			<Button
				variant='text'
				startIcon={<i className='fa fa-arrow-alt-circle-down'></i>}
				size='small'
				color='primary'
				onClick={this.getExportCsvFile}
			>
				Export
			</Button>
		</GridToolbarContainer>
	);

	getExportCsvFile = async () => {
		const res = await fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_url +
				'exports/new',
			{
				method: 'post',
				headers: {
					Authorization: 'Bearer ' + this.props.user.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ type: 'memberships' }),
			}
		);
		if (res.status !== 200) return;
		let text = await res.text();
		let date = new Date();
		this.saveExportCSV(
			`rcp-export-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-${date.getUTCHours()}:${date.getUTCMinutes()}`,
			text
		);
	};

	saveExportCSV(filename, text) {
		if (window.navigator.msSaveBlob) {
			// IE 10 and later, and Edge.
			var blobObject = new Blob([text], { type: 'text/csv' });
			window.navigator.msSaveBlob(blobObject, filename);
		} else {
			// Everthing else (except old IE).
			// Create a dummy anchor (with a download attribute) to click.
			var anchor = document.createElement('a');
			anchor.download = filename;
			if (window.URL.createObjectURL) {
				// Everything else new.
				var blobObject = new Blob([text], { type: 'text/csv' });
				anchor.href = window.URL.createObjectURL(blobObject);
			} else {
				// Fallback for older browsers (limited to 2MB on post-2010 Chrome).
				// Load up the data into the URI for "download."
				anchor.href =
					'data:text/csv;charset=utf-8,' + encodeURIComponent(text);
			}
			// Now, click it.
			if (document.createEvent) {
				var event = new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
				});
				anchor.dispatchEvent(event);
			} else {
				anchor.click();
			}
		}
	}

	async fetchToken(token_url) {
		const response = await fetch(token_url, {
			method: 'post',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: process.env.REACT_APP_ATPI_USERNAME,
				password: process.env.REACT_APP_ATPI_PASSWORD,
			}),
		});

		const data = await response.json();
		this.props.setUserLoginDetails(data);
	}

	fetchMemberships = async (url, token, page) => {
		const urlQuery = new URL(url);
		const paramsOptions = {
			number: this.state.number,
			offset: (page - 1) * this.state.number,
			order_by: 'created_date',
			order: 'DESC',
		};
		for (let key in paramsOptions) {
			urlQuery.searchParams.set(key, paramsOptions[key]);
		}

		const res = await fetch(urlQuery, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});
		const data = await res.json();
		this.setState({ memberships: data, membershipLoading: false });
	};

	deleteMembership = async (url, id) => {
		const res = await fetch(url + id, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + this.props.user.token,
			},
		});
		if (res.status !== 200) return this.setState({ error: 'error' });
		const data = await res.json();
		const { errors } = data;
		if (errors) return this.setState({ error: 'error' });
		this.setState({
			memberships: this.state.memberships.filter(el => el.id !== id),
		});
	};

	handlePageChange = params => {
		this.setState({ page: params + 1, membershipLoading: true });
	};

	render() {
		const MatEdit = ({ index }) => {
			const handleEditClick = e => {
				// some action
				e.preventDefault();
				this.props.history.push(
					this.props.history.location.pathname +
						'/renew-membership/' +
						index
				);
			};
			const handleDeleteClick = e => {
				e.preventDefault();
				if (null !== this.props.user.token) {
					this.deleteMembership(
						this.props.rcp_url.domain +
							this.props.rcp_url.base_url +
							'memberships/delete/',
						index
					);
				}
			};

			return (
				<>
					<FormControlLabel
						control={
							<IconButton
								style={{ fontSize: '1rem' }}
								aria-label='edit membership'
								onClick={handleEditClick}
							>
								<i className='fa fa-pen' />
							</IconButton>
						}
					/>
					<FormControlLabel
						control={
							<IconButton
								style={{ fontSize: '1rem' }}
								aria-label='delete membership'
								onClick={handleDeleteClick}
							>
								<i className='fa fa-trash' />
							</IconButton>
						}
					/>
				</>
			);
		};
		const columns = [
			{ field: 'id', headerName: 'ID', width: 90 },
			{ field: 'name', headerName: 'Name', width: 180 },
			{ field: 'customer_name', headerName: 'Customer Name', width: 180 },
			{ field: 'status', headerName: 'Status', width: 180 },
			{ field: 'recurring', headerName: 'Recurring', width: 180 },
			{ field: 'created', headerName: 'Created', width: 180 },
			{
				field: 'actions',
				type: 'actions',
				headerName: 'Actions',
				width: 100,
				cellClassName: 'actions',
				renderCell: params => {
					return (
						<div
							className='d-flex justify-content-between align-items-center'
							style={{ cursor: 'pointer' }}
						>
							<MatEdit index={params.row.id} />
						</div>
					);
				},
			},
		];

		const rows = this.state.memberships.map((item, key) => {
			const date = new Date(item.created_date);
			return {
				id: item.id,
				name: item.membership_name,
				customer_name: item.customer_name,
				status: item.status,
				recurring: item.recurring_amount,
				created:
					date.getDay() +
					'-' +
					date.getMonth() +
					'-' +
					date.getFullYear(),
			};
		});
		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>Memberships</h3>
								</CardHeader>
								<DataGrid
									loading={this.state.membershipLoading}
									autoHeight
									rows={rows}
									columns={columns}
									pageSize={20}
									onPageChange={this.handlePageChange.bind(
										this
									)}
									page={this.state.page - 1}
									rowCount={1000}
									pagination
									paginationMode='server'
									components={{ Toolbar: this.CustomToolbar }}
								/>
								{/* Add Pagination */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Memberships);
