import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import {
  Button, Container, FormLabel, RadioGroup, Radio, TextField, Paper,
  Grid, Input, FormControl, FormControlLabel, Typography, Tooltip,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import DualListBox from 'react-dual-listbox';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import DatacenterContext from './DatacenterContext';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import { jsonToHumanText } from './Helpers'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

const options = [
  { value: 'one', label: 'Option One' },
  { value: 'two', label: 'Option Two' },
];


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

      hasGlobalAssetPermission: false,

      datacenterOptions: [],

      offlineStorageSiteOptions: [],

      // this is the DC permissions
      selectedDatacenterOption: [],

      //selectedDatacenterDualListOption: [],
    }
  }


  loadUserInfo = () => {

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


  loadUserPermissions = () => {
    const editID = this.props.match.params.id
    let dst = '/all-permissions/?id='.concat(this.props.match.params.id);
    axios.get(dst).then(res => {
      console.log(res.data)
      this.setState({
        hasModelPermission: res.data.model_permission,
        hasPowerPermission: res.data.power_permission,
        hasAuditPermission: res.data.log_permission,
        //hasGlobalAssetPermission: res.data.global_asset,
        selectedDatacenterOption: res.data.asset_permission,
      })
    })
      .catch(function (error) {
        alert(JSON.stringify(error.response.data, null, 2));
      });
  }


  loadDatacenters = () => {
    const dst = '/api/datacenters/?show_all=true';
    axios.get(dst).then(res => {
      let myDcOptions = [];
      let myOsOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        //TODO: change value to URL -- i think this is Michae'ls todo

        if (res.data[i].is_offline) {
          myOsOptions.push({ value: res.data[i].id, label: res.data[i].abbreviation });
        }
        else {
          myDcOptions.push({ value: res.data[i].id, label: res.data[i].abbreviation });

        }
      }
      // let allDCs = { value: null, label: 'ALL', id: -1 };
      // myOptions.push(allDCs)
      this.setState({
        datacenterOptions: myDcOptions,
        offlineStorageSiteOptions: myOsOptions,
        // selectedDatacenterOption: {
        //   value: this.state.asset.datacenter ? this.state.asset.datacenter.url : null,
        //   label: this.state.asset.datacenter ? this.state.asset.datacenter.abbreviation : null,
        //   id: this.state.asset.datacenter ? this.state.asset.datacenter.id : null,
        // }
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load owners. Re-login.\n');
      });
  }

  componentDidMount() {
    this.loadDatacenters();
    this.loadUserInfo();
    this.loadUserPermissions();
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  postPermissions = () => {
    let obj = {}
    obj.model = this.state.hasModelPermission.toString();
    obj.asset = this.state.selectedDatacenterOption;
    obj.power = this.state.hasPowerPermission.toString();
    obj.log = this.state.hasAuditPermission.toString();
    obj.global_asset = this.state.hasGlobalAssetPermission.toString();

    obj.username = this.state.username;

    console.log(JSON.stringify(obj, null, 2))
    let self = this
    axios.post('/update-permissions/', obj)
      .then(function (response) {
        alert('Permissions successfully updated');
      })
      .catch(function (error) {
        alert('Permissions were not updated.\n' + JSON.stringify(error.response.data, null, 2));
      });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/users/'.concat(this.props.match.params.id).concat('/update_super_status/');

    let stateCopy = Object.assign({}, this.state);

    stateCopy.is_superuser = this.state.is_admin
    this.postPermissions();
    //console.log(JSON.stringify(stateCopy, null, 2))
    // choke
    var self = this;
    axios.post(dst, stateCopy)
      .then(function (response) {
        alert('Edit was successful.');
        // window.location = '/assets'
        self.setState({
          redirect: true,
        })
      })
      .catch(function (error) {
        alert('Edit was not successful.\n' + jsonToHumanText(error.response.data));
      });

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

  handleDatacenterChange = (selectedDatacenterOption) => {
    this.setState({ selectedDatacenterOption });
  }

  // handleDatacenterDualListChange = (selectedDatacenterDualListOption) => {
  //   this.setState({ selectedDatacenterDualListOption });
  // };

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

  handleGlobalAssetPermissionChange = (event) => {
    if (event.target.value === 'true') {
      this.setState({ hasGlobalAssetPermission: true });
    }
    else {
      this.setState({ hasGlobalAssetPermission: false });
    }
  }

  render() {
    console.log(this.state)
    if (this.state.redirect) {
      return <Redirect to={{ pathname: '/users' }} />

    }
    let header = <Typography variant="h3" gutterBottom>
      Edit User: {this.state.username}
    </Typography>

    console.log(this.state)

    let groupedOptions = [
      {
        label: 'Datacenters',
        options: this.state.datacenterOptions,
      },
      {
        label: 'Offline Storage Centers',
        //TODO: change below to oss
        options: this.state.offlineStorageSiteOptions,
      }
    ]

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
                    <FormLabel component="legend">
                      <Typography variant="h6" gutterBottom>
                        Administrator Permissions
                      </Typography>
                    </FormLabel>
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
                        <Grid container spacing={3}>
                          <Grid item alignContent='center' xs={4}>
                            <FormLabel component="legend">
                              <Typography variant="h6" gutterBottom>
                                Model Permission
                            </Typography>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={4}>
                            <FormControl component="fieldset">
                              <RadioGroup aria-label="modelPermissions" name="modelPermissions" value={this.state.hasModelPermission.toString()}
                                onChange={this.handleModelChange}>
                                <FormControlLabel value='true' control={<Radio />} label="On" />
                                <FormControlLabel value='false' control={<Radio />} label="Off" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                          </Grid>
                          <Grid item alignContent='center' xs={4}>
                            <FormLabel component="legend">
                              <Typography variant="h6" gutterBottom>
                                Asset Permission
                            </Typography>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={3}>
                            <FormControl component="fieldset">
                              <RadioGroup aria-label="globalAssetPermissions" name="globalAssetPermissions" value={this.state.hasGlobalAssetPermission.toString()}
                                onChange={this.handleGlobalAssetPermissionChange}>
                                <FormControlLabel value='true' control={<Radio />} label="Global" />
                                <FormControlLabel value='false' control={<Radio />} label="Per DC" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={5}>
                            {
                              !this.state.hasGlobalAssetPermission ? (
                                <DualListBox
                                  options={groupedOptions}
                                  selected={this.state.selectedDatacenterOption}
                                  onChange={this.handleDatacenterChange}
                                  icons={{

                                    moveLeft: <ChevronLeftIcon />,
                                    moveAllLeft: [
                                      <FirstPageIcon />
                                    ],
                                    moveRight: <ChevronRightIcon />,
                                    moveAllRight: [
                                      <LastPageIcon />
                                    ],
                                    moveDown: <span className="fa fa-chevron-down" />,
                                    moveUp: <span className="fa fa-chevron-up" />,
                                  }}
                                />
                              ) : (
                                  <div>
                                  </div>
                                )
                            }
                          </Grid>
                          {/* <Grid item xs={4}>
                            </Grid> */}
                          <Grid item alignContent='center' xs={4}>
                            <FormLabel component="legend">
                              <Typography variant="h6" gutterBottom>
                                Power Permission
                            </Typography>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={4}>
                            <FormControl component="fieldset">
                              <RadioGroup aria-label="powerPermissions" name="powerPermissions" value={this.state.hasPowerPermission.toString()}
                                onChange={this.handlePowerChange}>
                                <FormControlLabel value='true' control={<Radio />} label="On" />
                                <FormControlLabel value='false' control={<Radio />} label="Off" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                          </Grid>
                          <Grid item alignContent='center' xs={4}>
                            <FormLabel component="legend">
                              <Typography variant="h6" gutterBottom>
                                Audit Permission
                            </Typography>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={4}>
                            <FormControl component="fieldset">
                              <RadioGroup aria-label="auditPermissions" name="auditPermissions" value={this.state.hasAuditPermission.toString()}
                                onChange={this.handleAuditChange}>
                                <FormControlLabel value='true' control={<Radio />} label="On" />
                                <FormControlLabel value='false' control={<Radio />} label="Off" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                          </Grid>
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

EditUserForm.contextType = DatacenterContext;

export default EditUserForm
