import React, {Component} from 'react'
import axios from 'axios'
import {Autocomplete} from "@material-ui/lab"
import {
  Button, Container, TextField,
  Grid, Input, FormControl, Typography,
  Tooltip, Paper, List,
  ListItem, Card, CardContent
} from "@material-ui/core";
import {Redirect, Link} from 'react-router-dom'
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from '@material-ui/icons/Cancel';
import DatacenterContext from './DatacenterContext';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateChangePlanForm extends Component {

  constructor() {
    super();
    this.state = {
        owner: null,
        name: null,
        datacenter: null,
        datacenterOptions: [],
        selectedDataCenterOption: null,
        redirect: false,
    }
  }

  componentDidMount() {
    this.loadDatacenters();
    this.setState({
      datacenter: '/api/datacenters/'.concat(this.context.datacenter_id).toString().concat('/'),
      owner: this.context.username,
    });
    console.log(this.state.datacenter)
  }

  loadDatacenters = () => {
    const dst = '/api/datacenters/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        //TODO: change value to URL
        myOptions.push({ value: res.data[i].url, label: res.data[i].abbreviation, id: res.data[i].id });
      }
      this.setState({ datacenterOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load owners. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

 
  handleChangeDatacenter = (event, option) => {
    this.setState({ selectedDatacenterOption: option});
    this.setState({ datacenter: option.id});
    console.log(option.id)
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    if (e) e.preventDefault();

    let stateCopy = Object.assign({}, this.state);
    console.log(stateCopy)
    let stateToSend = this.removeEmpty(stateCopy);
    console.log(stateToSend)


    //THE API CALL TO POST
    var self = this;
    axios.post('/api/cp/', stateToSend)
      .then(function (response) {
        alert('Created successfully');
        self.setState({
          redirect: true,
        })
      })
      .catch(function (error) {
        alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
  };

  render() {
    console.log('in create form')


    let defVal;

    if(this.context.datacenter_id === -1){
      defVal = 'Select here.';
      //error check that it's not -1 when sending form
    }
    else{
      defVal = this.context.datacenter_ab;
    }

    return (
      <div>
        {this.state.redirect && <Redirect to={{ pathname: '/changeplans' }} />}
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item alignContent='center' xs={12}/>
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Create Change Plan
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <TextField label='Change Plan Name' type="text" inputProps = {{ maxLength: 50  }} fullWidth onChange={e => {
                    let nameField = e.target.value;
                    this.setState({
                      name: nameField,
                    })
                  }}/>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="datacenter-select"
                    options={this.state.datacenterOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeDatacenter}
                    value={this.state.selectedDatacenterOption}
                    renderInput={params => (
                      <TextField {...params} label="Datacenter" fullWidth />
                    )}
                  />
                </Grid>
                </Grid>
                <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Tooltip title='Submit'>
                    <Button variant="contained" type="submit" color="primary" endIcon={<AddCircleIcon/>}
                            onClick={() => this.handleSubmit}>Create
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={3}>
                  <Link to={'/changeplans'}>
                    <Tooltip title='Cancel'>
                      <Button variant="outlined" type="submit" color="primary" endIcon={<CancelIcon/>}>Cancel</Button>
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

CreateChangePlanForm.contextType = DatacenterContext;

export default CreateChangePlanForm
