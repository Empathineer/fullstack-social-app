import React, { Component } from "react";
import axios from "axios";
import { Grid } from "@material-ui/core";
import Scream from "../components/scream/Scream";

class home extends Component {
  state = {
    screams: null,
  };
  // axios allows us to send async http req's to the REST endpts
  // must access the res thru .datafor axios req's
  componentDidMount() {
    axios
      .get("/screams")
      .then((res) => {
        console.log(res.data);
        this.setState({
          screams: res.data,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    let recentScreamsMarkup = this.state.screams ? (
      //Each child Scream must have a unqie "key" prop, hence `key={screamId}`
      this.state.screams.map((scream) => (
        <Scream key={scream.screamId} scream={scream} />
      ))
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={8}>
        {/* 'sm' referring to small screens will have a grid width of 8px */}
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
          {/* <p>Content...</p> */}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    );
  }
}

export default home;
