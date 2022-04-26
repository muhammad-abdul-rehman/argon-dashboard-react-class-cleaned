import OnlyHeader from "components/Headers/OnlyHeader";
import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Media,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

//MUI
import { DataGrid } from "@material-ui/data-grid";

import { connect } from "react-redux";
import { setUserLoginDetails } from "features/user/userSlice";
import {
  LinearProgress,
  Avatar,
  Grid,
  TextField,
  Chip,
  Button,
  ButtonGroup,
  FormControlLabel,
  FormHelperText,
  Switch,
} from "@material-ui/core";

import MatEdit from "views/MatEdit";

class CreateDiscountCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validate: {
        code: false,
      },
    };

    this.create_discount_code_url =
      this.props.rcp_url.proxy_domain +
      this.props.rcp_url.base_wp_url +
      "discounts";
  }

  validateCode(code) {
    const regex = "^[a-zA-Z0-9]*$";
    result = regex.test(code);
    this.setState({ validate: { code: result } });
  }

  submitForm() {
    const formData = new FormData(
      document.getElementById("create-discount-code-form")
    );
    this.addImage(formData)
      .then((res) => res.json())
      .then((data) => {
        const { id: image_id } = data;
        console.log(data);
        return this.createSpeaker(image_id);
      })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        console.error(err);
      });
  }

  handleChange = (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });
  };

  createDiscountCode() {
    return fetch(this.create_logo_url, {
      method: "POST",
      headers: {
        //when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
        //so there's no need to set it here
        Authorization: "Bearer " + this.props.user.token,
        "Content-Type": "application/json",
      },
      body: formData,
    });
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
                  <h3 className="mb-0">Create Discount Code</h3>
                </CardHeader>
                <CardBody>
                  <Form
                    id="create-discount-code-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      return this.submitForm();
                    }}
                  >
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="name"
                          label="Name"
                          name="name"
                          variant="outlined"
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="quote"
                          label="Quote"
                          name="quote"
                          variant="outlined"
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="designation"
                          label="Designation"
                          name="designation"
                          variant="outlined"
                          required
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup check row>
                      <Col>
                        <Button variant="contained" type="submit">
                          Submit
                        </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiscountCode);
