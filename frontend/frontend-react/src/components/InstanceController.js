import React, { Component } from 'react'
import InstanceTable from './InstanceTable'
import axios from 'axios'

export class InstanceController extends Component {

  constructor() {
    super();
    this.state = {
      instances: [
        {
          id: '1',
          model: 'R710',
          hostname: 'server9',
          rack: 'B12',
          rack_u: 5,
          owner: 'Michael',
          comment: 'Reserved for Palaemon project'
        }
      ],
    }
  }

  getInstances() {
    let modelAPIDest, rackAPIDest, ownerAPIDest;
    
    axios.get('/api/instances/').then(res => {
      
      // list of instances
      const instanceList = res.data.results;

      // getting API end points
      const { model, rack, owner } = instanceList[0];
      modelAPIDest = model;
      rackAPIDest = rack;
      ownerAPIDest = owner;

      console.log(instanceList);
      console.log(modelAPIDest); 
      console.log(rackAPIDest); 
      console.log(ownerAPIDest); 

      // this works!!
      // axios.get(modelAPIDest).then(r => {
      //   console.log(r);
      // })

      this.setState({ instances: instanceList });
    })
    //return {m: modelAPIDest, r: rackAPIDest, o: ownerAPIDest};
    
  }

  componentDidMount() {
    this.getInstances();
  }


  render() {
    return <InstanceTable instances={this.state.instances} />
  }
}

export default InstanceController
