import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import {
	Badge,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	Media,
	Pagination,
	PaginationItem,
	PaginationLink,
	Progress,
	Table,
	Container,
	Row,
	Col,
	UncontrolledTooltip,
	Navbar,
	NavLink,
	Form,
	FormGroup,
} from 'reactstrap';

//MUI
import { DataGrid } from '@material-ui/data-grid';

import fileIcons from '../../variables/file-icons';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import {
	Grid,
	List,
	ListItem,
	ListItemIcon,
	Drawer,
	IconButton,
	Button,
	Link,
	LinearProgress,
	Breadcrumbs,
	Modal,
	TextField,
	Grow,
} from '@material-ui/core';
import ListItemButton from '@material-ui/core/Button';

import 'file-viewer';

class Library extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			libraries: [],
			addLibrary: false,
		};
	}

	componentDidMount() {
		if (this.state.libraries.length === 0)
			this.fetchLibraries(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_wp_url +
					'filr-lists'
			);
	}

	componentDidUpdate() {}

	fetchLibraries = async url => {
		const queryUrl = new URL(url);
		const params = {
			per_page: 100,
		};
		for (let key in params) {
			queryUrl.searchParams.set(key, params[key]);
		}
		const res = await fetch(queryUrl);
		const data = await res.json();
		this.setState({ libraries: data });
	};

	handleChange = event => {
		const { target } = event;
		const value =
			target.type === 'checkbox' ? target.checked : target.value;
		const { name } = target;

		this.setState({
			[name]: value,
		});
	};

	addLibrary = async e => {
		e.preventDefault();
		if (this.props.user.token === null) return;
		const res = await fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_wp_url +
				'filr-lists',
			{
				method: 'post',
				headers: {
					Authorization: 'Bearer ' + this.props.user.token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: this.state.library_name,
				}),
			}
		);
		if (res.status !== 201) {
			console.log('failed');
			return;
		}
		const { code, ...data } = await res.json();
		if (code == 'term_exists') {
			console.log('error', code);
			return;
		}
		this.state.libraries.push(data);
		this.setState({ library_name: '' });
	};

	render() {
		const columns = [
			{
				field: 'id',
				headerName: 'ID',
				width: 90,
			},
			{
				field: 'name',
				headerName: 'Library Name',
				width: 340,
				renderCell: params => (
					<Link href={params.row.link}>{params.row.name}</Link>
				),
			},
			{
				field: 'slug',
				headerName: 'Slug',
				width: 270,
			},
			{
				field: 'count',
				headerName: 'Count',
				width: 180,
			},
		];

		const rows =
			this.state.libraries.length !== 0
				? this.state.libraries.map(item => {
						return {
							id: item.id,
							name: item.name,
							slug: item.slug,
							count: item.count,
							link: item.link,
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
									<h3 className='mb-0'>Club Records</h3>
									<Row className='d-flex '>
										<Grow in={this.state.addLibrary}>
											<Col
												className='animated fadeInLeft'
												xs={10}
											>
												<Form
													onSubmit={this.addLibrary.bind(
														this
													)}
												>
													<FormGroup
														className='mb-0'
														row
													>
														<Col>
															<TextField
																onChange={e =>
																	this.handleChange(
																		e
																	)
																}
																required
																name='library_name'
																id='library_name'
																label='Name'
																variant='outlined'
																size='small'
															/>
														</Col>
														<Button
															type='submit'
															variant='contained'
														>
															Submit
														</Button>
													</FormGroup>
												</Form>
											</Col>
										</Grow>
										<Col xs={2} className='mt-auto mb-auto'>
											<Button
												style={{
													minWidth: 'unset',
													height: 'max-content',
												}}
												aria-label='add a library'
												onClick={() =>
													this.setState({
														addLibrary:
															!this.state
																.addLibrary,
													})
												}
											>
												<i
													className='fa fa-plus'
													style={
														this.state.addLibrary
															? {
																	transform:
																		'rotate(-45deg)',
																	transition:
																		'all 0.1s ease-out',
															  }
															: {}
													}
												/>
											</Button>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									<DataGrid
										loading={
											this.state.libraries.length === 0
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

export default connect(mapStateToProps, mapDispatchToProps)(Library);
