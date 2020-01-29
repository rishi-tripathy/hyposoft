import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';

export class DetailedInstance extends Component {

  constructor() {
    super();
    this.state = {
      instance: ''
    }
  }

  componentDidMount() {
    let dst = '/api/instances/'.concat(this.props.instanceID).concat('/');
    axios.get(dst).then(res => {
      this.setState({
        instance: res.data
      });
    });
  }

  render() {
    return (
      <div>
        <p>individual instance here</p>
        <p>{ this.props.instanceID }</p>
        <InstanceCard inst={ this.state.instance } />
      </div>
    )
  }
}

export default DetailedInstance
