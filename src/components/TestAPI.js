import React, { Component } from 'react'
import axios from 'axios';

export class TestAPI extends Component {

  componentDidMount() {
    axios.get('http://0.0.0.0:5000/api/models/').then(res => {
      console.log(res);
    });
  }


  render() {
    return (
      <div>
        <h1>testing API here</h1>




      </div>
    )
  }
}

export default TestAPI
