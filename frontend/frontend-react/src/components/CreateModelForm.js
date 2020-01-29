import React, { Component } from 'react'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateModelForm extends Component {

  constructor() {
    super();
    this.state = {
      'vendor': 'default',
      'model_number': 'default',
      'height': 2,
      'display_color': 'Red',
      'ethernet_ports': 1,
      'power_ports': 1,
      'cpu': 'Intel CPU',
      'memory': 3,
      'storage': 'Lots of Raid',
      'comment': 'First Model'
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('/api/models/', this.state)
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
        <h3>Create model form!!</h3>
        <p>Vendor</p> <input type="text" onChange={e => this.setState({vendor: e.target.value})} />
        <p>Model number</p> <input type="text" onChange={e => this.setState({model_number: e.target.value})} />
        <p>Height</p> <input type="number" onChange={e => this.setState({height: e.target.value})}/>
        <p>Display color</p> <input type="text" onChange={e => this.setState({display_color: e.target.value})}/>
        <p>Ethernet ports</p> <input type="number" onChange={e => this.setState({ethernet_ports: e.target.value})}/>
        <p>Power ports</p> <input type="number" onChange={e => this.setState({power_ports: e.target.value})}/>
        <p>CPU</p> <input type="text" onChange={e => this.setState({cpu: e.target.value})}/>
        <p>Memory</p> <input type="number" onChange={e => this.setState({memory: e.target.value})}/>
        <p>Storage</p> <input type="text" onChange={e => this.setState({storage: e.target.value})}/>
        <p>Comment</p> <input type="text" onChange={e => this.setState({comment: e.target.value})}/>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default CreateModelForm