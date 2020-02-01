import React, { Component } from 'react'
import axios from 'axios'
import ModelCard from './ModelCard'
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedModel extends Component {

  constructor() {
    super();
    this.state = {
      model: {
        'id': 37,
        'vendor': 'Dell',
        'model_number': '34d',
        'height': 3,
        'display_color': '000000',
        'ethernet_ports': null,
        'power_ports': null,
        'cpu': '',
        'memory': null,
        'storage': '',
        'comment': ''
      }
    }
  }

  componentDidMount() {
    let dst = '/api/models/'.concat(this.props.modelID).concat('/');
    axios.get(dst).then(res => {
      this.setState({
        model: res.data
      });
    });
  }

  render() {
    return (
      <div>
        <ModelCard model={ this.state.model } />
      </div>
    )
  }
}

export default DetailedModel
