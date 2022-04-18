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
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Col,
  Input,
  CardBody,
  Form,
  FormFeedback,
  FormGroup,
} from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import MatEdit from "./MatEdit";
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
        this.props.rcp_url.domain + this.props.rcp_url.base_url + "customers",
        this.props.user.token
      );
    }
  }

  componentDidUpdate() {
    if (null !== this.props.user.token && this.state.customers.length === 0) {
      this.fetchCustomers(
        this.props.rcp_url.domain + this.props.rcp_url.base_url + "customers",
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

  render() {
    if (this.state.customers.length === 0 && this.props.user.token !== null)
      this.fetchCustomers(
        this.props.rcp_url.domain + this.props.rcp_url.base_url + "customers",
        this.props.user.token
      );
    if (this.state.customers.length === 0 && this.props.user.token !== null)
      this.fetchCustomers(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
          "customers",
        this.props.user.token
      );

    const columns = [
      { field: "id", headerName: "ID", width: 90 },
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
              <MatEdit index={params.row.id} handleClick={this.toggleModal} />
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
        <Modal isOpen={this.state.toggle} toggle={this.toggleModal}>
          <ModalHeader>Edit Customer</ModalHeader>
          <ModalBody>
            <Form onSubmit={() => {}}>
              <FormGroup row>
                <Label sm={4} for="user_id">
                  User Id
                </Label>
                <Col md={6}>
                  <Input name="user_id" type="text" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="membership_id">
                  Membership Id
                </Label>
                <Col md={6}>
                  <Input required name="membership_id" type="text" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="number">
                  Number
                </Label>
                <Col md={6}>
                  <Input required name="number" type="text" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="subscription">
                  Subscription
                </Label>
                <Col md={6}>
                  <Input required name="subscription" type="text" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="date">
                  Date
                </Label>
                <Col md={6}>
                  <Input required name="date" type="text" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="gateway">
                  Gateway
                </Label>
                <Col md={6}>
                  <Input required name="gateway" type="text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="workplace">
                  Work Place
                </Label>
                <Col md={6}>
                  <Input required name="workplace" type="text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="reference_club">
                  Reference Club
                </Label>
                <Col md={6}>
                  <Input required name="reference_club" type="text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="adress_one">
                  Adress One
                </Label>
                <Col md={6}>
                  <Input required name="adress_one" type="text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="adress_two">
                  Adress Two
                </Label>
                <Col md={6}>
                  <Input required name="adress_two" type="text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="town">
                  Town
                </Label>
                <Col md={6}>
                  <Input required name="town" type="text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="county">
                  County
                </Label>
                <Col md={6}>
                  <Input required name="county" type="text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="eircode">
                  Eircode
                </Label>
                <Col md={6}>
                  <Input required name="eircode" type="text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="country">
                  Country
                </Label>
                <Col md={6}>
                  <Input required name="country" type="text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="phone">
                  Phone
                </Label>
                <Col md={6}>
                  <Input required name="phone" type="text" />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => {}}>Submit</Button>
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

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
