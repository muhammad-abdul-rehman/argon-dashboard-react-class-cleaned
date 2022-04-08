import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Label,
  Col,
  Input,
  Container,
  Row,
  UncontrolledTooltip,
  CardBody,
  Form,
  FormFeedback,
  FormGroup,
  InputGroup,
  InputGroupText,
} from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import { setMembershipLevels } from "features/levels/levelsSlice";
//Stripe
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";

class AddIndividualMembership extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "", // @todo add password validation.
      validate: {
        emailState: "",
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate() {
    if (null !== this.props.user.token) {
      this.fetchMembershipLevels(
        this.props.rcp_url.domain + this.props.rcp_url.base_url + "levels"
      );
    }
  }

  async fetchMembershipLevels(url) {
    const response = await fetch(url, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.user.token,
      },
    });
    const data = await response.json();
    this.props.setMembershipLevels(data); // state only accepts objects.
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
    const { stripe, elements } = this.props.stripe;
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const cardElement = elements.getElement("card");
    try {
      const res = await fetch(
        this.props.rcp_url.domain +
          "/wp-admin/admin-ajax.php?action=stripe_payment_intent"
      );
      const {
        data: { client_secret },
      } = await res.json();
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (paymentMethodReq.error) {
        return;
      }

      const { error } = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentMethodReq.paymentMethod.id,
      });

      if (error) {
        return;
      }
    } catch (err) {}
  }

  render() {
    const { email } = this.state;
    const cardElementOptions = {
      style: { base: {}, invalid: {} },
      hidePostalCode: true,
    }; // @todo for styling card element.
    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Memberships</h3>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.submitForm.bind(this)}>
                    <FormGroup row>
                      <Label for="first_name" sm={2}>
                        Name
                      </Label>
                      <Row style={{ flex: 2 }}>
                        <Col md={6}>
                          <Input
                            id="first_name"
                            name="first_name"
                            placeholder="First Name"
                            type="text"
                          />
                        </Col>
                        <Col md={6}>
                          <Input
                            id="first_name"
                            name="first_name"
                            placeholder="Last Name"
                            type="text"
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="email" sm={2}>
                        Email
                      </Label>
                      <Col style={{ paddingLeft: 0 }} md={6}>
                        <Input
                          id="email"
                          name="email"
                          placeholder="Email"
                          type="email"
                          valid={
                            this.state.validate.emailState === "has-success"
                          }
                          invalid={
                            this.state.validate.emailState === "has-danger"
                          }
                          value={email}
                          onChange={(e) => {
                            this.validateEmail(e);
                            this.handleChange(e);
                          }}
                        />
                        <FormFeedback>
                          Please use a valid email address.
                        </FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="password" sm={2}>
                        Password
                      </Label>
                      <Col style={{ paddingLeft: 0 }} md={6}>
                        <Input
                          id="password"
                          name="password"
                          placeholder="Password"
                          type="password"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="individual_membership" sm={4}>
                        Individual Membership
                      </Label>
                      <Col md={6}>
                        <Input defaultValue="" type="select">
                          <option disabled>Select a membership level.</option>
                          {this.props.levels.levels.length > 0 &&
                            this.props.levels.levels.map((item, key) => (
                              <option key={key} name={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md={12}>
                        <CardElement options={cardElementOptions} />
                      </Col>
                    </FormGroup>
                    <FormGroup check row>
                      <Col
                        sm={{
                          size: 10,
                        }}
                      >
                        <Button>Submit</Button>
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

const injectedCheckoutForm = (props) => (
  <ElementsConsumer>
    {(stripe, elements) => (
      <AddIndividualMembership {...props} stripe={stripe} elements={elements} />
    )}
  </ElementsConsumer>
);

const mapStateToProps = (state) => {
  return {
    rcp_url: state.rcp_url,
    user: state.user,
    levels: state.levels,
  };
};

const mapDispatchToProps = { setUserLoginDetails, setMembershipLevels };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectedCheckoutForm);
