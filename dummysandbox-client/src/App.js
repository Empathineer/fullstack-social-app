import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'; // private module 
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'; // console err soln 
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Components 
import Navbar from './components/Navbar';

import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

import axios from 'axios';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4db6ac',
      main: '#009688',
      dark: '#006064',
      contrastText: '#fff',
    },
    secondary: {
      light: '#c5cae9',
      main: '#5c6bc0',
      dark: '#311b92',
      contrastText: '#fff',
    }
  },
    typography: {
      useNextVariants: true
    }
});

// axios.defaults.baseURL =
//   'https://us-central1-dummysandbox-9b7c0.cloudfunctions.net/api';

class App extends Component {
  render() {
      return (
        <MuiThemeProvider theme={theme}>
          <div className="App">
              <Router>
              <Navbar/>
                <div className="container">
                  <Switch>
                    <Route exact path = "/" component = {home} />
                    <Route exact path = "/login" component = {login} />
                    <Route exact path = "/signup" component = {signup} />
                  </Switch>
                </div>
              </Router>
            </div>
        </MuiThemeProvider>
        
      );
    }
  }
  

export default App;
