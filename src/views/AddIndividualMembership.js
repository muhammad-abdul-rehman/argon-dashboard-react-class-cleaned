import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

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
  Label,
  Col,
  Input,
  Container,
  Row,
  UncontrolledTooltip,
  CardBody,
  Form,
  FormGroup,
} from "reactstrap";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";

class AddIndividualMembership extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchToken(
      this.props.rcp_url.domain + this.props.rcp_url.auth_url + "token"
    );
  }

  async fetchToken(token_url) {
    const response = await fetch(token_url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "root", // Hardcoded for now.
        password: "root", // Hardcoded for now.
      }),
    });
    const data = await response.json();
    this.props.setUserLoginDetails(data);
  }

  render() {
    return (
      <>
        <OnlyHeader />
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Memberships</h3>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label for="first_name" sm={2}>
                        Name
                      </Label>
                      <Col sm={10}>
                        <Input
                          id="first_name"
                          name="first_name"
                          placeholder="with a placeholder"
                          type="email"
                        />
                      </Col>
                    </FormGroup>
                  </Form>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddIndividualMembership);
