import React, { Component } from 'react'

export class DetailedDecommissionedAsset extends Component {
  render() {
    console.log(this.props.match.params)
    return (
      <div>
        <p>Detailed page of ID: {this.props.match.params.id} </p>
      </div>
    )
  }
}

export default DetailedDecommissionedAsset
