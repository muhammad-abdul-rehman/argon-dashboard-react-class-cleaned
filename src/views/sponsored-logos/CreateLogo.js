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

class CreateLogo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validate: {},
			taxonomies: [],
			pages_show: [],
			logoCreated: false,
		};
		this.handleChange = this.handleChange.bind(this);

		this.create_logo_url =
			this.props.rcp_url.domain +
			this.props.rcp_url.base_wp_url +
			'sponsored_logos';
	}

	submitForm() {
		const formData = new FormData(
			document.getElementById('create-logo-form')
		);
		this.addProfileImage(formData)
			.then(res => res.json())
			.then(data => {
				const { id: image_id } = data;
				console.log(data);
				return this.createLogo(image_id);
			})
			.then(res => res.json())
			.then(data => console.log(data))
			.catch(err => {
				console.error(err);
			});
	}

	handleChange(event) {
		const {
			target: { value },
		} = event;
		this.setState(
			// On autofill we get a stringified value.
			{ taxonomies: typeof value === 'string' ? value.split(',') : value }
		);
	}

	componentDidMount() {
		const url = new URL(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_wp_url +
				'page_show'
		);
		const params = {
			_fields: 'id,name',
		};
		fetch(url)
			.then(res => res.json())
			.then(data => this.setState({ pages_show: data }))
			.catch(e => console.error(e));
	}

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

	createLogo(id) {
		const formData = new FormData(
			document.getElementById('create-logo-form')
		); // create again for title
		formData.delete('file');
		return fetch(this.create_logo_url, {
			method: 'POST',
			headers: {
				//when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
				//so there's no need to set it here
				Authorization: 'Bearer ' + this.props.user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...Object.fromEntries(formData),
				featured_media: parseInt(id),
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
									<h3 className='mb-0'>Create Logo</h3>
								</CardHeader>
								<CardBody>
									<Form
										id='create-logo-form'
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
												<Label for='featured_image'>
													File
												</Label>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateLogo);
