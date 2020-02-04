import React, { Component } from 'react'
import axios from 'axios'
import Button from "reactstrap/es/Button";
import ModelCard from './ModelCard';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DetailedModelFromInstance extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      model: 
        {
        }
    }
  }

  loadModel = () => {
    if (this.props.modelURL !== undefined) {
      // let dst = '/api/models/'.concat(this.props.modelID).concat('/');
      axios.get(this.props.modelURL).then(res => {
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
    this.loadModel();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.modelURL !== this.props.modelURL) {
      this.loadModel();
    }

  }

  render() {
    const { id, vendor, model_number, height, display_color, ethernet_ports, power_ports, cpu, memory, storage, comment } = this.state.model;

    return (
      <div>
        <div>
          {/* <Button onClick={() => this.props.sendShowTable(true)} >Back</Button> */}
          <br></br>
          <div class="card">
            <div class="container">
              <h3>Detailed Model</h3>
              <h4>ID: {id}</h4>
              <h4>Vendor: {vendor}</h4>
              <p>Model Number: {model_number}</p> 
              <p>Height: {height}</p> 
              <p>Display Color: {display_color} 
                <div style={{
                  width: 12,
                  height: 12,
                  backgroundColor: '#' + display_color,
                  left: 5,
                  top: 5,
                  }}>
                </div>
              </p> 
              <p>Ethernet Ports: {ethernet_ports}</p> 
              <p>Power Ports: {power_ports}</p> 
              <p>CPU: {cpu}</p> 
              <p>Memory: {memory}</p> 
              <p>Storage: {storage}</p> 
              <p>Comment: {comment}</p> 
              {/* <DetailedModelModal modelURL={model.url} /> */}
              {/* <button onClick={ this.showModel }>See Detailed Model</button> */}
            </div>
          </div>
          
        </div>
      </div>
    )
  }
}

export default DetailedModelFromInstance
