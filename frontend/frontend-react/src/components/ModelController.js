import React, { Component } from 'react'
import ModelTable from './ModelTable'
import axios from 'axios'

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
        'comment': 'First Model'
      }
    ]
  };

  componentDidMount() {
    axios.get('/api/models/').then(res => {
      const b = res.data.results;
      this.setState({ models: b });
      
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
