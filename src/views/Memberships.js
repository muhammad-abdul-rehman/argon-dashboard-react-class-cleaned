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
      memberships: [],
      page: 1,
      number: 5,
    };
  }

  componentDidMount() {
    if (null === this.props.user.token) {
      this.fetchToken(
        this.props.rcp_url.domain + this.props.rcp_url.auth_url + "token"
      );
    }
  }

  componentDidUpdate({ user: prevUser }) {
    if (
      null !== this.props.user.token &&
      prevUser.token !== this.props.user.token &&
      this.state.memberships?.length === 0
    ) {
      this.fetchMembershipLevels(
        this.props.rcp_url.domain +
          this.props.rcp_url.proxy_url +
          "memberships",
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
        username: process.env.REACT_APP_ATPI_USERNAME,
        password: process.env.REACT_APP_ATPI_PASSWORD,
      }),
    });

    const data = await response.json();
    this.props.setUserLoginDetails(data);
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
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    this.setState({ memberships: data });
  };

  render() {
    const columns = [
      { field: "id", headerName: "ID", width: 180 },
      { field: "name", headerName: "Name", width: 180 },
      { field: "customer_name", headerName: "Customer Name", width: 180 },
      { field: "status", headerName: "Status", width: 180 },
      { field: "recurring", headerName: "Recurring", width: 180 },
      { field: "created", headerName: "Created", width: 180 },
    ];

    const rows = this.state.memberships.map((item, key) => {
      return {
        id: item.id,
        name: item.membership_name,
        customer_name: item.customer_name,
        status: item.status,
        recurring: item.recurring_amount,
        created: item.created_date,
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
                  <h3 className="mb-0">Memberships</h3>
                </CardHeader>
                <DataGrid autoHeight rows={rows} columns={columns} pagination />
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
