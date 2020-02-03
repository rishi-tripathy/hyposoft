import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RackFilters extends Component {
  
  constructor() {
    super();
    this.state = {
      identifiers: {
        rackStart: '',
        rackEnd: '',
      }, 
      query: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
    }

  createQuery = () => {
    const { rackStart, rackEnd } = this.state.identifiers;
    let q = '' + 
            'rack_num_start=' + rackStart + '&' + 
            'rack_num_end=' + rackEnd;
      console.log(q)
    this.setState({ query: q });
    console.log(this.state.query);
    return q;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let stateCopy = Object.assign({}, this.state.identifiers);
    let stateToSend = this.removeEmpty(stateCopy);
    
    console.log(stateToSend)

    this.props.sendFilterQuery(this.createQuery());
    console.log(this.createQuery())
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h4>Rack Filters</h4>
          <p>Rack Start</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.rackStart = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
            console.log(this.state);
          } } />

          <p>Rack End</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.rackEnd = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
            console.log(this.state);

          } } />
          <input type="submit" value="Apply Filters" />
        </form>
      </div>
    )
  }
}

export default RackFilters