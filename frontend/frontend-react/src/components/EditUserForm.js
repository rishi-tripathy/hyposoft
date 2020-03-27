import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import {
  Button, Container, FormLabel, RadioGroup, Radio, TextField,
  Grid, Input, FormControl, FormControlLabel, Typography, Tooltip,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditUserForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      is_admin: false,
      username: '',
      redirect: false,
      hasModelPermission: false,
      hasPowerPermission: false,
      hasAuditPermission: false,


      datacenterOptions: [],
      selectedDatacenterOption: null,
    }
  }

  loadUserPermissions = () => {
    const editID = this.props.match.params.id
    console.log(editID)
    let dst = '/api/users/'.concat(this.props.match.params.id).concat('/');
    axios.get(dst).then(res => {
      console.log(res.data)
      this.setState({
        is_admin: res.data.is_superuser,
        username: res.data.username
      })
    })
      .catch(function (error) {
        alert(JSON.stringify(error.response.data, null, 2));
      });
  }

  loadDatacenters = () => {
    const dst = '/api/datacenters/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        //TODO: change value to URL
        myOptions.push({ value: res.data[i].url, label: res.data[i].abbreviation, id: res.data[i].id });
      }
      let allDCs = { value: null, label: 'ALL', id: -1  };
      myOptions.push(allDCs)
      this.setState({
        datacenterOptions: myOptions,
        // selectedDatacenterOption: {
        //   value: this.state.asset.datacenter ? this.state.asset.datacenter.url : null,
        //   label: this.state.asset.datacenter ? this.state.asset.datacenter.abbreviation : null,
        //   id: this.state.asset.datacenter ? this.state.asset.datacenter.id : null,
        // }
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load owners. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  componentDidMount() {
    this.loadDatacenters();
    this.loadUserPermissions();
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/users/'.concat(this.props.match.params.id).concat('/');

    let stateCopy = Object.assign({}, this.state);

    //stateCopy.is_admin = this.state.is_admin
    console.log(JSON.stringify(stateCopy, null, 2))
    // choke
    // var self = this;
    // axios.patch(dst, stateCopy)
    //   .then(function (response) {
    //     alert('Edit was successful');
    //     self.setState({
    //       redirect: true
    //     })
    //   })
    //   .catch(function (error) {
    //     alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
    //   });
  }


  handleAdminChange = (event) => {
    if (event.target.value === 'true') {
      this.setState({ is_admin: true });
    }
    else {
      this.setState({ is_admin: false });
    }
  };

  handleModelChange = (event) => {
    if (event.target.value === 'true') {
      this.setState({ hasModelPermission: true });
    }
    else {
      this.setState({ hasModelPermission: false });
    }
  };

  handleDatacenterChange = (event, selectedDatacenterOption) => {
    this.setState({ selectedDatacenterOption });
  }

  handlePowerChange = (event) => {
    if (event.target.value === 'true') {
      this.setState({ hasPowerPermission: true });
    }
    else {
      this.setState({ hasPowerPermission: false });
    }
  };

  handleAuditChange = (event) => {
    if (event.target.value === 'true') {
      this.setState({ hasAuditPermission: true });
    }
    else {
      this.setState({ hasAuditPermission: false });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={{ pathname: '/users' }} />

    }
    let header = <Typography variant="h3" gutterBottom>
      Edit User: {this.state.username}
    </Typography>

    console.log(this.state)

    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  {header}
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Permissions</FormLabel>
                    <RadioGroup aria-label="permissions" name="permissions" value={this.state.is_admin.toString()}
                      onChange={this.handleAdminChange}>
                      <FormControlLabel value='true' control={<Radio />} label="Administrator" />
                      <FormControlLabel value='false' control={<Radio />} label="User" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {
                    !this.state.is_admin ? (
                      <div>
                        <Grid item xs={4}>
                          <FormLabel component="legend">Model Permissions</FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <FormControl component="fieldset">
                            <RadioGroup aria-label="modelPermissions" name="modelPermissions" value={this.state.hasModelPermission.toString()}
                              onChange={this.handleModelChange}>
                              <FormControlLabel value='true' control={<Radio />} label="On" />
                              <FormControlLabel value='false' control={<Radio />} label="Off" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <FormLabel component="legend">Asset Permissions</FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <Autocomplete
                            autoComplete
                            autoHighlight
                            autoSelect
                            id="datacenter-select"
                            options={this.state.datacenterOptions}
                            getOptionLabel={option => option.label}
                            onChange={this.handleDatacenterChange}
                            value={this.state.selectedDatacenterOption}
                            renderInput={params => (
                              <TextField {...params} label="Datacenter" fullWidth />
                            )}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <FormLabel component="legend">Power Permissions</FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <FormControl component="fieldset">
                            <RadioGroup aria-label="powerPermissions" name="powerPermissions" value={this.state.hasPowerPermission.toString()}
                              onChange={this.handlePowerChange}>
                              <FormControlLabel value='true' control={<Radio />} label="On" />
                              <FormControlLabel value='false' control={<Radio />} label="Off" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <FormLabel component="legend">Audit Permissions</FormLabel>
                        </Grid>
                        <Grid item xs={8}>
                          <FormControl component="fieldset">
                            <RadioGroup aria-label="auditPermissions" name="auditPermissions" value={this.state.hasAuditPermission.toString()}
                              onChange={this.handleAuditChange}>
                              <FormControlLabel value='true' control={<Radio />} label="On" />
                              <FormControlLabel value='false' control={<Radio />} label="Off" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </div>
                    )
                      : <div></div>
                  }
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title='Submit'>
                    <Button variant="contained" type="submit" color="primary"
                      onClick={() => this.handleSubmit}>Update
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={2}>
                  <Link to={'/users'}>
                    <Tooltip title='Cancel'>
                      <Button variant="outlined" type="submit" color="primary" endIcon={<CancelIcon />}>Cancel</Button>
                    </Tooltip>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Container>
      </div>
    )
  }
}


export default EditUserForm
