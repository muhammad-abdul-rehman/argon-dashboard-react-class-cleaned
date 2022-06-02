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
	Input,
	Label,
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
	InputLabel,
	Select,
	MenuItem,
	Checkbox,
	ListItemText,
	OutlinedInput,
} from '@material-ui/core';

import MatEdit from 'views/MatEdit';

class EditLogo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validate: {},
			pages_show: [],
			taxonomies: [],
			logoCreated: false,
			logo: null,
			form: {
				title: '',
				page_show: [],
				imgSrc: '',
			},
		};
		this.handleChange = this.handleChange.bind(this);

		this.create_logo_url =
			this.props.rcp_url.domain +
			this.props.rcp_url.base_wp_url +
			'sponsored_logos/' +
			this.props.match.params.id;
	}

	async submitForm() {
		const formData = new FormData(
			document.getElementById('update-logo-form')
		);
		let image_id = false;

		if (
			formData.has('file') &&
			document.getElementById('update-logo-form').file.files.length !== 0
		) {
			const resImage = await this.addProfileImage(formData);
			if (resImage.ok) {
				const data = await resImage.json();
				const { id: image_id } = data;
			}
		}
		const res = await this.updateLogo(image_id ? false : 0);
		if (res.ok) return;
		const data = await res.json();
	}

	handleChange(event) {
		const {
			target: { value },
		} = event;
		if (event.target.name === 'page_show') {
			this.setState(prevState => ({
				...prevState,
				form: {
					...prevState.form,
					// [event.target.name]: [
					// 	typeof value === 'string' ? value.split(',') : value,
					// ],
					[event.target.name]: value,
				},
				taxonomies:
					typeof value === 'string' ? value.split(',') : value,
			}));
		}

		this.setState(prevState => ({
			...prevState,
			form: {
				...prevState.form,
				[event.target.name]: value,
			},
		}));
	}

	componentDidMount() {
		const url = new URL(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_wp_url +
				'page_show'
		);

		fetch(url)
			.then(res => res.json())
			.then(data => this.setState({ pages_show: data }))
			.catch(e => console.error(e));

		if (this.state.logo === null && this.props.user.token !== null)
			this.fetchLogo(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_wp_url +
					'sponsored_logos/' +
					this.props.match.params.id
			);
	}

	componentDidUpdate() {
		if (this.state.logo === null && this.props.user.token !== null)
			this.fetchLogo(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_wp_url +
					'sponsored_logos/' +
					this.props.match.params.id
			);
	}

	fetchLogo = async url => {
		const queryUrl = new URL(url);
		const params = {
			_embed: true,
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
		this.setState({
			logo: data,
			form: {
				title: data?.title.rendered,
				page_show: data?.page_show,
				imgSrc: this.props.item?._embedded['wp:featuredmedia'][0]
					?.source_url,
			},
			taxonomies: data?.page_show,
		});
	};

	/**
	 *
	 */
	addProfileImage(formData) {
		for (let [key, value] of formData) {
			if (key !== 'file') formData.delete(key);
		}

		return fetch(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_wp_url +
				'media',
			{
				method: 'POST',
				headers: {
					//when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
					//so there's no need to set it here
					Authorization: 'Bearer ' + this.props.user.token,
				},
				body: formData,
			}
		);
	}

	updateLogo(id) {
		const formData = new FormData(
			document.getElementById('update-logo-form')
		); // create again for title
		formData.delete('file');
		return fetch(this.create_logo_url, {
			method: 'PUT',
			headers: {
				//when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
				//so there's no need to set it here
				Authorization: 'Bearer ' + this.props.user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...Object.fromEntries(formData),
				featured_media: id
					? parseInt(id)
					: this.state.logo.featured_media,
			}),
		});
	}

	render() {
		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<h3 className='mb-0'>Edit Logo</h3>
								</CardHeader>
								<CardBody>
									<Form
										id='update-logo-form'
										onSubmit={e => {
											e.preventDefault();
											return this.submitForm();
										}}
									>
										<FormGroup row>
											<Col>
												<TextField
													id='title'
													label='Title'
													name='title'
													variant='outlined'
													value={
														this.state.form.title ||
														''
													}
													InputLabelProps={{
														shrink:
															this.state.logo
																?.title
																?.rendered !==
															'',
													}}
													required
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<InputLabel id='taxonomy_select_label'>
													Page Show
												</InputLabel>
												<Select
													style={{ width: '225px' }}
													labelId='taxonomy_select_label'
													id='taxonomy_select'
													multiple
													name='page_show'
													value={
														this.state.taxonomies
													}
													renderValue={selected =>
														this.state.pages_show
															.filter(el =>
																selected.includes(
																	el.id
																)
															)
															.map(el => el.name)
															.join(', ')
													}
													onChange={this.handleChange}
													input={<OutlinedInput />}
													MenuProps={{
														PaperProps: {
															style: {
																maxHeight:
																	48 * 4.5 +
																	8,
																width: 250,
															},
														},
													}}
												>
													{this.state.pages_show
														.length !== 0 &&
														this.state.pages_show.map(
															(page, key) => (
																<MenuItem
																	key={
																		page.name
																	}
																	value={parseInt(
																		page.id
																	)}
																>
																	<Checkbox
																		checked={
																			this.state.taxonomies.indexOf(
																				parseInt(
																					page.id
																				)
																			) >
																			-1
																		}
																	/>
																	<ListItemText
																		primary={
																			page.name
																		}
																	/>
																</MenuItem>
															)
														)}
												</Select>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												{this.state.logo !== null &&
													this.state.logo?._embedded[
														'wp:featuredmedia'
													] && (
														<img
															ref='logo_image'
															src={`${this.state.logo?._embedded['wp:featuredmedia'][0]?.source_url}`}
															srcSet={`${this.state.logo?._embedded['wp:featuredmedia'][0]?.source_url}`}
															alt={
																this.state.logo
																	?.title
																	.rendered
															}
															loading='lazy'
															className='mw-100'
														/>
													)}
												<Input
													type='file'
													name='file'
													id='featured_image'
													accept='image/png, image/jpeg'
												/>
											</Col>
										</FormGroup>
										<FormGroup check row>
											<Col>
												<Button
													variant='contained'
													type='submit'
												>
													Submit
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

export default connect(mapStateToProps, mapDispatchToProps)(EditLogo);
