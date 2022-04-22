import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Container, Row } from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@material-ui/core";

import "file-viewer";
import Vimeo from "@u-wave/react-vimeo";

class Videos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
    };
  }

  componentDidMount() {
    if (this.state.videos.length === 0)
      this.fetchLogos(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "webinar"
      );
  }

  componentDidUpdate() {}

  fetchLogos = async (url) => {
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
    this.setState({ videos: data });
  };

  render() {
    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0 d-flex justify-content-between pl-3 pr-3">
                  <h3 className="mb-0">Videos</h3>
                  <Button
                    variant="contained"
                    onClick={() =>
                      this.props.history.push("sponsored-logos/create")
                    }
                  >
                    Create
                  </Button>
                </CardHeader>
                <CardBody>
                  <ImageList variant="masonry" cols={3} gap={8}>
                    {this.state.videos.length !== 0 &&
                      this.state.videos.map((item, key) => (
                        <ImageListItem key={key}>
                          {/*  maybe just use native video  */}
                          <Vimeo
                            onError={(e) => console.log(e)}
                            controls={true}
                            video={item.acf?.webinar_recording_video}
                          />
                        </ImageListItem>
                      ))}
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

const mapStateToProps = (state) => {
  return {
    rcp_url: state.rcp_url,
    user: state.user,
  };
};

const mapDispatchToProps = { setUserLoginDetails };

export default connect(mapStateToProps, mapDispatchToProps)(Videos);
