import React, { Component } from 'react'
import ModelTable from './ModelTable'
import CreateModelForm from './CreateModelForm'
import axios from 'axios'
import EditModelForm from './EditModelForm';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelController extends Component {
  state = {
    models: [
      // {
      //   'id': 99,
      //   'vendor': 'default',
      //   'model_number': 'default',
      //   'height': 2,
      //   'display_color': 'Red',
      //   'ethernet_ports': 1,
      //   'power_ports': 1,
      //   'cpu': 'Intel CPU',
      //   'memory': 3,
      //   'storage': 'Lots of Raid',
      //   'comment': 'First Model'
      // }
    ],
    showTableView: true,
    showCreateView: false,
    showEditView: false,
    showDeleteView: false,
    editID: 0,
    deleteID: 0,
  };

  getShowCreate = (show) => {
    show ? this.setState({
      showTableView: false,
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

  getShowDelete = (show) => {
    show ? this.setState({
      showTableView: false,
      showCreateView : false,
      showEditView: false,
      showDeleteView: true,
    })
    : this.setState({
      showDeleteView : false,
    }) 
  }

  componentDidMount() {
    axios.get('/api/models/?shortform=true').then(res => {
      const b = res.data.results;
      this.setState({ models: b });
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  render() {
    let content;
    if (this.state.showTableView){
        content = <ModelTable models={ this.state.models } 
                    sendShowCreate={this.getShowCreate}
                    sendShowEdit={this.getShowEdit}
                    sendEditID={this.getEditID}
                    sendShowDelete={this.getShowDelete} />
    }
    else if (this.state.showCreateView){
        content = <CreateModelForm /> 
    }
    else if (this.state.showEditView){
        content= <EditModelForm editID={this.state.editID} /> 
    }


    if (this.state.models[0] == null) {
      return <p>No models exist</p>
    } else {
      return (
        <div>
          {content}
        </div>
      )
    }
  }
}

export default ModelController