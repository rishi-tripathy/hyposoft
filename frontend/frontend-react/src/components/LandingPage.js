import React from 'react';
import axios from 'axios'
import '../stylesheets/Landing.css'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

class LandingPage extends React.Component {
  render() {
    return (
      <div id="fade">
        <img src={require('../PoweredBy.png')}/>
      </div>
    )
  }
}

export default LandingPage;