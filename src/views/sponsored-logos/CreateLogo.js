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
} from "@material-ui/core";

import MatEdit from "views/MatEdit";

class CreateLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validate: {},
      logoCreated: false,
    };

    this.create_logo_url =
      this.props.rcp_url.proxy_domain +
      this.props.rcp_url.base_wp_url +
      "sponsored_logos";
  }

  submitForm() {
    const formData = new FormData(document.getElementById("create-logo-form"));
    this.addProfileImage(formData)
      .then((res) => res.json())
      .then((data) => {
        const { id: image_id } = data;
        console.log(data);
        return this.createLogo(image_id);
      })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        console.error(err);
      });
  }
  /**
   *
   */
  addProfileImage(formData) {
    for (let [key, value] of formData) {
      if (key !== "file") formData.delete(key);
    }

    return fetch(
      this.props.rcp_url.proxy_domain +
        this.props.rcp_url.base_wp_url +
        "media",
      {
        method: "POST",
        headers: {
          //when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
          //so there's no need to set it here
          Authorization: "Bearer " + this.props.user.token,
        },
        body: formData,
      }
    );
  }

  createLogo(id) {
    const formData = new FormData(document.getElementById("create-logo-form")); // create again for title
    formData.delete("file");
    return fetch(this.create_logo_url, {
      method: "POST",
      headers: {
        //when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
        //so there's no need to set it here
        Authorization: "Bearer " + this.props.user.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...Object.fromEntries(formData),
        featured_media: parseInt(id),
      }),
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
                  <h3 className="mb-0">Create Logo</h3>
                </CardHeader>
                <CardBody>
                  <Form
                    id="create-logo-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      return this.submitForm();
                    }}
                  >
                    <FormGroup row>
                      <Col>
                        <TextField
                          id="title"
                          label="Title"
                          name="title"
                          variant="outlined"
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <Label for="featured_image">File</Label>
                        <Input
                          type="file"
                          name="file"
                          id="featured_image"
                          accept="image/png, image/jpeg"
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateLogo);
