import React, {Component} from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import {Button, Grid, TextField} from "@material-ui/core";
import {Link, Redirect} from 'react-router-dom'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditDatacenterForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'id': null,
      'name': null,
      'url': null,
      'abbreviation': null,
      isOffline: false,
      redirect: false,
    }
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/datacenters/'.concat(this.props.match.params.id).concat('/');

    let stateCopy = Object.assign({}, this.state);
    let stateToSend = this.removeEmpty(stateCopy);
    var self = this;
    axios.put(dst, stateToSend)
      .then(function (response) {
        alert('Edit was successful');
        window.location = '/datacenters'
        // self.setState({
        //   redirect: true,
        // })
      })
      .catch(function (error) {
        alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  componentDidMount() {
    console.log(this.props.match.params.id )
    let dst = '/api/datacenters/'.concat(this.props.match.params.id).concat('/');
    axios.get(dst).then(res => {
    console.log(res);
      this.setState({
          id: res.data.id,
          name: res.data.name,
          isOffline: res.data.is_offline,
          abbreviation: res.data.abbreviation,
          url: '/api/dataceters/' + this.props.match.params.id +'/'
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
    let title = 'Update Datacenter';
    if(this.state.isOffline){
      title = "Update Offline Storage Site"
    }
    return (
      <div>
        {this.state.redirect && <Redirect to={{pathname:'/datacenters'}}/>}
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h1>{title}</h1>
            </Grid>
            <Grid item xs={6}>
              <TextField shrink label='Updated Name' type="text" inputProps = {{ maxLength: 50}} fullWidth value={this.state.name}
                         onChange={e => this.setState({name: e.target.value})}/>
            </Grid>
            <Grid item xs={6}>
              <TextField shrink label='Updated Abbreviation' type="text" inputProps = {{ maxLength: 6}} fullWidth value={this.state.abbreviation}
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
