import React, {Component} from 'react'
import axios from 'axios'
import {Button, Container, TextField, Grid, Input, FormControl, Typography} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditInstanceForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      instance: {
        'model': null,
        'hostname': null,
        'rack': null,
        'rack_u': null,
        'owner': null,
        'comment': null,
      },
      modelOptions: [],
      selectedModelOption: null,

      rackOptions: [],
      selectedRackOption: null,

      ownerOptions: [],
      selectedOwnerOption: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  loadInstance = () => {
    let dst = '/api/instances/'.concat(this.props.editID).concat('/');
    axios.get(dst).then(res => {
      let instanceCopy = JSON.parse(JSON.stringify(this.state.instance));
      instanceCopy.model = res.data.model;
      instanceCopy.hostname = res.data.hostname;
      instanceCopy.rack = res.data.rack;
      instanceCopy.rack_u = res.data.rack_u;
      instanceCopy.owner = res.data.owner;
      instanceCopy.comment = res.data.comment;
      this.setState({
        instance: instanceCopy,
      })
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadModels = () => {
    // MODEL
    let dst = '/api/instances/model_names/';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({value: res.data[i].url, label: res.data[i].vendor + ' ' + res.data[i].model_number});
      }
      this.setState({
        modelOptions: myOptions,
        selectedModelOption: {
          value: this.state.instance.model.url,
          label: this.state.instance.model.vendor + ' ' + this.state.instance.model.model_number
        }
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadRacks = () => {
    // RACK
    let dst = '/api/racks/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({value: res.data[i].url, label: res.data[i].rack_number});
      }
      this.setState({
        rackOptions: myOptions,
        selectedRackOption: {value: this.state.instance.rack.url, label: this.state.instance.rack.rack_number},
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadOwners = () => {
    // OWNER
    let dst = '/api/users/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({value: res.data[i].url, label: res.data[i].username});
      }
      this.setState({
        ownerOptions: myOptions,
        selectedOwnerOption: {
          value: this.state.instance.owner ? this.state.instance.owner.url : null,
          label: this.state.instance.owner ? this.state.instance.owner.username : null
        },
      });
    })
      .catch(function (error) {
        // TODO: handle error
        //alert('Cannot load. Re-login.\n' + JSON.stringify(error.response, null, 2));
      });
  }



  componentDidMount() {
    const delay = 50;
    this.loadInstance();
    console.log(this.state.instance)
    setTimeout(() => {
      this.loadModels();
      this.loadRacks();
      this.loadOwners();
    }, delay);


  }

  handleChangeModel = selectedModelOption => {
    this.setState({selectedModelOption});
  };

  handleChangeRack = selectedRackOption => {
    this.setState({selectedRackOption});
  };

  handleChangeOwner = selectedOwnerOption => {
    this.setState({selectedOwnerOption});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/instances/'.concat(this.props.editID).concat('/');

    let stateCopy = Object.assign({}, this.state.instance);

    stateCopy.owner = this.state.selectedOwnerOption ? this.state.selectedOwnerOption.value : null;

    let stateToSend = this.removeEmpty(stateCopy);
    console.log(stateToSend)

    axios.put(dst, stateToSend)
      .then(function (response) {
        alert('Edit was successful');
        window.location = '/assets'
      })
      .catch(function (error) {
        alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  render() {
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Edit Instance
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    autoComplete
                    autoHighlight
                    autoSelect
                    shrink
                    id="instance-model-edit-select"
                    options={this.state.modelOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeModel}
                    value={this.state.instance.model.label}
                    renderInput={params => (
                      <TextField {...params} label="Model" fullWidth/>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Hostname' type="text"
                             InputLabelProps={{shrink: true}}
                             fullWidth
                             value={this.state.instance.hostname}
                             onChange={e => {
                               let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                               instanceCopy.hostname = e.target.value
                               this.setState({
                                 instance: instanceCopy
                               })
                             }}/>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    id="instance-rack-edit-select"
                    autoComplete
                    autoHighlight
                    autoSelect
                    shrink
                    InputLabelProps={{shrink: true}}
                    options={this.state.rackOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeRack}
                    value={this.state.instance.rack.label}
                    renderInput={params => (
                      <TextField {...params} label="Rack" fullWidth/>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  < TextField label="Rack U"
                              fullWidth
                              InputLabelProps={{shrink: true}}
                              type="number"
                              value={this.state.instance.rack_u}
                              onChange={e => {
                                let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                                instanceCopy.rack_u = e.target.value
                                this.setState({
                                  instance: instanceCopy
                                })
                              }}/>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    id="instance-owner-select"
                    shrink
                    options={this.state.ownerOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeOwner}
                    value={this.state.instance.owner}
                    renderInput={params => (
                      <TextField {...params} label="Owner" fullWidth/>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Comment"
                             fullWidth
                             multiline
                             InputLabelProps={{shrink: true}}
                             value={this.state.instance.comment}
                             rows="4"
                             type="text"
                             onChange={e => {
                               let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                               instanceCopy.comment = e.target.value
                               this.setState({
                                 instance: instanceCopy
                               })
                             }}/>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" type="submit" color="primary" onClick={() => this.handleSubmit}>Update
                    +</Button>{' '}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Container>
      </div>
  )
  }
  }

  export default EditInstanceForm
