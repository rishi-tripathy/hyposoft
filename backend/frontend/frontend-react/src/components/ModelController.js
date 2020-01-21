import React, { Component } from 'react'
import ModelTable from './ModelTable'
import axios from 'axios'

export class ModelController extends Component {
  
  constructor() {
    super();
    this.state = {
      models: []
    }
  }

  componentDidMount() {
    axios.get('http://0.0.0.0:5000/api/models/').then(res => {
      this.setState({ models: res.data });
    });
  }
  
  render() {
    return <ModelTable models={this.state.models} />
  }
}

export default ModelController

// {
//   id: 1,
//   vendor: 'Dell',
//   modelNumber: 'R710',
//   height: 2,
//   displayColor: 'black',
//   ethernetPorts: 4,
//   powerPorts: 1,
//   cpu: 'Intel Xeon E5520 2.2Ghz',
//   memory: 4,
//   storage: '2x500GB SSD RAID1',
//   comment: 'retired offering, no new purchasing'
// },
// {
//   id: 2,
//   vendor: 'Cisco',
//   modelNumber: 'R720',
//   height: 3,
//   displayColor: 'red',
//   ethernetPorts: 2,
//   powerPorts: 2,
//   cpu: 'Intel Xeon E5520 2.4Ghz',
//   memory: 4,
//   storage: '2x500GB SSD RAID2',
//   comment: 'retired offering, no new purchasing !'
// }