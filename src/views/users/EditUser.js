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
import { LinearProgress, Avatar, Grid, TextField } from "@material-ui/core";

import MatEdit from "views/MatEdit";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      validate: {
        email: true,
      },
    };
  }

  componentDidMount() {
    if (this.state.user === null && this.props.user.token !== null)
      this.fetchUser(
        this.props.rcp_url.domain +
          this.props.rcp_url.base_wp_url +
          "users/" +
          this.props.match.params.id
      );
  }

  componentDidUpdate({ user: prevUser }) {
    if (prevUser !== this.props.user && this.props.user.token !== null) {
      this.fetchUser(
        this.props.rcp_url.domain +
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
    this.setState({ user: data });
  };

  handleChange = (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });
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
                      <Form>
                        <FormGroup row>
                          <Col xs={12}>
                            <TextField
                              id="outlined-basic"
                              label="Username"
                              name="username"
                              variant="outlined"
                              onChange={(e) => this.handleChange(e)}
                              helperText={"You cannot change this."}
                              required
                              value={this.state.user?.username}
                              InputLabelProps={{
                                shrink: this.state.user?.username,
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
                              value={this.state.user?.first_name}
                              InputLabelProps={{
                                shrink: this.state.user?.first_name,
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
                              value={this.state.user?.last_name}
                              InputLabelProps={{
                                shrink: this.state.user?.last_name,
                              }}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col xs={12}>
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
                              value={this.state.user?.email}
                              InputLabelProps={{
                                shrink: this.state.user?.email,
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </Form>
                    </Grid>
                    <Grid item xs={4}>
                      <img
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
