import React, { Component } from 'react'
import RackTable from './RackTable';

export class RackController extends Component {

    constructor() {
    super();


    //dummy models
    this.state = {
      //in the future, we would 
        racks: [
            {
              hostName: 'server9',
              rack: 'B12',
              rackU: 5,
              height: 2,
              vendor: 'Dell',
              modelNumber: 'R710'              
            },
            {
              hostName: 'server10',
              rack: 'T12',
              rackU: 2,
              height: 3,
              vendor: 'Cisco',
              modelNumber: 'R711'              
            },
            {
              hostName: 'server11',
              rack: 'B12',
              rackU: 0,
              height: 2,
              vendor: 'Dell',
              modelNumber: 'R710'              
            }
        ]
    }
  }

  render() {
    return (
      <RackTable racks = {this.state.racks} />
    )
  }
}

export default RackController