import React, { Component } from 'react'
import Popup from "reactjs-popup";
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DetailedModelModal extends Component {

  constructor() {
    super();

    this.state = {
      model : {
        'id': 10,
        'vendor': 'dell',
        'model_number': 'df',
        'height': 2,
        'display_color': 'adf',
        'ethernet_ports': null,
        'power_ports': null,
        'cpu': '',
        'memory': null,
        'storage': '',
        'comment': 'sdfsda'
      }
    }
  }

  componentDidMount() {
    axios.get(this.props.modelURL).then(res => {
      const b = res.data;
      this.setState({ model: b });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  render() {

    const { id, vendor, model_number, height, 
            display_color, ethernet_ports, power_ports,
            cpu, memory, storage, comment } = this.state.model;
    return (
      <div>
        <Popup trigger={<button>See Model Details</button>} position="right center">
          {close => (
            <div className="modal">
              <a className="close" onClick={close}> &times; </a>
              <div className="header"> Model Details </div>
              <div className="content">
                <h4>ID: {id}</h4>
                <h4>Vendor: {vendor}</h4>
                <p>Model Number: {model_number}</p> 
                <p>Height: {height}</p> 
                <p>Display Color: {display_color}</p> 
                <p>Ethernet Ports: {ethernet_ports}</p> 
                <p>Power Ports: {power_ports}</p> 
                <p>CPU: {cpu}</p> 
                <p>Memory: {memory}</p> 
                <p>Storage: {storage}</p> 
                <p>Comment: {comment}</p> 
              </div>
              <div className="actions">
                <button className="button"
                  onClick={() => {
                    console.log("modal closed ");
                    close();
                  }}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    )
  }
}

export default DetailedModelModal

