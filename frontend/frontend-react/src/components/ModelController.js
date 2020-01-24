import React, { Component } from 'react'
import ModelTable from './ModelTable'
import CreateModelForm from './CreateModelForm'
import axios from 'axios'
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
  };

  getShowCreate = (show) => {
    show ? this.setState({
      showCreateView : true,
      showTableView: false
    })
    : this.setState({
      showCreateView : false,
      // might not need line below
      showTableView: this.state.showTableView
    }) 
  }

  componentDidMount() {
    axios.get('/api/models/').then(res => {
      const b = res.data.results;
      this.setState({ models: b });

    });
  }

  render() {
    if (this.state.models[0] == null) {
      return <p>No models exist</p>
    } else {
      return (
        <div>
          { 
            this.state.showCreateView ? 
            <CreateModelForm /> 
            : <ModelTable models={ this.state.models } sendShowCreate={this.getShowCreate} />
          }
        </div>
      )
    }
  }
}

export default ModelController