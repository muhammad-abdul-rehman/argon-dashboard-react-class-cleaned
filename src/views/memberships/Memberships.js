import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { FormControlLabel, IconButton } from "@material-ui/core";

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
        this.props.rcp_url.proxy_domain + this.props.rcp_url.auth_url + "token"
      );
    } else if (this.state.memberships?.length === 0) {
      this.fetchMemberships(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
          "memberships",
        this.props.user.token
      );
    }
  }

  componentDidUpdate({ user: prevUser }) {
    if (
      null !== this.props.user.token &&
      prevUser.token !== this.props.user.token &&
      this.state.memberships?.length === 0
    ) {
      this.fetchMemberships(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
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

  deleteMembership = async (url, id) => {
    const res = await fetch(url + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + this.props.user.token,
      },
    });
    if (res.status !== 200) return this.setState({ error: "error" });
    const data = await res.json();
    const { errors } = data;
    if (errors) return this.setState({ error: "error" });
    this.setState({
      memberships: this.state.memberships.filter((el) => el.id !== id),
    });
  };

  render() {
    const MatEdit = ({ index }) => {
      const handleEditClick = (e) => {
        // some action
        e.preventDefault();
        this.props.history.push(
          this.props.history.location.pathname + "/renew-membership/" + index
        );
      };
      const handleDeleteClick = (e) => {
        e.preventDefault();
        if (null !== this.props.user.token) {
          this.deleteMembership(
            this.props.rcp_url.proxy_domain +
              this.props.rcp_url.base_url +
              "memberships/delete/",
            index
          );
        }
      };

      return (
        <>
          <FormControlLabel
            control={
              <IconButton
                style={{ fontSize: "1rem" }}
                aria-label="edit membership"
                onClick={handleEditClick}
              >
                <i className="fa fa-pen" />
              </IconButton>
            }
          />
          <FormControlLabel
            control={
              <IconButton
                style={{ fontSize: "1rem" }}
                aria-label="delete membership"
                onClick={handleDeleteClick}
              >
                <i className="fa fa-trash" />
              </IconButton>
            }
          />
        </>
      );
    };
    const columns = [
      { field: "id", headerName: "ID", width: 90 },
      { field: "name", headerName: "Name", width: 180 },
      { field: "customer_name", headerName: "Customer Name", width: 180 },
      { field: "status", headerName: "Status", width: 180 },
      { field: "recurring", headerName: "Recurring", width: 180 },
      { field: "created", headerName: "Created", width: 180 },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        renderCell: (params) => {
          return (
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
            >
              <MatEdit index={params.row.id} />
            </div>
          );
        },
      },
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
                <DataGrid
                  loading={this.state.memberships.length === 0}
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
