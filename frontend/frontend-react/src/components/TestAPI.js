import React, {Component} from 'react'
import axios from 'axios';

export class TestAPI extends Component {

  componentDidMount() {
    axios.get('/api/models/').then(res => {
      console.log(res);
      console.log('df')
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
