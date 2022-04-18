import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
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
  Col,
  UncontrolledTooltip,
  Navbar,
  NavLink,
} from "reactstrap";

//MUI
import { DataGrid } from "@material-ui/data-grid";

import fileIcons from "../../variables/file-icons";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Drawer,
  IconButton,
  Button,
  Link,
  LinearProgress,
  Breadcrumbs,
  Avatar,
} from "@material-ui/core";
import ListItemButton from "@material-ui/core/Button";

class Speakers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speakers: [],
    };
  }

  componentDidMount() {
    if (this.state.speakers.length === 0)
      this.fetchSpeakers(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "speakers"
      );
  }

  componentDidUpdate() {}

  fetchSpeakers = async (url) => {
    const queryUrl = new URL(url);
    const params = {
      per_page: 100,
    };
    for (let key in params) {
      queryUrl.searchParams.set(key, params[key]);
    }
    const res = await fetch(queryUrl);
    const data = await res.json();
    this.setState({ speakers: data });
  };

  render() {
    const columns = [
      //   {
      //     field: "id",
      //     headerName: "ID",
      //     width: 90,
      //   },
      {
        field: "name",
        headerName: "Library Name",
        width: 340,
        renderCell: (params) => (
          <div className="d-flex align-items-center">
            <Avatar
              className="mr-5"
              alt={params.row?.avatar_alt}
              src={params.row?.avatar}
            />
            <Media>
              <span
                className="mb-0 text-sm font-weight-600"
                style={{ color: "#525f7f" }}
              >
                {params.row?.name}
              </span>
            </Media>
          </div>
        ),
      },
      {
        field: "designation",
        headerName: "Designation",
        width: 180,
      },
      {
        field: "status",
        headerName: "Status",
        width: 180,
      },
      {
        field: "date",
        headerName: "Created Date",
        width: 180,
      },
    ];

    const rows =
      this.state.speakers.length !== 0
        ? this.state.speakers.map((item) => {
            return {
              id: item.id,
              name: item?.title.rendered,
              avatar_alt: item?.acf?.profile_picture?.title,
              avatar: item?.acf?.profile_picture?.url,
              designation: item?.acf?.designation,
              status: item.status,
              date: item.date,
            };
          })
        : [];

    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Filr speakers</h3>
                </CardHeader>
                <CardBody>
                  <DataGrid
                    loading={this.state.speakers.length === 0}
                    components={{
                      LoadingOverlay: LinearProgress,
                    }}
                    autoHeight
                    rows={rows}
                    columns={columns}
                  />
                </CardBody>
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

export default connect(mapStateToProps, mapDispatchToProps)(Speakers);
