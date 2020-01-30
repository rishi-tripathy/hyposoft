import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditModelForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'vendor': null,
      'model_number': null,
      'height': null,
      'display_color': null,
      'ethernet_ports': null,
      'power_ports': null,
      'cpu': null,
      'memory': null,
      'storage': null,
      'comment': null,
    }
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/models/'.concat(this.props.editID).concat('/');

    let stateCopy = Object.assign({}, this.state);
    let stateToSend = this.removeEmpty(stateCopy);
    
    axios.patch(dst, stateToSend)
    .then(function (response) {
      alert('Edit was successful');
    })
    .catch(function (error) {
      alert('Edit was not successful.\n' + JSON.stringify(error.response.data));
    });
  }

  componentDidMount() {
    let dst = '/api/models/'.concat(this.props.editID).concat('/');
    axios.get(dst).then(res => {
      console.log('model form results ' + res);
      this.setState({ vendor: res.data.vendor });
      this.setState({ model_number: res.data.model_number });
      this.setState({ display_color: res.data.display_color });
      this.setState({ ethernet_ports: res.data.ethernet_ports });
      this.setState({ power_ports: res.data.power_ports });
      this.setState({ cpu: res.data.cpu });
      this.setState({ memory: res.data.memory });
      this.setState({ storage: res.data.storage });
      this.setState({ comment: res.data.comment });
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
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Edit Model Form</h3>
        <p>Vendor</p> <input type="text" value={this.state.vendor} onChange={e => this.setState({vendor: e.target.value})} />
        <p>Model number</p> <input type="text" value={this.state.model_number} onChange={e => this.setState({model_number: e.target.value})} />
        <p>Height</p> <input type="number" value={this.state.height} onChange={e => this.setState({height: e.target.value})}/>
        <p>Display color</p> <input type="text" value={this.state.display_color} onChange={e => this.setState({display_color: e.target.value})}/>
        <p>Ethernet ports</p> <input type="number" value={this.state.ethernet_ports} onChange={e => this.setState({ethernet_ports: e.target.value})}/>
        <p>Power ports</p> <input type="number" value={this.state.power_ports} onChange={e => this.setState({power_ports: e.target.value})}/>
        <p>CPU</p> <input type="text" value={this.state.cpu} onChange={e => this.setState({cpu: e.target.value})}/>
        <p>Memory</p> <input type="number" value={this.state.memory} onChange={e => this.setState({memory: e.target.value})}/>
        <p>Storage</p> <input type="text" value={this.state.storage} onChange={e => this.setState({storage: e.target.value})}/>
        <p>Comment</p> <input type="text" value={this.state.comment} onChange={e => this.setState({comment: e.target.value})}/>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

EditModelForm.propTypes = {
  editID: PropTypes.object.isRequired
}

export default EditModelForm
