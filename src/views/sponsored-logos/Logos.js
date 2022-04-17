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
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@material-ui/core";
import ListItemButton from "@material-ui/core/Button";

import "file-viewer";

class Logos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logos: [],
    };
  }

  componentDidMount() {
    if (this.state.logos.length === 0)
      this.fetchLogos(
        this.props.rcp_url.proxy_domain +
          this.props.rcp_url.base_wp_url +
          "sponsored_logos"
      );
  }

  componentDidUpdate() {}

  fetchLogos = async (url) => {
    const queryUrl = new URL(url);
    const params = {
      per_page: 100,
      _embed: true,
    };
    for (let key in params) {
      queryUrl.searchParams.set(key, params[key]);
    }
    const res = await fetch(queryUrl);
    const data = await res.json();
    this.setState({ logos: data });
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
                  <h3 className="mb-0">Filr Libraries</h3>
                </CardHeader>
                <CardBody>
                  <ImageList variant="masonry" cols={3} gap={8}>
                    {this.state.logos.length !== 0 &&
                      this.state.logos.map((item, key) => (
                        <ImageListItem key={key}>
                          <img
                            src={`${item?._embedded["wp:featuredmedia"][0]?.source_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${item?._embedded["wp:featuredmedia"][0]?.source_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title.rendered}
                            loading="lazy"
                          />
                          <ImageListItemBar
                            position="bottom"
                            title={item.title.rendered}
                          />
                        </ImageListItem>
                      ))}
                  </ImageList>
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

export default connect(mapStateToProps, mapDispatchToProps)(Logos);
