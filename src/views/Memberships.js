import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import {
  Badge,
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
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";

class Memberships extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberships: [],
      page: 1,
      number: 20,
    };
  }

  componentDidMount() {
    this.fetchToken(
      this.props.rcp_url.domain + this.props.rcp_url.auth_url + "token"
    );
  }

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
    this.fetchMemberships(
      this.props.rcp_url.domain + this.props.rcp_url.base_url + "memberships",
      this.props.user.token
    );
  }

  fetchMemberships = async (url, token) => {
    const urlQuery = new URL(url);
    const paramsOptions = {
      number: this.state.number,
      offset: (this.state.page - 1) * this.state.number,
      orderby: "ID",
      order: "ASC",
    };
    for (let key in paramsOptions) {
      urlQuery.searchParams.set(key, paramsOptions[key]);
    }

    const res = await fetch(urlQuery, {
      mode: "cors",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    this.setState({ memberships: data });
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
                  <h3 className="mb-0">Memberships</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Status</th>
                      <th scope="col">Recurring</th>
                      <th scope="col">Created</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.memberships.map((item, key) => (
                      <tr key={key}>
                        <th>{item.id}</th>
                        <td>{item.membership_name}</td>
                        <td>{item.customer_name}</td>
                        <td>{item.status}</td>
                        <td>{item.recurring_amount}</td>
                        <td>{item.created_date}</td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                Action
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                Another action
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                Something else here
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* Add Pagination */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Memberships);
