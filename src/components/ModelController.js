import React, { Component } from 'react'
import ModelTable from './ModelTable'
import axios from 'axios'

export class ModelController extends Component {
  
  // TODO: add ID
  state = {
    models: [
      {
        "vendor": "Delasdfasdfl",
        "model_number": "D2",
        "height": 2,
        "display_color": "Red",
        "ethernet_ports": 1,
        "power_ports": 1,
        "cpu": "Intel CPU",
        "memory": 3,
        "storage": "Lots of Raid",
        "comment": "First Model"
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
    return <ModelTable models={ this.state.models } />
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