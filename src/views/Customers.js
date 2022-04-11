import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";
import { DataGrid } from '@material-ui/data-grid';

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
      customers:[],
      page: 1,
      number: 5,
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

  render() {
    console.log('Customers => ',this.state.customers);

    const columns = [
      { field: 'user_id', headerName: 'User Id', width: 180 },
      { field: 'number', headerName: 'Number', width: 180 },
      { field: 'membership_id', headerName: 'Membership Id', width: 180 },
      { field: 'subscription', headerName: 'Subscription', width: 180 },
      { field: 'date', headerName: 'Date', width: 180 },
      { field: 'gateway', headerName: 'Gateway', width: 180 },
        ];

  const rows = this.state.customers.map((item,key)=>{
    return {
            id:item.id,
            membership_id:item.membership_name,
            name:item.customer_name,
            subscription:item.subscription,
            date:item.date,
            gateway:item.gateway
          }

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
               <DataGrid  autoHeight rows={rows} columns={columns} pagination/>
    
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
