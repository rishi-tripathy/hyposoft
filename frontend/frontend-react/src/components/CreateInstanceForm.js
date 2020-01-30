import React, { Component } from 'react'

export class CreateInstanceForm extends Component {
  
  constructor() {
    super();
    this.state = {

    }
  }
  
  
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Create Instance Form</h3>
        {/* <p>Model</p> <input type="text" onChange={e => this.setState({model: e.target.value})} /> */}
        
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default CreateInstanceForm
