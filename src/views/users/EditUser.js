import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

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
} from "reactstrap";

//MUI
import { DataGrid } from "@material-ui/data-grid";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {
  LinearProgress,
  Avatar,
  Grid,
  TextField,
  Chip,
  Button,
  ButtonGroup,
} from "@material-ui/core";

import MatEdit from "views/MatEdit";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      roles: [],
      validate: {
        email: true,
      },
      form: {
        first_name: "",
        last_name: "",
        email: "",
      },
      profileImageChanged: false,
    };

    this.current_user_url =
      this.props.rcp_url.proxy_domain +
      this.props.rcp_url.base_wp_url +
      "users/" +
      this.props.match.params.id;
  }

  componentDidMount() {
    if (this.state.user === null && this.props.user.token !== null)
      this.fetchUser(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "users/" +
          this.props.match.params.id
      );
  }

  componentDidUpdate({ user: prevUser }) {
    if (prevUser !== this.props.user && this.props.user.token !== null) {
      this.fetchUser(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "users/" +
          this.props.match.params.id
      );
    }
  }

  fetchUser = async (url) => {
    const queryUrl = new URL(url);
    const params = {
      context: "edit",
      acf_format: "standard",
    };
    for (let key in params) {
      queryUrl.searchParams.set(key, params[key]);
    }
    const res = await fetch(queryUrl, {
      headers: {
        Authorization: "Bearer " + this.props.user.token,
      },
    });
    const data = await res.json();
    this.setState((prevState) => ({
      user: data,
      form: {
        ...prevState.form,
        first_name: data?.first_name,
        last_name: data?.last_name,
        email: data?.email,
      },
    }));
  };

  handleChange = (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: value,
      },
    }));
  };

  validateEmail(e) {
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    const { validate } = this.state;

    if (emailRegex.test(e.target.value)) {
      validate.email = true;
    } else {
      validate.email = false;
    }

    this.setState({ validate });
  }

  /**
   *
   * @param {*} file
   */
  changeProfileImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", this.state.user?.name);
    fetch(
      this.props.rcp_url.proxy_domain +
        this.props.rcp_url.base_wp_url +
        "media",
      {
        method: "POST",
        headers: {
          //when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
          //so there's no need to set it here
          Authorization: "Bearer " + this.props.user.token,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const { id: image_id } = data;
        return this.addACFField(this.current_user_url, image_id);
        // const input = {
        //   profile_image: data.source_url,
        // };
        //send image url to backend
      })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        this.refs.profile_image.setAttribute(
          "src",
          this.state.user?.acf?.user_profile
            ? this.state.user?.acf?.user_profile
            : this.state.user?.avatar_urls[
                Object.keys(this.state.user?.avatar_urls)[0]
              ]
        );
        console.log(err);
      });
  }

  addACFField = async (url, image_id) => {
    return fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + this.props.user.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acf: {
          user_profile: image_id,
        },
      }),
    });
  };

  updateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    for (var [key, value] of formData.entries()) {
      if (this.state.user[key] === value) formData.delete(key);
    }
    fetch(
      this.props.rcp_url.proxy_domain +
        this.props.rcp_url.base_wp_url +
        "users/" +
        this.props.match.params.id,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.props.user.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      }
    )
      .then((res) => res.json())
      .then((data) =>
        this.setState((prevState) => ({
          user: data,
          form: {
            ...prevState.form,
            first_name: data?.first_name,
            last_name: data?.last_name,
            email: data?.email,
          },
        }))
      )
      .catch((err) => console.error(err));
  };

  render() {
    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">User</h3>
                </CardHeader>
                <CardBody>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Form
                        name="update_user"
                        id="update_user"
                        onSubmit={this.updateUser}
                      >
                        <FormGroup row>
                          <Col>
                            <TextField
                              id="outlined-basic"
                              label="Username"
                              name="username"
                              variant="outlined"
                              helperText={"You cannot change this."}
                              required
                              value={this.state.user?.username || ""}
                              InputLabelProps={{
                                shrink: this.state.user?.username !== undefined,
                              }}
                              disabled
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col xs={6}>
                            <TextField
                              id="outlined-basic"
                              label="First Name"
                              name="first_name"
                              variant="outlined"
                              required
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.form?.first_name || ""}
                              InputLabelProps={{
                                shrink:
                                  this.state.user?.first_name !== undefined,
                              }}
                            />
                          </Col>
                          <Col xs={6}>
                            <TextField
                              id="outlined-basic"
                              label="Last Name"
                              name="last_name"
                              variant="outlined"
                              required
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.form?.last_name || ""}
                              InputLabelProps={{
                                shrink:
                                  this.state.user?.last_name !== undefined,
                              }}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <TextField
                              className="w-80"
                              id="outlined-basic"
                              label="Email"
                              type="email"
                              name="email"
                              variant="outlined"
                              onChange={(e) => {
                                this.handleChange(e);
                                this.validateEmail(e);
                              }}
                              helperText={
                                !this.state.validate.email &&
                                "Email is not valid."
                              }
                              error={!this.state.validate.email}
                              required
                              value={this.state.form?.email || ""}
                              InputLabelProps={{
                                shrink: this.state.user?.email !== undefined,
                              }}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col xs={12}>
                            {this.state.user?.roles.map((item, key) => (
                              <Chip
                                label={item
                                  .split("_")
                                  .map((el) => el.charAt(0) + el.slice(1))
                                  .join(" ")}
                                key={key}
                              />
                            ))}
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col>
                            <Button variant="contained" type="submit">
                              Update User
                            </Button>
                          </Col>
                        </FormGroup>
                      </Form>
                    </Grid>
                    <Grid item xs={4}>
                      <div
                        className="position-relative"
                        style={{ width: "max-content" }}
                      >
                        {this.state.user !== null && (
                          <ButtonGroup
                            variant="contained"
                            className="position-absolute top-0 right-0"
                          >
                            {this.state.profileImageChanged ? (
                              <>
                                <Button
                                  onClick={() => {
                                    this.refs.profile_image_input.value = null;
                                    this.refs.profile_image.setAttribute(
                                      "src",
                                      this.state.user?.acf?.user_profile
                                        ? this.state.user?.acf?.user_profile
                                        : this.state.user?.avatar_urls[
                                            Object.keys(
                                              this.state.user?.avatar_urls
                                            )[0]
                                          ]
                                    );
                                    this.setState({
                                      profileImageChanged: false,
                                    });
                                  }}
                                  style={{ minWidth: "unset" }}
                                  className="mr-0 p-2 text-white bg-red"
                                >
                                  <i className="fa fa-trash" />
                                </Button>
                                <Button
                                  onClick={() => {
                                    this.changeProfileImage(
                                      this.refs.profile_image_input.files[0]
                                    );
                                    this.setState({
                                      profileImageChanged: false,
                                    });
                                  }}
                                  style={{ minWidth: "unset" }}
                                  className="mr-0 p-2 bg-green text-white"
                                >
                                  <i className="fa fa-check" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={() =>
                                  this.refs.profile_image_input.click()
                                }
                                className=" mr-0 p-2"
                              >
                                <i className="fa fa-pen" />
                              </Button>
                            )}
                          </ButtonGroup>
                        )}
                        <img
                          ref="profile_image"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                          src={
                            this.state.user?.acf?.user_profile
                              ? this.state.user?.acf?.user_profile
                              : this.state.user?.avatar_urls[
                                  Object.keys(this.state.user?.avatar_urls)[0]
                                ]
                          }
                          alt={this.state.user?.name}
                          className="rounded-circle"
                        />
                      </div>
                      <Form ref="form_profile_image">
                        <input
                          ref="profile_image_input"
                          type="file"
                          name="profile-image"
                          hidden
                          onChange={(e) => {
                            this.refs.profile_image.setAttribute(
                              "src",
                              window.URL.createObjectURL(e.target.files[0])
                            );
                            this.setState({ profileImageChanged: true });
                          }}
                        />
                      </Form>
                    </Grid>
                  </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(Users);
