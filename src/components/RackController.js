import React, { Component } from 'react'
import RackTable from './RackTable';

export class RackController extends Component {

  state = {

    rackInstances: [
        {
          id: '5B12',
          hostName: 'server9',
          rack: 'B12',
          rackU: 5,
          height: 2,
          vendor: 'Dell',
          modelNumber: 'R710'              
        },
        {
          id: '2T12',
          hostName: 'server10',
          rack: 'T12',
          rackU: 2,
          height: 3,
          vendor: 'Cisco',
          modelNumber: 'R711'              
        },
        {
          id: '2B12',
          hostName: 'server11',
          rack: 'B12',
          rackU: 0,
          height: 2,
          vendor: 'Dell',
          modelNumber: 'R710'              
        }
      ]
    }
    
    initializeNumberArray(){
      var array = [];

      for (var i = 43; i > 0; i--) {
        array.push(i);
      }

      return array;
    }

  render() {
    let numberArray = [];
     numberArray = this.initializeNumberArray();

    return <RackTable rackInstances={this.state.rackInstances} numbers ={numberArray}/>
  }
}

export default RackController