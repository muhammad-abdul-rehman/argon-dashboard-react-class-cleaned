import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Media, Container, Row } from "reactstrap";

//MUI
import { DataGrid } from "@material-ui/data-grid";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import { LinearProgress, Avatar } from "@material-ui/core";

import MatEdit from "views/MatEdit";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    if (this.state.users.length === 0 && this.props.user.token !== null)
      this.fetchUsers(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "users"
      );
  }

  componentDidUpdate({ user: prevUser }) {
    if (prevUser !== this.props.user && this.props.user.token !== null) {
      this.fetchUsers(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "users"
      );
    }
  }

  fetchUsers = async (url) => {
    const queryUrl = new URL(url);
    const params = {
      per_page: 100,
      context: "edit",
      acf_format: "standard",
    };
    for (let key in params) {
      queryUrl.searchParams.set(key, params[key]);
    }
    const res = await fetch(queryUrl, {
      headers: {
        Authorization: "Bearer " + this.props.user.token,
      },
    });
    const data = await res.json();
    this.setState({ users: data });
  };

  deleteUser(url, id) {
    fetch(url + "/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + this.props.user.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reassign: 2, // ID of Farhan User Account.
        force: true, // No trash supported.
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ users: this.state.users.filter((el) => el.id !== id) });
      })
      .catch((e) => console.error(e));
  }

  render() {
    const columns = [
      {
        field: "id",
        headerName: "ID",
        width: 90,
      },
      {
        field: "name",
        headerName: "Name",
        width: 340,
        renderCell: (params) => (
          <div className="d-flex align-items-center">
            <Avatar
              className="mr-5"
              alt={params.row?.name}
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
        field: "login",
        headerName: "ATPI login",
        width: 270,
      },
      {
        field: "roles",
        headerName: "Roles",
        width: 270,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        renderCell: (params) => {
          const handleClick = (e) => {
            console.log(e, "handle click", params.row.id);
            this.props.history.push(
              this.props.history.location.pathname + "/" + params.row.id
            );
          };

          const handleDeleteClick = (e) => {
            return this.deleteUser(
              this.props.rcp_url.proxy_domain +
                this.props.rcp_url.base_wp_url +
                "users",
              params.row.id
            );
          };

          return (
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
            >
              <MatEdit
                handleClick={handleClick}
                handleDeleteClick={handleDeleteClick}
                index={params.row.id}
              />
            </div>
          );
        },
      },
    ];

    const rows =
      this.state.users.length !== 0
        ? this.state.users.map((item) => {
            return {
              id: item.id,
              name: item?.name,
              avatar: item?.acf?.user_profile
                ? item?.acf?.user_profile
                : item?.avatar_urls[Object.keys(item?.avatar_urls)[0]],
              login: item?.username,
              roles: item?.roles.join(", "),
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
                  <h3 className="mb-0">Users</h3>
                </CardHeader>
                <CardBody>
                  <DataGrid
                    loading={this.state.users.length === 0}
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

export default connect(mapStateToProps, mapDispatchToProps)(Users);
