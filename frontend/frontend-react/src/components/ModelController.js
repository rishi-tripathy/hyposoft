import React, { Component } from 'react'
import ModelTable from './ModelTable'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelController extends Component {
  state = {
    models: [
      {
        'id': 99,
        'vendor': 'default',
        'model_number': 'default',
        'height': 2,
        'display_color': 'Red',
        'ethernet_ports': 1,
        'power_ports': 1,
        'cpu': 'Intel CPU',
        'memory': 3,
        'storage': 'Lots of Raid',
      }
    ]
  };

  componentDidMount() {
    axios.get('/api/models/').then(res => {
      const b = res.data.results;
      this.setState({ models: b });
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  render() {
    if (this.state.models[0] == null) {
      return <p>No models exist</p>
    } else {
      return <ModelTable models={ this.state.models } />
    }

  }
}

export default ModelController