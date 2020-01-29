import React, { Component } from 'react'
import InstanceTable from './InstanceTable'
import axios from 'axios'
import DetailedInstance from './DetailedInstance';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class InstanceController extends Component {


  constructor() {
    super();
    this.state = {
      instances: [
        // {
        //   id: 99,
        //   model: 'default',
        //   hostname: 'default',
        // }
      ],
      showTableView: true,
      showIndividualInstanceView: false,
      detailedInstanceID: 0,
    };

    this.getShowTable = this.getShowTable.bind(this);
    this.getDetailedInstanceID = this.getDetailedInstanceID.bind(this);
  }

  getShowTable = (show) => {
    show ? this.setState({
      showTableView : true,
      showIndividualInstanceView: false
    })
    : this.setState({
      showTableView : false,
      showIndividualInstanceView: true
    }) 
  }

  getDetailedInstanceID = (id) => {
    console.log('getting this id' + id)
    this.setState({ detailedInstanceID: id});
  }

  


  getInstances() {
    let modelAPIDest, rackAPIDest, ownerAPIDest;
    
    axios.get('/api/instances/?detail=short').then(res => {
      // list of instances
      const instanceList = res.data.results;

      // TODO: integrate
      console.log(instanceList);
      if (instanceList[0] == null) {
        console.log('instances[0] is null');
        return;
      }

      // this works for nested stuff
      // waiting for miles to update API
      // axios.get(modelAPIDest).then(r => {
      //   console.log(r);
      // })

      // this.setState({ instances: instanceList });
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });

  }

  componentDidMount() {
    this.getInstances();
  }


  render() {
    if (this.state.instances[0] == null) {
      return <p>No instances</p>
    } else {
      return (
        <div>
          { 
            this.state.showTableView ? 
            <InstanceTable 
              instances={ this.state.instances } 
              sendShowTable={ this.getShowTable } 
              sendInstanceID={ this.getDetailedInstanceID } /> 
            : null
          }
          { 
            this.state.showIndividualInstanceView ? 
            <DetailedInstance instanceID={ this.state.detailedInstanceID } /> 
            : null
          }
        </div>
        
        
      )
    }

  }
}

export default InstanceController