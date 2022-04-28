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

class EditCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: null,
      roles: [],
      validate: {
        email: true,
      },
      form: {
        name: "",
        email_verification: "",
        address: "",
        address_two: "",
        county: "",
        country: "",
        workplace: "",
        reference_club: "",
        town: "",
        eircode: "",
        phone: "",
      },
      profileImageChanged: false,
    };

    this.current_customer_url =
      this.props.rcp_url.proxy_domain +
      this.props.rcp_url.base_url +
      "customers/" +
      this.props.match.params.id;

    this.update_customer_url =
      this.props.rcp_url.proxy_domain +
      this.props.rcp_url.base_url +
      "customers/update/" +
      this.props.match.params.id;
  }

  componentDidMount() {
    if (this.state.user === null && this.props.user.token !== null)
      this.fetchCustomer(this.current_customer_url);
  }

  componentDidUpdate({ user: prevUser }) {
    if (prevUser !== this.props.user && this.props.user.token !== null) {
      this.fetchCustomer(this.current_customer_url);
    }
  }

  fetchCustomer = async (url) => {
    const queryUrl = new URL(url);
    const params = {
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
      customer: data,
      form: {
        ...prevState.form,
        name: data?.name,
        email_verification: data?.email_verification,
        address: data?.address,
        address_two: data?.address_secondary,
        county: data?.county,
        country: data?.country,
        workplace: data?.workplace,
        reference_club: data?.reference_club,
        town: data?.town,
        eircode: data?.eircode,
        phone: data?.phone,
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

  updateCustomer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch(this.update_customer_url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + this.props.user.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((res) => res.json())
      .then((data) =>
        this.setState((prevState) => ({
          user: data,
          form: {
            ...prevState.form,
            name: data?.name,
            email_verification: data?.email_verification,
            address: data?.address,
            address_two: data?.address_secondary,
            county: data?.county,
            country: data?.country,
            workplace: data?.workplace,
            reference_club: data?.reference_club,
            town: data?.town,
            eircode: data?.eircode,
            phone: data?.phone,
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
                  <h3 className="mb-0">Customer</h3>
                </CardHeader>
                <CardBody>
                  <Form
                    name="update_customer"
                    id="update_customer"
                    onSubmit={this.updateCustomer}
                  >
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="Customer ID"
                          name="customer_id"
                          variant="outlined"
                          helperText={"You cannot change this."}
                          required
                          value={this.state.customer?.id || ""}
                          InputLabelProps={{
                            shrink: this.state.customer?.id !== undefined,
                          }}
                          disabled
                        />
                      </Col>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="User ID"
                          name="user_id"
                          variant="outlined"
                          helperText={"You cannot change this."}
                          required
                          value={this.state.customer?.user_id || ""}
                          InputLabelProps={{
                            shrink: this.state.customer?.user_id !== undefined,
                          }}
                          disabled
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col xs={6}>
                        <TextField
                          id="outlined-basic"
                          label="Name"
                          name="name"
                          variant="outlined"
                          required
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.name || ""}
                          InputLabelProps={{
                            shrink: this.state.customer?.name !== undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="Address"
                          name="address"
                          variant="outlined"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.address || ""}
                          InputLabelProps={{
                            shrink: this.state.customer?.address !== undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="Address Secondary"
                          name="address_two"
                          variant="outlined"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.address_two || ""}
                          InputLabelProps={{
                            shrink:
                              this.state.customer?.address_secondary !==
                              undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="County"
                          name="county"
                          variant="outlined"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.county || ""}
                          InputLabelProps={{
                            shrink: this.state.customer?.county !== undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="Country"
                          name="country"
                          variant="outlined"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.country || ""}
                          InputLabelProps={{
                            shrink: this.state.customer?.country !== undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="Workplace"
                          name="workplace"
                          variant="outlined"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.workplace || ""}
                          InputLabelProps={{
                            shrink:
                              this.state.customer?.workplace !== undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="Reference Club"
                          name="reference_club"
                          variant="outlined"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.reference_club || ""}
                          InputLabelProps={{
                            shrink:
                              this.state.customer?.reference_club !== undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="Town"
                          name="town"
                          variant="outlined"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.town || ""}
                          InputLabelProps={{
                            shrink: this.state.customer?.town !== undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="Eircode"
                          name="eircode"
                          variant="outlined"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.eircode || ""}
                          InputLabelProps={{
                            shrink: this.state.customer?.eircode !== undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="outlined-basic"
                          label="Phone"
                          name="phone"
                          variant="outlined"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.form?.phone || ""}
                          InputLabelProps={{
                            shrink: this.state.customer?.phone !== undefined,
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col xs={12}></Col>
                    </FormGroup>
                    <FormGroup>
                      <Col>
                        <Button variant="contained" type="submit">
                          Update User
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

const mapStateToProps = (state) => {
  return {
    rcp_url: state.rcp_url,
    user: state.user,
  };
};

const mapDispatchToProps = { setUserLoginDetails };

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomer);
