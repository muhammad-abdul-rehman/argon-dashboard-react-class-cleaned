import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

//@mui
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
} from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import { setMembershipLevels } from "features/levels/levelsSlice";
//Stripe
import {
  CardElement,
  ElementsConsumer,
  PaymentElement,
} from "@stripe/react-stripe-js";

//Country Selector
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";

class AddClubMembership extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "", // @todo add password validation.
      validate: {
        emailState: "",
      },
      country: "",
      region: "",
      error_message: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(
    { user: prevUser },
    { membership_level: prevMembershipLevel }
  ) {
    if (
      null !== this.props.user.token &&
      prevUser.token !== this.props.user.token &&
      this.props.levels?.levels?.length === 0
    ) {
      this.fetchMembershipLevels(
        this.props.rcp_url.proxy_domain + this.props.rcp_url.base_url + "levels"
      );
    }

    if (
      undefined !== this.state.membership_level &&
      prevMembershipLevel !== this.state.membership_level
    ) {
      const membership = this.props.levels.levels.find(
        (el) => el.id === parseInt(this.state.membership_level)
      );
      this.setState({ selectedMembership: membership });
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

  selectCountry(val) {
    this.setState({ country: val });
  }

  selectRegion(val) {
    this.setState({ region: val });
  }
  /**
   * Handle Payment
   * @param {*} event
   */
  async handlePayment(event) {
    const { stripe, elements } = this.props.stripe;
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const cardElement = elements.getElement("card");
    try {
      const membership = this.props.levels.levels.find(
        (el) => el.id === parseInt(event.target.membership_level.value)
      );
      const formData = new FormData();
      formData.append("action", "stripe_payment_intent");
      formData.append("price", membership.price);
      formData.append("currency_symbol", membership.currency_symbol);
      const res = await fetch(
        this.props.rcp_url.proxy_domain +
          "/wp-admin/admin-ajax.php?action=stripe_payment_intent",
        {
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      const {
        data: { client_secret },
      } = await res.json();
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${event.target.first_name.value} ${event.target.last_name.value}`,
          email: event.target.email.value,
          address: {
            address: event.target.address.value,
            country: this.props.country,
            state: this.props.region,
          },
        },
      });

      if (paymentMethodReq.error) {
        return;
      }

      const { error, ...transaction } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: paymentMethodReq.paymentMethod.id,
        }
      );

      if (error) {
        return;
      }

      return transaction;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Submit the form.
   */
  async submitForm(event) {
    event.persist();
    event.preventDefault();
    const user_args = {
      first_name: event.target.first_name.value,
      last_name: event.target.last_name.value,
      user_email: event.target.email.value,
      user_pass: event.target.password.value,
    };

    this.onSuccessfullCheckout(
      event,
      user_args,
      this.state.selectedMembership,
      event.target.club_name.value
    );
  }

  onSuccessfullCheckout(event, user_args, membership, club_name) {
    this.addCustomer(user_args)
      .then((res) => {
        if (res.status !== 200) return Promise.reject(res);
        return res.json();
      })
      .then((data) => {
        const { errors } = data;
        if (errors) return Promise.reject(errors);
        return this.addMembership(data.customer_id, membership, club_name);
        // const { errors } = data;
        // if (errors) return Promise.reject(errors);
        // return this.addPaymentAndMembership(
        //   data,
        //   membership,
        //   transaction,
        //   club_name
        // );
      })
      .then((res) => {
        if (res.status !== 200) return Promise.reject(res);
        return res.json();
      })
      .then((data_memership) => {
        const { errors, user_id, object_id } = data_memership;
        if (errors) return Promise.reject(errors);
        if (this.state.enable_payment) {
          const transaction = this.handlePayment(event);
          return this.addPayment(user_id, membership, transaction);
        }
        return Promise.resolve(data_memership);
      })
      .then((res) => {
        if (res.status !== 200) return Promise.reject(res);
        return res.json();
      })
      .then((data_payment) => {
        const { errors } = data_payment;
        if (errors) return Promise.reject(errors);
        return data_payment;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  addCustomer(user_args) {
    return fetch(
      this.props.rcp_url.proxy_domain +
        this.props.rcp_url.base_url +
        "customers/new",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.user.token,
        },
        body: JSON.stringify({ user_args: user_args }),
      }
    );
  }

  // addPaymentAndMembership(data, membership, transaction, club_name) {
  //   this.addPayment(data.user_id, membership, transaction)
  //     .then((res) => {
  //       if (res.status !== 200) return Promise.reject(res);
  //       return res.json();
  //     })
  //     .then((data_payment) => {
  //       const { errors } = data_payment;
  //       if (errors) return Promise.reject(errors);
  //       return this.addMembership(data.customer_id, membership, club_name);
  //     })
  //     .then((res) => {
  //       if (res.status !== 200) return Promise.reject(res);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       const { errors } = data;
  //       if (errors) return Promise.reject(errors);
  //       console.log(data);
  //       return data;
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }

  addPayment(user_id, membership, transaction) {
    const args = {
      subscription: membership.name,
      object_id: membership.id,
      user_id: user_id,
      amount: membership.price,
      transaction_id: transaction.id,
      status: transaction.status,
    };

    return fetch(
      this.props.rcp_url.proxy_domain +
        this.props.rcp_url.base_url +
        "payments/new",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.user.token,
        },
        body: JSON.stringify(args),
      }
    );
  }

  addMembership(customer_id, membership, club_name) {
    return fetch(
      this.props.rcp_url.proxy_domain +
        this.props.rcp_url.base_url +
        "memberships/new",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.user.token,
        },
        body: JSON.stringify({
          customer_id: customer_id,
          object_id: membership.id,
          club_name: club_name,
        }),
      }
    );
  }

  render() {
    const { email, country, region } = this.state;
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
                  <h3 className="mb-0">Add Club Membership</h3>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.submitForm.bind(this)}>
                    <FormGroup row>
                      <Label sm={3}>Name</Label>
                      <Row style={{ flex: 2, paddingLeft: "1em" }}>
                        <Col md={6}>
                          <Input
                            id="first_name"
                            name="first_name"
                            placeholder="First Name"
                            type="text"
                            onChange={(e) => {
                              this.handleChange(e);
                            }}
                            required
                          />
                        </Col>
                        <Col className="mt-sm-2 mt-md-0" md={6}>
                          <Input
                            id="last_name"
                            name="last_name"
                            placeholder="Last Name"
                            type="text"
                            onChange={(e) => {
                              this.handleChange(e);
                            }}
                            required
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="email" sm={3}>
                        Email
                      </Label>
                      <Col md={6}>
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
                          required
                        />
                        <FormFeedback>
                          Please use a valid email address.
                        </FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="password" sm={3}>
                        Password
                      </Label>
                      <Col md={6}>
                        <Input
                          id="password"
                          name="password"
                          placeholder="Password"
                          type="password"
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4}>Membership Type</Label>
                      <Col md={6}>
                        <Input
                          name="membership_level"
                          defaultValue=""
                          type="select"
                          onChange={(e) => {
                            this.handleChange(e);
                          }}
                          required
                        >
                          {this.props.levels.levels.length > 0 &&
                            this.props.levels.levels
                              .filter((el) => el.level === 3)
                              .map((item, key) => (
                                <option selected key={key} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4} for="club_name">
                        Club Name
                      </Label>
                      <Col md={6}>
                        <Input name="club_name" type="text" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4} for="workplace">
                        Workplace
                      </Label>
                      <Col md={6}>
                        <Input name="workplace" type="text" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4} for="address">
                        Address
                      </Label>
                      <Col md={6}>
                        <Input required name="address" type="text" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4} for="address_secondary">
                        Address 2
                      </Label>
                      <Col md={6}>
                        <Input required name="address_secondary" type="text" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4} for="country">
                        Country
                      </Label>
                      <Col md={6}>
                        <CountryDropdown
                          className="form-control"
                          name="country"
                          value={country}
                          onChange={(val) => this.selectCountry(val)}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4} for="region">
                        Region
                      </Label>
                      <Col md={6}>
                        <RegionDropdown
                          className="form-control"
                          name="region"
                          country={country}
                          value={region}
                          onChange={(val) => this.selectRegion(val)}
                        />
                      </Col>
                    </FormGroup>
                    {undefined !== this.state.selectedMembership && (
                      <Table bordered striped className="mb-2">
                        <thead>
                          <tr>
                            <th className="border-right-0">
                              <h2>Memberhsip Details</h2>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="font-weight-bold">Name</td>
                            <td>{this.state.selectedMembership.name}</td>
                          </tr>
                          <tr>
                            <td className="font-weight-bold">Duration</td>
                            <td>
                              {`${this.state.selectedMembership.duration} ${this.state.selectedMembership.duration_unit}`}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-weight-bold">Price</td>
                            <td>
                              {`${this.state.selectedMembership.price} ${this.state.selectedMembership.currency_symbol}`}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    )}
                    <FormGroup row>
                      <Label sm={4} for="payment">
                        Pay with card.
                      </Label>
                      <Col md={6}>
                        <Switch
                          name="payment_enable"
                          onChange={(e) =>
                            this.setState({ enable_payment: e.target.checked })
                          }
                        />
                      </Col>
                    </FormGroup>
                    {this.state.selectedMembership?.price !== 0 &&
                      this.state.enable_payment === true && (
                        <FormGroup row>
                          <Col md={12}>
                            <CardElement options={cardElementOptions} />
                          </Col>
                        </FormGroup>
                      )}
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

const injectedClubCheckoutForm = (props) => (
  <ElementsConsumer>
    {(stripe, elements) => (
      <AddClubMembership {...props} stripe={stripe} elements={elements} />
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
)(injectedClubCheckoutForm);
