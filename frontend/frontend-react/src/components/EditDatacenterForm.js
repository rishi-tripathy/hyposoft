import React, {Component} from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import {Button, Grid, TextField} from "@material-ui/core";
import {Link} from 'react-router-dom'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditDatacenterForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'id': null,
      'name': null,
      'abbreviation': null,
    }
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/datacenters/'.concat(this.props.editID).concat('/');

    let stateCopy = Object.assign({}, this.state);
    let stateToSend = this.removeEmpty(stateCopy);

    axios.put(dst, stateToSend)
      .then(function (response) {
        alert('Edit was successful');
      })
      .catch(function (error) {
        alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  componentDidMount() {
    let dst = '/api/datacenters/'.concat(this.props.match.params.id).concat('/');
    axios.get(dst).then(res => {
    console.log(res);
      this.setState({
          id: res.data.id,
          name: res.data.name,
          abbreviation: res.data.abbreviation,
    });
      //would not change instances
    })
      .then(function (response) {
      })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response);
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h1>Update Datacenter</h1>
            </Grid>
            <Grid item xs={6}>
              <TextField shrink label='Updated Name' type="text" fullWidth value={this.state.name}
                         onChange={e => this.setState({name: e.target.value})}/>
            </Grid>
            <Grid item xs={6}>
              <TextField shrink label='Updated Abbreviation' type="text" fullWidth value={this.state.abbreviation}
                         onChange={e => this.setState({abbreviation: e.target.value})}/>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" type="submit" color="primary"
                      onClick={() => this.handleSubmit}>Update</Button>{' '}
            </Grid>
            <Grid item xs={6}>
               <Link to='/datacenters/'><Button variant="outlined">Cancel</Button>{' '}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    )
  }
}

EditDatacenterForm.propTypes = {
  editID: PropTypes.object.isRequired
}

export default EditDatacenterForm
