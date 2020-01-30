import React, { Component } from 'react'
import InstanceTable from './InstanceTable'
import axios from 'axios'
import DetailedInstance from './DetailedInstance';
import CreateInstanceForm from './CreateInstanceForm';
import EditInstanceForm from './EditInstanceForm';
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
      showCreateView: false,
      showEditView: false,
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

  getShowCreate = (show) => {
    show ? this.setState({
      showTableView: false,
      showIndividualInstanceView: false,
      showCreateView : true,
      showEditView: false,
      showDeleteView: false,
    })
    : this.setState({
      showCreateView : false,
    }) 
  }

  getShowEdit = (show) => {
    show ? this.setState({
      showTableView: false,
      showIndividualInstanceView: false,
      showCreateView : false,
      showEditView: true,
      showDeleteView: false,
    })
    : this.setState({
      showEditView : false,
    }) 
  }

  getEditID = (id) => {
    this.setState({
      editID: id,
    });
  }

  

  getDetailedInstanceID = (id) => {
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

      this.setState({ instances: instanceList });
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
    let content;

    if (this.state.showTableView) {
      content = <InstanceTable 
                  instances={ this.state.instances } 
                  sendShowTable={ this.getShowTable } 
                  sendInstanceID={ this.getDetailedInstanceID }
                  sendShowCreate={this.getShowCreate}
                  sendShowEdit={this.getShowEdit}
                  sendEditID={this.getEditID}
                  sendShowDelete={this.getShowDelete} />;
    }
    else if (this.state.showIndividualInstanceView) {
      content = <DetailedInstance instanceID={ this.state.detailedInstanceID } /> ;
    }
    else if (this.state.showCreateView) {
      content = <CreateInstanceForm sendShowTable={this.getShowTable} />
    }
    else if (this.state.showEditView) {
      content = <EditInstanceForm />
    }




    if (this.state.instances[0] == null) {
      return <p>No instances</p>
    } else {
      return (
        <div>
          { content }
        </div>
        
        
      )
    }

  }
}

export default InstanceController