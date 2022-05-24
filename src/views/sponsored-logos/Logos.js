import OnlyHeader from 'components/Headers/OnlyHeader';
import React from 'react';

// reactstrap components
import { Card, CardHeader, CardBody, Container, Row } from 'reactstrap';

import { connect } from 'react-redux';
import { setUserLoginDetails } from 'features/user/userSlice';
import {
	Button,
	ImageList,
	ImageListItem,
	ImageListItemBar,
} from '@material-ui/core';

import 'file-viewer';

class Logos extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			logos: [],
		};
	}

	componentDidMount() {
		if (this.state.logos.length === 0)
			this.fetchLogos(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_wp_url +
					'sponsored_logos'
			);
	}

	componentDidUpdate() {}

	fetchLogos = async url => {
		const queryUrl = new URL(url);
		const params = {
			per_page: 100,
			_embed: true,
		};
		for (let key in params) {
			queryUrl.searchParams.set(key, params[key]);
		}
		const res = await fetch(queryUrl);
		const data = await res.json();
		this.setState({ logos: data });
	};

	render() {
		return (
			<>
				<OnlyHeader />
				<Container className='mt--8' fluid>
					<Row>
						<div className='col'>
							<Card className='shadow'>
								<CardHeader className='border-0 d-flex justify-content-between pl-3 pr-3'>
									<h3 className='mb-0'>Sponsored Logos</h3>
									<Button
										variant='contained'
										onClick={() =>
											this.props.history.push(
												'sponsored-logos/create'
											)
										}
									>
										Create
									</Button>
								</CardHeader>
								<CardBody>
									<ImageList
										variant='masonry'
										cols={3}
										gap={8}
									>
										{this.state.logos.length !== 0 &&
											this.state.logos.map(
												(item, key) => (
													<ImageListItem key={key}>
														<img
															src={`${item?._embedded['wp:featuredmedia'][0]?.source_url}?w=248&fit=crop&auto=format`}
															srcSet={`${item?._embedded['wp:featuredmedia'][0]?.source_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
															alt={
																item.title
																	.rendered
															}
															loading='lazy'
														/>
														<ImageListItemBar
															position='bottom'
															title={
																<>
																	<p
																		className='mb-0'
																		dangerouslySetInnerHTML={{
																			__html: item
																				.title
																				.rendered,
																		}}
																	></p>
																	{item
																		?._embedded[
																		'wp:term'
																	].length !==
																		0 && (
																		<p className='mb-0'>
																			Page
																			Shown:{' '}
																			{
																				item?._embedded[
																					'wp:term'
																				].pop()
																					?.name
																			}
																		</p>
																	)}
																</>
															}
														/>
													</ImageListItem>
												)
											)}
									</ImageList>
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

export default connect(mapStateToProps, mapDispatchToProps)(Logos);
