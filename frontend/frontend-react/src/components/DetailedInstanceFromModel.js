import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import Button from "reactstrap/es/Button";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DetailedInstanceFromModel extends Component {
  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      instance: 
        {
        }
    }
  }

  loadInstance = () => {
    if (this.props.instanceID !== undefined) {
      let dst = '/api/instances/'.concat(this.props.instanceID).concat('/');
      axios.get(dst).then(res => {
        this.setState({
          instance: res.data
        });
      })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response);
      });
    }
  }

  componentDidMount() {
    this.loadInstance();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.instanceID !== this.props.instanceID) {
      this.loadInstance();
    }

  }

  render() {
    return (
      <div>
        <Button onClick={() => this.props.sendShowTable(true)} >Back</Button>
        <br></br>
        <InstanceCard inst={ this.state.instance } />
      </div>
    )
  }
}

export default DetailedInstanceFromModel
