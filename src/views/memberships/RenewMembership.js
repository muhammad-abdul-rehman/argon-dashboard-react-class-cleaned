import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

import { Switch } from "@material-ui/core";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  Label,
  Col,
  Input,
  Container,
  Row,
  CardBody,
  Form,
  FormFeedback,
  FormGroup,
  Table,
  Progress,
} from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import { setMembershipLevels } from "features/levels/levelsSlice";

class RenewMembership extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      membership: null,
      validate: {
        emailState: "",
      },
      error_message: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    if (null === this.state.membership && null !== this.props.user.token) {
      const data = await this.fetchMembership(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
          "memberships",
        this.props.match.params.id
      );
      this.setState({ membership: data });
    }
  }

  async componentDidUpdate({ user: prevUser }) {
    if (
      null !== this.props.user.token &&
      prevUser.token !== this.props.user.token &&
      null === this.state.membership
    ) {
      const data = await this.fetchMembership(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
          "memberships",
        this.props.match.params.id
      );

      this.setState({ membership: data });
    }
  }

  async fetchMembership(url, id) {
    const urlQuery = new URL(url);
    const paramsOptions = {
      id: id,
    };
    for (let key in paramsOptions) {
      urlQuery.searchParams.set(key, paramsOptions[key]);
    }

    const response = await fetch(urlQuery, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.user.token,
      },
    });
    const data = await response.json();
    return data;
  }

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
      validate.emailState = "has-success";
    } else {
      validate.emailState = "has-danger";
    }

    this.setState({ validate });
  }

  /**
   * Submit the form.
   */
  async submitForm(event) {
    event.persist();
    event.preventDefault();
  }

  render() {
    const { email, country, region } = this.state;

    return (
      <>
        <OnlyHeader />

        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Renew Membership</h3>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.submitForm.bind(this)}>
                    {null !== this.state.membership &&
                      Object.keys(this.state.membership).map((key, index) => {
                        return (
                          <FormGroup row>
                            <Label sm={3} for={key}>
                              {key
                                .split("_")
                                .map((el) =>
                                  el === "id"
                                    ? el.toUpperCase()
                                    : el.charAt(0).toUpperCase() + el.slice(1)
                                )
                                .join(" ")}
                            </Label>
                            <Col md={6}>
                              <Input
                                disabled
                                name={key}
                                value={this.state.membership[key]}
                              />
                            </Col>
                          </FormGroup>
                        );
                      })}
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
    levels: state.levels,
  };
};

const mapDispatchToProps = { setUserLoginDetails, setMembershipLevels };

export default connect(mapStateToProps, mapDispatchToProps)(RenewMembership);
