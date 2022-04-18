import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

import { Switch } from "@material-ui/core";

//Stripe
import { ElementsConsumer } from "@stripe/react-stripe-js";

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
  FormGroup,
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
      enable_payment: false,
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
      formData.append("price", membership.recurring_amount);
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
          name: membership.customer_name,
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
  submit_renew_membership() {
    if (this.state.enable_payment) {
      const transaction = this.handlePayment();
      this.addPayment(this.state.membership, transaction)
        .then((res) => {
          if (res.status !== 200) return Promise.reject(res);
          return res.json();
        })
        .then((data_payment) => {
          const { errors } = data_payment;
          if (errors) return Promise.reject(errors);
          return this.renew_membership(this.state.membership);
        })
        .catch((e) => console.error(e));
    } else {
      this.renew_membership(this.state.membership)
        .then((res) => {
          if (res.status !== 200) return Promise.reject(res);
          return res.json();
        })
        .then((data) => {
          const { errors } = data;
          if (errors) return Promise.reject(errors);
          return data;
        })
        .catch((e) => console.error(e));
    }
  }

  renew_membership(membership) {
    return fetch(
      this.props.rcp_url.proxy_domain +
        this.props.rcp_url.base_url +
        "memberships/" +
        this.state.membership.id +
        "/renew",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.user.token,
        },
        body: JSON.stringify({
          id: membership.id,
          status: membership.status,
          expiration: membership.expiration,
        }),
      }
    );
  }

  addPayment(membership, transaction) {
    const args = {
      subscription: membership.name,
      object_id: membership.id,
      user_id: membership.user_id,
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

  render() {
    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="justify-content-between">
                    <h3 className="mb-0 ml-3">Renew Membership</h3>
                    <Button
                      disabled={this.state.membership === null}
                      className="mr-3"
                      onClick={this.submit_renew_membership.bind(this)}
                    >
                      Renew
                    </Button>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    {null !== this.state.membership &&
                      Object.keys(this.state.membership).map((key, index) => {
                        return (
                          <FormGroup key={index} row>
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
                                value={
                                  this.state.membership[key] === null
                                    ? ""
                                    : this.state.membership[key]
                                }
                              />
                            </Col>
                          </FormGroup>
                        );
                      })}
                    {null !== this.state.membership && (
                      <FormGroup row>
                        <Label sm={4} for="payment">
                          Pay with card.
                        </Label>
                        <Col md={6}>
                          <Switch
                            name="payment_enable"
                            onChange={(e) =>
                              this.setState({
                                enable_payment: e.target.checked,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                    )}
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

const injectedRenewMembership = (props) => (
  <ElementsConsumer>
    {(stripe, elements) => (
      <RenewMembership {...props} stripe={stripe} elements={elements} />
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
)(injectedRenewMembership);
