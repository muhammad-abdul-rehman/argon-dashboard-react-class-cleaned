import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Media, Container, Row } from "reactstrap";

//MUI
import { DataGrid } from "@material-ui/data-grid";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import { LinearProgress, Avatar, Button } from "@material-ui/core";

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
      acf_format: "standard",
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
        headerName: "Speaker Name",
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
            const date = new Date(item.date);
            return {
              id: item.id,
              name: item?.title.rendered,
              avatar_alt: item?.acf?.profile_picture?.title,
              avatar: item?.acf?.profile_picture?.url,
              designation: item?.acf?.designation,
              status: item.status,
              date:
                date.getDay() +
                "-" +
                date.getMonth() +
                "-" +
                date.getFullYear(),
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
                <CardHeader className="border-0 d-flex justify-content-between pl-3 pr-3">
                  <h3 className="mb-0">Speakers</h3>
                  <Button
                    variant="contained"
                    onClick={() => this.props.history.push("speakers/create")}
                  >
                    Create
                  </Button>
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
