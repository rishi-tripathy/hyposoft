 import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import SideBar from './components/SideBar';
import axios from 'axios'
import './stylesheets/Printing.css'
import { UncontrolledCollapse, Button, Jumbotron,CardBody, Card } from 'reactstrap';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      logged_in: false,
    }
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
      axios.get('api/users/am_i_admin/').then(res => {
          const r = res.data.is_admin;
          this.setState({logged_in: r});
          console.log(r);

      })
      .then(response => { 
        console.log(response)
      })
      .catch(error => {
          console.log(error.response)
      });
  }

  handleOnClick() {
    window.location = "/accounts/login/";
    console.log(window.location);
  }

  render() {

    let content;

    

    if(!this.state.logged_in){
      content = <button onClick={this.handleOnClick}>Log In!</button>
    }
    else {
      content = <SideBar />
    }

    return (
      <Router>
          {content}
      </Router>
    )
  }
}

export default App;
