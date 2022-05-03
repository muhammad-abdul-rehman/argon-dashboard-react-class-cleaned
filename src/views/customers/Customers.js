import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";
import { DataGrid } from "@material-ui/data-grid";

// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Col,
  Input,
  Form,
  FormGroup,
} from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import MatEdit from "../MatEdit";
class Customers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberships: [],
      customers: [],
      page: 1,
      number: 5,
      toggle: false,
    };
  }
  componentDidMount() {
    if (null !== this.props.user.token && this.state.customers.length === 0) {
      this.fetchCustomers(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
          "customers",
        this.props.user.token
      );
    }
  }

  componentDidUpdate() {
    if (null !== this.props.user.token && this.state.customers.length === 0) {
      this.fetchCustomers(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
          "customers",
        this.props.user.token
      );
    }
  }

  fetchCustomers = async (url, token) => {
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
    this.setState({ customers: data });
  };

  toggleModal = () => {
    this.setState({ toggle: !this.state.toggle });
  };

  deleteCustomer = async (url, id) => {
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
      customers: this.state.customers.filter((el) => el.id !== id),
    });
  };

  render() {
    const columns = [
      { field: "id", headerName: "ID", width: 100 },
      { field: "user_id", headerName: "User ID", width: 180 },
      { field: "name", headerName: "Name", width: 180 },
      { field: "membership_id", headerName: "Membership Id", width: 180 },
      { field: "date", headerName: "Date", width: 180 },
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
              <MatEdit
                index={params.row.id}
                handleClick={() =>
                  this.props.history.push("customer/" + params.row.id)
                }
                handleDeleteClick={() => {
                  this.deleteCustomer(
                    this.props.rcp_url.proxy_domain +
                      this.props.rcp_url.base_url +
                      "customers/delete/",
                    params.row.id
                  );
                }}
              />
            </div>
          );
        },
      },
    ];

    const rows = this.state.customers.map((item, key) => {
      return {
        id: item.id,
        user_id: item.user_id,
        membership_id:
          item.memberships.length === 0 ? "No Memberhsip" : item.memberships[0],
        name: item.name,
        date: item.date_registered,
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
                  <h3 className="mb-0">Customers</h3>
                </CardHeader>
                <DataGrid
                  loading={this.state.customers.length === 0}
                  autoHeight
                  rows={rows}
                  columns={columns}
                  pagination
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
