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
  };

  mountModelNames = () => {
    // MODEL NAMES
    let dst = '/api/instances/model_names/';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].id, label: res.data[i].vendor + ' ' + res.data[i].model_number });
      }
      //console.log(res.data)
      this.setState({ modelOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  mountRacks = () => {
    // RACK
    let dst = '/api/racks/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].id, label: res.data[i].rack_number });
      }
      //console.log(res.data)
      this.setState({ rackOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }


  componentDidMount() {
    this.mountRacks();
  }
  
  handleChangeRack = selectedRackOption => {
    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
    identifiersCopy.rackID = selectedRackOption.value
    this.setState({
      selectedRackOption, 
      identifiers: identifiersCopy,
    })
  };

  createQuery = () => {
    const { rackStart, rackEnd } = this.state.identifiers;
    let q = '' + 
            'rack_num_start=' + rackStart + '&' + 
            'rack_num_end=' + rackEnd;
    this.setState({ query: q });
    return q;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let stateCopy = Object.assign({}, this.state.identifiers);
    let stateToSend = this.removeEmpty(stateCopy);
    
    console.log(stateToSend)
    console.log(this.createQuery())

    this.props.sendFilterQuery(this.createQuery());
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
          } } />

          <p>Rack End</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.rackEnd = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />
          <input type="submit" value="Apply Filters" />
        </form>
      </div>
    )
  }
}

export default RackFilters