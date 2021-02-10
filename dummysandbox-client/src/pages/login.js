import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

//MUI Stuff
import Grid from "@material-ui/core/Grid";

const styles = {};

class login extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <h1>Login page</h1>
      </div>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(login);
