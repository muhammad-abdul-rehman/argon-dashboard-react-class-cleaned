import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { Container } from "reactstrap";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";

//Stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("" + process.env.REACT_APP_PUBLISHABLE_KEY);

class Admin extends React.Component {
  componentDidMount() {
    this.fetchToken(
      this.props.rcp_url.proxy_domain + this.props.rcp_url.auth_url + "token"
    );
  }
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  /**
   * Fetching token url from auth endpoint
   * @param {string} token_url
   */
  async fetchToken(token_url) {
    const response = await fetch(token_url, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: process.env.REACT_APP_ATPI_USERNAME, // Hardcoded for now.
        password: process.env.REACT_APP_ATPI_PASSWORD, // Hardcoded for now.
      }),
    });
    const data = await response.json();
    this.props.setUserLoginDetails(data);
  }

  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        if (prop.children !== undefined) {
          return (
            <Switch key={key}>
              <Route
                path={prop.layout + prop.path}
                component={prop.component}
                exact
              />
              {prop.children.map((item, key) => (
                <Route
                  path={item.layout + item.path}
                  component={item.component}
                  key={key}
                  exact
                />
              ))}
            </Switch>
          );
        } else {
          return (
            <Route
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
              exact
            />
          );
        }
      } else {
        return null;
      }
    });
  };
  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/argon-react.png"),
            imgAlt: "...",
          }}
        />
        <div className="main-content mb-5" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            <Elements stripe={stripePromise}>{this.getRoutes(routes)}</Elements>
            {/* <Redirect from="*" to="/admin/index" /> */}
          </Switch>
          {/* <Container fluid>
            <AdminFooter />
          </Container> */}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
