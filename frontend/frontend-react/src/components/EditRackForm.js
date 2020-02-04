import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditRackForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'rack_number': null,
    }
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/racks/'.concat(this.props.editID).concat('/');

    let stateCopy = Object.assign({}, this.state);
    let stateToSend = this.removeEmpty(stateCopy);
    
    axios.put(dst, stateToSend)
    .then(function (response) {
      alert('Edit was successful');
    })
    .catch(function (error) {
      alert('Edit was not successful.\n' + JSON.stringify(error.response.data));
    });
  }

  componentDidMount() {
    let dst = '/api/racks/'.concat(this.props.editID).concat('/');
    axios.get(dst).then(res => {
      //console.log('racks edit form results ' + res);
      this.setState({ rack_number: res.data.rack_number });
      //would not change instances
    })
    .then(function (response) {
      //console.log(response);
    })
    .catch(function (error) {
      // TODO: handle error
     // console.log(error.response);
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Edit Rack Form</h3>
        <p>Rack Number</p> <input type="text" value={this.state.rack_number} onChange={e => this.setState({rack_number: e.target.value})} />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

EditRackForm.propTypes = {
  editID: PropTypes.object.isRequired
}

export default EditRackForm
