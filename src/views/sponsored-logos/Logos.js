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
import LogoLoopSingle from './LogoLoopSingle';

class Logos extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			logos: [],
		};
	}

	componentDidMount() {
		if (this.state.logos.length === 0 && this.props.user.token !== null)
			this.fetchLogos(
				this.props.rcp_url.domain +
					this.props.rcp_url.base_wp_url +
					'sponsored_logos'
			);
	}

	componentDidUpdate() {
		if (this.state.logos.length === 0 && this.props.user.token !== null)
			this.fetchLogos(
				this.props.rcp_url.proxy_domain +
					this.props.rcp_url.base_wp_url +
					'sponsored_logos'
			);
	}

	fetchLogos = async url => {
		const queryUrl = new URL(url);
		const params = {
			per_page: 100,
			_embed: true,
			status: 'any',
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
		this.setState({ logos: data });
	};

	editLogo = (e, id) => {
		e.preventDefault();
		this.props.history.push(
			this.props.history.location.pathname + '/edit/' + id
		);
	};
	deleteLogo = async (url, id) => {
		const res = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + this.props.user.token,
			},
		});

		if (res.status > 400) {
			const data = await res.text();
		}

		this.setState({ logos: this.state.logos.filter(el => el.id !== id) });
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
									<h3 className='mb-0'>Sponsor Logos</h3>
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
													<LogoLoopSingle
														key={key}
														item={item}
														deleteHandle={
															this.deleteLogo
														}
														editHandle={
															this.editLogo
														}
													/>
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
