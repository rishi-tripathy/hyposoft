import React, { Component } from 'react'
import Popup from "reactjs-popup";
import axios from 'axios'

export class DetailedInstanceModal extends Component {

  constructor() {
    super();
    this.out = '';
  }

  componentDidMount() {
    let dst = '/api/instances/'.concat(this.props.instanceID).concat('/');
      console.log('dst is: ' + dst);
      axios.get(dst).then(res => {
        this.out = res.data;
      });
  }

  render() {
    console.log('prop id: ' + this.props.instanceID);
    return (
      <div><p>{this.out}</p></div>
    )
  }
}

export default DetailedInstanceModal
