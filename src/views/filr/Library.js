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
} from "@material-ui/core";
import ListItemButton from "@material-ui/core/Button";

import "file-viewer";

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libraries: [],
    };
  }

  componentDidMount() {
    if (this.state.libraries.length === 0)
      this.fetchLibraries(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "filr-lists"
      );
  }

  componentDidUpdate() {}

  fetchLibraries = async (url) => {
    const queryUrl = new URL(url);
    const params = {
      per_page: 100,
    };
    for (let key in params) {
      queryUrl.searchParams.set(key, params[key]);
    }
    const res = await fetch(queryUrl);
    const data = await res.json();
    this.setState({ libraries: data });
  };

  render() {
    const columns = [
      {
        field: "id",
        headerName: "ID",
        width: 90,
      },
      {
        field: "name",
        headerName: "Library Name",
        width: 340,
        renderCell: (params) => (
          <Link href={params.row.link}>{params.row.name}</Link>
        ),
      },
      {
        field: "slug",
        headerName: "Slug",
        width: 270,
      },
      {
        field: "count",
        headerName: "Count",
        width: 180,
      },
    ];

    const rows =
      this.state.libraries.length !== 0
        ? this.state.libraries.map((item) => {
            return {
              id: item.id,
              name: item.name,
              slug: item.slug,
              count: item.count,
              link: item.link,
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
                  <h3 className="mb-0">Filr Libraries</h3>
                </CardHeader>
                <CardBody>
                  <DataGrid
                    loading={this.state.libraries.length === 0}
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

export default connect(mapStateToProps, mapDispatchToProps)(Library);
