import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {
  Button,
  Divider,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  List,
  ListItem,
  Grid,
  IconButton,
  CircularProgress,
  Grow,
} from "@material-ui/core";

class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      media: [],
      selectedMedia: null,
      uploadFiles: [],
      uploading: false,
      uploadAreaOpen: false,
    };
    this.handleDrop = this.handleDrop.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    if (this.state.media.length === 0)
      this.fetchMedia(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "media"
      );
  }

  componentDidUpdate() {}

  fetchMedia = async (url) => {
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
    this.setState({ media: data });
  };

  openImage(e, id) {
    e.preventDefault();
    this.setState({
      selectedMedia: this.state.media.filter((el) => el.id === id).pop(),
    });
  }

  handleFiles(files) {
    if (files !== undefined && typeof this.props.rcp_url === "object") {
      Object.values(files).forEach(this.uploadFile);
    } else {
      this.refs.dropArea !== undefined &&
        this.refs.dropArea.classList.remove("highlight");
    }
  }

  uploadFile(file) {
    this.setState({ uploadFiles: [...this.state.uploadFiles, file] });
    let formData = new FormData();

    formData.append("file", file);
    formData.append("title", file.name);

    fetch(
      this.props.rcp_url.proxy_domain +
        this.props.rcp_url.base_wp_url +
        "media",
      {
        method: "post",
        headers: {
          Authorization: "Bearer " + this.props.user.token,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState((prevState) => {
          return {
            media: [data, ...prevState.media],
            uploading: false,
            uploadFiles: [],
          };
        });
      })
      .catch((err) => {
        this.refs.dropArea.classList.remove("highlight");
        console.log(err);
        this.setState({ uploading: false, uploadFiles: [] });
      });
  }

  highlight(e) {
    e.preventDefault();
    e.stopPropagation();
    this.refs.dropArea.classList.add("highlight");
  }

  unhighlight(e) {
    e.preventDefault();
    e.stopPropagation();
    this.refs.dropArea.classList.remove("highlight");
  }

  handleDrop(e) {
    this.setState({ uploading: true });
    e.persist();
    e.preventDefault();
    e.stopPropagation();
    this.handleFiles(e.dataTransfer.files);
  }

  render() {
    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0 d-flex justify-content-between pl-3 pr-3">
                  <h3 className="mb-0">Media</h3>
                  <Button
                    variant="contained"
                    onClick={() =>
                      this.setState({
                        uploadAreaOpen: !this.state.uploadAreaOpen,
                      })
                    }
                  >
                    {this.state.uploadAreaOpen ? "Close" : "Upload"}
                  </Button>
                </CardHeader>
                <CardBody>
                  <div
                    style={{
                      display: this.state.uploadAreaOpen ? "block" : "none",
                      transform: "scaleY(1)",
                      transition: "all 0.5s ease-out",
                    }}
                    ref={this.state.uploadAreaOpen && "dropArea"}
                    id="drop-area"
                    onDragEnter={(e) => this.highlight(e)}
                    onDragOver={(e) => this.highlight(e)}
                    onDragLeave={(e) => this.unhighlight(e)}
                    onDrop={this.handleDrop}
                  >
                    <form className="my-form">
                      <p>
                        Upload (multiple files -- will be done) single file with
                        the file dialog or by dragging and dropping images onto
                        the dashed region
                      </p>
                      <input
                        type="file"
                        id="fileElem"
                        ref="fileInput"
                        // multiple --- add after loading icon issue resolve
                        accept="image/*"
                        onChange={this.handleFiles(this.files)}
                      />
                      <label className="button" htmlFor="fileElem">
                        Select some files
                      </label>
                    </form>
                    <Row>
                      <ImageList gap={8}>
                        {this.state.uploadFiles.length !== 0 &&
                          this.state.uploadFiles.map((item, key) => (
                            <ImageListItem
                              className="position-relative"
                              key={key}
                            >
                              {this.state.uploading && (
                                <CircularProgress
                                  className="position-absolute top-50 left-50"
                                  style={{
                                    top: "50%",
                                    left: "50%",
                                    zIndex: 2,
                                  }}
                                />
                              )}
                              <img
                                className="mw-100"
                                style={{ objectFit: "cover" }}
                                src={window.URL.createObjectURL(item)}
                              />
                            </ImageListItem>
                          ))}
                      </ImageList>
                    </Row>
                  </div>
                  <ImageList variant="masonry" cols={3} gap={8}>
                    {this.state.media.length !== 0 &&
                      this.state.media.map((item, key) => (
                        <ImageListItem key={key}>
                          <a
                            href="#"
                            className="position-absolute top-0 bottom-0 left-0 right-0"
                            style={{ zIndex: 2 }}
                            onClick={(e) => this.openImage(e, item.id)}
                          ></a>

                          <img
                            src={item.source_url}
                            alt={item.title.rendered}
                          />
                        </ImageListItem>
                      ))}
                  </ImageList>
                </CardBody>
                <Modal open={this.state.selectedMedia !== null}>
                  <>
                    {this.state.selectedMedia !== null && (
                      <div
                        className="position-absolute"
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "80%",
                          height: "80%",
                        }}
                      >
                        <Card className="h-100">
                          <CardHeader className="bg-white d-flex justify-content-between">
                            <h3 className="ml-3">
                              {this.state.selectedMedia.title.rendered}
                            </h3>
                            <IconButton
                              className="p-2 mr-3"
                              onClick={() =>
                                this.setState({ selectedMedia: null })
                              }
                              size="small"
                            >
                              <i
                                className="fa fa-plus"
                                style={{ transform: "rotate(45deg)" }}
                              />
                            </IconButton>
                          </CardHeader>
                          <CardBody
                            className="pl-1 pr-1 mh-100"
                            style={{ overflow: "hidden auto" }}
                          >
                            <Row
                              container
                              spacing={2}
                              className="h-100"
                              style={{ maxHeight: "80%" }}
                            >
                              <Col
                                sm={8}
                                xs={12}
                                className="h-100 d-flex justify-content-center"
                              >
                                <img
                                  className="mw-100 mh-100 h-100"
                                  style={{ objectFit: "contain" }}
                                  src={this.state.selectedMedia.source_url}
                                  alt={
                                    this.state.selectedMedia?.title?.rendered
                                  }
                                />
                              </Col>
                              <Col
                                item
                                sm={4}
                                xs={12}
                                style={{ maxHeight: "80%" }}
                              >
                                <List>
                                  <ListItem className="flex-wrap">
                                    Uploaded on:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia.modified}
                                    </span>
                                  </ListItem>
                                  <Divider component="li" />
                                  <ListItem className="flex-wrap">
                                    Uploaded by:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia._embedded
                                        ?.author.length !== 0 &&
                                        this.state.selectedMedia._embedded?.author.pop()
                                          ?.name}
                                    </span>
                                  </ListItem>
                                  <Divider component="li" />
                                  <ListItem className="flex-wrap">
                                    File Name:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia.title.rendered}
                                    </span>
                                  </ListItem>
                                  <Divider component="li" />
                                  <ListItem className="flex-wrap">
                                    File Type:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia.mime_type}
                                    </span>
                                  </ListItem>
                                  <Divider component="li" />
                                  <ListItem
                                    className="flex-wrap"
                                    disablePadding
                                  >
                                    Dimensions:
                                    <span
                                      className="ml-1 font-weight-600"
                                      style={{ color: "#525f7f" }}
                                    >
                                      {this.state.selectedMedia.media_details
                                        .width +
                                        " by " +
                                        this.state.selectedMedia.media_details
                                          .width +
                                        " pixels"}
                                    </span>
                                  </ListItem>
                                </List>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </div>
                    )}
                  </>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(Media);
