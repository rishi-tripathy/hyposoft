import React, {Component} from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import {Button, Grid, TextField} from "@material-ui/core";
import {Link} from 'react-router-dom'

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
        alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
    this.props.sendShowTable(true);
  }

  componentDidMount() {
    let dst = '/api/racks/'.concat(this.props.match.params.id).concat('/');
    axios.get(dst).then(res => {
      this.setState({rack_number: res.data.rack_number});
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
              <h1>Update Rack</h1>
            </Grid>
            <Grid item xs={6}>
              <TextField shrink label='Updated Rack Number' type="text" fullWidth value={this.state.rack_number}
                         onChange={e => this.setState({rack_number: e.target.value})}/>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" type="submit" color="primary"
                      onClick={() => this.handleSubmit}>Update</Button>{' '}
            </Grid>
            <Grid item xs={6}>
               <Link to='/racks/'><Button variant="outlined">Cancel</Button>{' '}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    )
  }
}

EditRackForm.propTypes = {
  editID: PropTypes.object.isRequired
}

export default EditRackForm
