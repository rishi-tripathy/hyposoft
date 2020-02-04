import React, { Component } from 'react'
import axios from 'axios'
import ModelCard from './ModelCard'
import DetailedInstance from './DetailedInstance'
import AllInstancesOfModelView from './AllInstancesOfModelView';
import DetailedInstanceFromModel from './DetailedInstanceFromModel';
import Button from "reactstrap/es/Button";
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedModel extends Component {

  constructor() {
    super();
    this.state = {
      model: {
        // 'id': 37,
        // 'vendor': 'Dell',
        // 'model_number': '34d',
        // 'height': 3,
        // 'display_color': '000000',
        // 'ethernet_ports': null,
        // 'power_ports': null,
        // 'cpu': '',
        // 'memory': null,
        // 'storage': '',
        // 'comment': '',
        
      },
      detailedInstanceID: 0,
      showIndividualInstanceView: false,
      showTableView : true,
    }
  }

  getShowDetailedInstance = (show) => {
    show ? this.setState({
      showIndividualInstanceView: true,
      // everything else false
      showTableView : false,
    })
    : this.setState({
      showIndividualInstanceView : false,
    }) 
  }

  getShowTableView = (show) => {
    show ? this.setState({
      showTableView : true,
      // everything else false
      showIndividualInstanceView: false,
    })
    : this.setState({
      showTableView : false,
    })
  }

  getDetailedInstanceID = (id) => {
    this.setState({ detailedInstanceID: id});
  }

  loadModelData = () => {
    if (this.props.modelID !== undefined) {
      let dst = '/api/models/'.concat(this.props.modelID).concat('/');
      console.log(dst);
      axios.get(dst).then(res => {
        this.setState({
          model: res.data
        });
      })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response);
      });
    }
  }

  componentDidMount() {
    this.loadModelData();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props.modelID !== undefined) {
  //     this.loadModelData();
  //   }
  // }

  render() {

    let content;
    if (this.state.showTableView) {
      content = <AllInstancesOfModelView modelID={this.state.model.id} 
                  sendInstanceID={ this.getDetailedInstanceID }
                  sendShowDetailedInstance={ this.getShowDetailedInstance } />;
    }
    else if (this.state.showIndividualInstanceView) {
      content = <DetailedInstanceFromModel instanceID={ this.state.detailedInstanceID }
                  sendShowTable={ this.getShowTableView }  /> ;
    }

    return (
      <div>
        <Button onClick={() => this.props.sendShowTable(true)} >Back</Button>
        <br></br>
        <ModelCard model={ this.state.model } />
        <br></br>
        <br></br>
        { content }
      </div>
    )
  }
}

export default DetailedModel
