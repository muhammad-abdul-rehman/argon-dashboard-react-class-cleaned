import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";
import { DataGrid } from "@material-ui/data-grid";

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
      payments: [],
      page: 1,
      number: 5,
    };
  }

  componentDidMount() {
    if (null === this.props.user.token) {
      this.fetchToken(
        this.props.rcp_url.proxy_domain + this.props.rcp_url.auth_url + "token"
      );
    } else if (this.state.payments?.length === 0) {
      this.fetchPayment(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
          "payments",
        this.props.user.token
      );
    }
  }

  componentDidUpdate({ user: prevUser }) {
    if (
      null !== this.props.user.token &&
      prevUser.token !== this.props.user.token &&
      this.state.payments?.length === 0
    ) {
      this.fetchPayment(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.proxy_url +
          "payments",
        this.props.user.token
      );
    }
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
  }

  fetchPayment = async (url, token) => {
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
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    this.setState({ payments: data });
  };

  render() {
    const columns = [
      { field: "id", headerName: "ID", width: 100 },
      { field: "customer_id", headerName: "Customer ID", width: 180 },
      { field: "status", headerName: "Status", width: 180 },
      { field: "amount", headerName: "Amount", width: 180 },
      { field: "subscription", headerName: "Subscription", width: 180 },
      { field: "created", headerName: "Created", width: 180 },
    ];

    console.log(this.state.payments);

    const rows = this.state.payments.map((item, key) => {
      return {
        id: item.id,
        name: item.membership_name,
        customer_id: item.customer_id,
        status: item.status,
        amount: item.amount,
        subscription: item.subscription,
        created: item.date,
      };
    });

    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Payments</h3>
                </CardHeader>
                {/*}
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
                      </tr>
                    ))}
                  </tbody>
                </Table>
                    */}
                <DataGrid
                  loading={this.state.payments.length === 0}
                  autoHeight
                  rows={rows}
                  columns={columns}
                  pagination
                />
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
