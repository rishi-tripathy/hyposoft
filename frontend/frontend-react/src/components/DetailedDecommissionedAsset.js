import React, { Component } from 'react'
import axios from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DetailedDecommissionedAsset extends Component {

  constructor() {
    super();
    this.state = {
      decommissionedAsset: null,
    }
  }

  loadDecommissionedAsset = () => {
    if (this.props.match.params.id) {
      let dst = '/api/decommissioned/'.concat(this.props.match.params.id).concat('/');
      axios.get(dst).then(res => {
        this.setState({
          decommissionedAsset: res.data
        });
      })
        .catch(function (error) {
          // TODO: handle error
          alert('Cannot load decommissioned assets. Re-login.\n' + JSON.stringify(error.response, null, 2));
        });
    }
  }

  componentDidMount() {
    this.loadDecommissionedAsset();
  }

  render() {
    console.log(JSON.stringify(this.state.decommissionedAsset, null, 2))
    return (
      <div>
        <p>Detailed page of ID: {this.props.match.params.id} </p>
      </div>
    )
  }
}

export default DetailedDecommissionedAsset
