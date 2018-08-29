import React, { Component } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

import AppContainer from "./AppContainer";

const ErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {     
      modalOpen: false
    };
    handleOpen = () => this.setState({ modalOpen: true });

    handleClose = () => this.setState({ modalOpen: false, error: null });
 
    render() {
      // console.log("---- ErrorHandler.render() --------")
      // console.log(this.props.errormessage)
      return (
        <Modal
          trigger={<Button onClick={this.handleOpen}>Show Modal</Button>}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          basic
          size="small"
        >
          <Header content="Oops! There's an error" />
          <Modal.Content>
            <h3>{this.props.errormessage}</h3>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.handleClose} inverted>
              <Icon name="checkmark" /> Got it
            </Button>
          </Modal.Actions>
        </Modal>
      );
    }
  };
};

export default ErrorHandler;
