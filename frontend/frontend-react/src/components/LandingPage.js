import React from 'react';
import axios from 'axios'
import '../stylesheets/Landing.css'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

class LandingPage extends React.Component {
  render() {
    return (
      <center>
      <div id="fade">
        <img src={require('../PoweredBy.png')}/>
      </div>
      </center>
    )
  }
}

export default LandingPage;