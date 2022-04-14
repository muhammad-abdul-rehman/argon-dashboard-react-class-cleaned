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

class Clubs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clubs: [],
      page: 1,
      number: 5,
    };
  }

  componentDidMount() {
    if (null !== this.props.user.token && this.state.clubs.length === 0) {
      this.fetchClubs(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
          "groups",
        this.props.user.token
      );
    }
  }

  componentDidUpdate({ user: prevUser }) {
    if (null !== this.props.user.token && this.state.clubs.length === 0) {
      this.fetchClubs(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_url +
          "groups",
        this.props.user.token
      );
    }
  }

  fetchClubs = async (url, token) => {
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
    this.setState({ clubs: data });
  };

  render() {
    console.table("Clubs => ", this.state.clubs);

    const columns = [
      { field: "id", headerName: "ID", width: 90 },
      { field: "name", headerName: "Club Name", width: 180 },
      { field: "membership_id", headerName: "Membership ID", width: 180 },
      { field: "membership_name", headerName: "Membership Name", width: 180 },
      { field: "owner_name", headerName: "Owner", width: 180 },
      { field: "member_count", headerName: "Member Count", width: 180 },
      { field: "seats", headerName: "Seats", width: 180 },
      { field: "created_date", headerName: "Created At", width: 180 },
    ];

    const rows = this.state.clubs?.map((item, key) => {
      return {
        id: item.id,
        name: item.name,
        membership_id: item.membership_id,
        membership_name: item.membership_name,
        owner_name: item.owner_name,
        member_count: item.member_count,
        seats: item.seats,
        created_date: item.created_date,
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
                  <h3 className="mb-0">Clubs</h3>
                </CardHeader>
                <DataGrid
                  loading={this.state.clubs.length === 0}
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

export default connect(mapStateToProps, mapDispatchToProps)(Clubs);
