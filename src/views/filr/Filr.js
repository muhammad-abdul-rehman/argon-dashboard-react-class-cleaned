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
  UncontrolledTooltip,
  Navbar,
  NavLink,
} from "reactstrap";

//MUI
import { DataGrid } from "@material-ui/data-grid";

import fileIcons from "./file-icons";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import { Grid, List, ListItem, ListItemIcon } from "@material-ui/core";
import ListItemButton from "@material-ui/core/Button";

class Filr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }

  componentDidMount() {
    if (this.state.files.length === 0)
      this.fetchFiles(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "filr"
      );
  }

  componentDidUpdate() {}

  fetchFiles = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    this.setState({ files: data });
  };

  openFolder = (event) => {
    event.preventDefault();
    console.log(event, event.target);
  };

  render() {
    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Filr</h3>
                </CardHeader>
                <CardBody>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Navbar>
                        <List className="w-100">
                          {this.state.files.length !== 0 &&
                            this.state.files
                              .filter((el) =>
                                el.metadata["is-folder"]?.includes("true")
                              )
                              .map((item, key) => (
                                <NavLink key={key}>
                                  <ListItem>
                                    <ListItemButton
                                      startIcon={<i className="fa fa-folder" />}
                                      className="w-100 justify-content-start text-capitalize folder-buttons"
                                      onClick={this.openFolder.bind(this)}
                                    >
                                      {item.title.rendered.slice(0, 20) + "..."}
                                    </ListItemButton>
                                  </ListItem>
                                </NavLink>
                              ))}
                        </List>
                      </Navbar>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <List>
                        {this.state.files.length !== 0 &&
                          this.state.files
                            .filter(
                              (el) =>
                                el.metadata["assigned-folder"] === undefined
                            )
                            .map((item, key) => {
                              const fileType = item.metadata["file-download"]
                                ?.pop()
                                ?.split(".")
                                .pop();
                              const fileIcon = fileIcons
                                .filter((el) => el.type.includes(fileType))
                                ?.pop()?.icon;
                              console.log(fileIcon); // @todo it return undefined after a while.
                              return (
                                <ListItem key={key}>
                                  <ListItemButton className="w-100 text-capitalize justify-content-start">
                                    <ListItemIcon>
                                      <i
                                        className={
                                          typeof fileIcon === "string"
                                            ? fileIcon
                                            : "fa fa-file"
                                        }
                                      />
                                    </ListItemIcon>
                                    {item.title.rendered}
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                      </List>
                    </Grid>
                  </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(Filr);
