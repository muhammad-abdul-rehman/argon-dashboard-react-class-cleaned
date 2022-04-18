import React from "react";
import { FormControlLabel, IconButton } from "@material-ui/core";
import { Modal, ModalHeader } from "reactstrap";

const MatEdit = ({ index,handleClick }) => {
    
    

    const handleEditClick = (e) => {
      // some action
      e.preventDefault();
      console.log(index);
    };
    const handleDeleteClick = (e) => {
      e.preventDefault();
      console.log(index);
    };
    return (
      <>

        <FormControlLabel
          control={
              style={{ fontSize: "1rem" }}
              aria-label="edit membership"
              onClick={/*handleEditClick*/handleClick}
            >
              <i className="fa fa-pen" />
            </IconButton>
          }
        />
        <FormControlLabel
          control={
            <IconButton
              style={{ fontSize: "1rem" }}
              aria-label="delete membership"
              onClick={handleDeleteClick}
            >
              <i className="fa fa-trash" />
            </IconButton>
          }
        />
      </>
    );
  };

  export default MatEdit;