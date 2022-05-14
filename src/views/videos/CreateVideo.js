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
	withStyles,
} from '@material-ui/core';

import MatEdit from 'views/MatEdit';

class CreateVideo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validate: {},
			organizers_show: [],
			organizers: [],
			videoCreated: false,
		};
		this.handleChange = this.handleChange.bind(this);

		this.create_video_url =
			this.props.rcp_url.domain +
			this.props.rcp_url.base_wp_url +
			'webinar';
	}

	submitForm() {
		this.createVideo()
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
			{ organizers: typeof value === 'string' ? value.split(',') : value }
		);
	}

	componentDidMount() {
		const url = new URL(
			this.props.rcp_url.domain +
				this.props.rcp_url.base_wp_url +
				'event_organizer'
		);
		const params = {
			_fields: 'id,title',
		};
		for (let param in params) {
			url.searchParams.set(param, params[param]);
		}
		fetch(url)
			.then(res => res.json())
			.then(data => this.setState({ organizers_show: data }))
			.catch(e => console.error(e));
	}

	createVideo() {
		const formData = new FormData(
			document.getElementById('create-video-form')
		);
		const data = { acf: {} };
		formData.forEach((val, key) => {
			if (key === 'title') {
				data[key] = val;
			} else {
				data.acf[key] = val;
			}
		});
		return fetch(this.create_video_url, {
			method: 'POST',
			headers: {
				//when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
				//so there's no need to set it here
				Authorization: 'Bearer ' + this.props.user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
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
									<h3 className='mb-0'>Create Video</h3>
								</CardHeader>
								<CardBody>
									<Form
										id='create-video-form'
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
												<TextField
													id='webinar_recording_video'
													label='Recording Video'
													name='webinar_recording_video'
													variant='outlined'
													required
												/>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<div className='MuiFormControl-root MuiTextField-root'>
													<Label
														className='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined'
														for='date'
														data-shrink='false'
														id='label-date'
													>
														Date
													</Label>
												</div>
												<div className='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl'>
													<Input
														id='date'
														className={
															this.props.classes
																.date +
															' MuiInputBase-input MuiOutlinedInput-input'
														}
														name='date'
														placeholder='date placeholder'
														type='date'
														onFocus={e => {
															document
																.getElementById(
																	'label-date'
																)
																.classList.add(
																	'Mui-focused',
																	'MuiInputLabel-shrink'
																);
															e.target.parentNode.classList.add(
																'Mui-focused'
															);
															document
																.getElementById(
																	'legend-date'
																)
																.classList.add(
																	'PrivateNotchedOutline-legendNotched-5',
																	'PrivateNotchedOutline-legendNotched'
																);
														}}
														onBlur={e => {
															document
																.getElementById(
																	'label-date'
																)
																.classList.remove(
																	'Mui-focused'
																);
															e.target.parentNode.classList.remove(
																'Mui-focused'
															);
															if (
																e.target
																	.value !==
																''
															) {
																document
																	.getElementById(
																		'label-date'
																	)
																	.classList.add(
																		'MuiInputLabel-filled'
																	);
																e.target.style.setProperty(
																	'--datetime-edit-color',
																	'#000'
																);
															} else {
																e.target.style.setProperty(
																	'--datetime-edit-color',
																	'transparent'
																);
																document
																	.getElementById(
																		'label-date'
																	)
																	.classList.remove(
																		'MuiInputLabel-shrink'
																	);
																document
																	.getElementById(
																		'legend-date'
																	)
																	.classList.remove(
																		'PrivateNotchedOutline-legendNotched-5',
																		'PrivateNotchedOutline-legendNotched'
																	);
															}
														}}
													/>
													<fieldset
														className={
															this.props.classes
																.fieldset +
															' PrivateNotchedOutline-root MuiOutlinedInput-notchedOutline'
														}
													>
														<legend
															className={
																this.props
																	.classes
																	.legend
															}
															id='legend-date'
														>
															<span>Date</span>
														</legend>
													</fieldset>
												</div>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Col>
												<InputLabel id='organizer_select_label'>
													Organizers
												</InputLabel>
												<Select
													style={{ width: '225px' }}
													labelId='organizer_select_label'
													id='organizer_select'
													multiple
													name='organizers'
													value={
														this.state.organizers
													}
													renderValue={selected =>
														this.state.organizers_show
															.filter(el =>
																selected.includes(
																	el.id
																)
															)
															.map(
																el =>
																	el.title
																		.rendered
															)
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
															},
														},
													}}
												>
													{this.state.organizers_show
														.length !== 0 &&
														this.state.organizers_show.map(
															(
																organizer,
																key
															) => (
																<MenuItem
																	key={key}
																	value={parseInt(
																		organizer.id
																	)}
																>
																	<Checkbox
																		checked={
																			this.state.organizers.indexOf(
																				parseInt(
																					organizer.id
																				)
																			) >
																			-1
																		}
																	/>
																	<ListItemText
																		primary={
																			organizer
																				.title
																				.rendered
																		}
																	/>
																</MenuItem>
															)
														)}
												</Select>
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

const styles = {
	date: {
		'--datetime-edit-color': 'transparent',
		'&::-webkit-datetime-edit': {
			color: "var(--datetime-edit-color , 'transparent')",
		},
		'&:focus::-webkit-datetime-edit': {
			color: '#000',
		},
	},
	fieldset: {
		top: '-5px',
		left: 0,
		right: 0,
		bottom: 0,
		margin: 0,
		padding: '0 8px',
		overflow: 'hidden',
		position: 'absolute',
		borderStyle: 'solid',
		borderWidth: '1px',
		borderRadius: 'inherit',
		pointerEvents: 'none',
	},
	legend: {
		width: 'auto',
		height: '11px',
		display: 'block',
		padding: 0,
		fontSize: '0.75em',
		maxWidth: '0.01px',
		textAlign: 'left',
		transition: 'max-width 50ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
		visibility: 'hidden',
		'&.PrivateNotchedOutline-legendNotched': {
			maxWidth: '1000px',
			transition: 'max-width 100ms cubic-bezier(0.0, 0, 0.2, 1) 50ms',
		},
		'& > span': {
			display: 'inline-block',
			paddingLeft: '5px',
			paddingRight: '5px',
		},
	},
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(CreateVideo));
