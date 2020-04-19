import React, {Component} from 'react'
import axios from 'axios'
import {
  Button, Container, TextField,
  Grid, Input, FormControl, FormControlLabel, RadioGroup, 
  Radio, Typography, Tooltip
} from "@material-ui/core";
import {Redirect, Link} from 'react-router-dom'
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from '@material-ui/icons/Cancel';
import DatacenterContext from './DatacenterContext';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateDatacenterForm extends Component {

  constructor() {
    super();
    this.state = {
        'id': null,
        'abbreviation': null,
        'name': null,
        redirect: false,
        is_offline: true,
    }
  }
  componentDidMount() {
    this.setState({
      redirect: false,
    })
    console.log(this.state.redirect)
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleDatacenterBooleanChange = (event) => {
    if (event.target.value === 'false') {
      this.setState({ is_offline: false });
    }
    else {
      this.setState({ is_offline: true });
    }
  };

  handleSubmit = (e) => {
    if (e) e.preventDefault();

    let stateCopy = Object.assign({}, this.state);
    console.log(stateCopy)
    let stateToSend = this.removeEmpty(stateCopy);
    console.log(stateToSend)


    //THE API CALL TO POST
    var self = this;
    axios.post('/api/datacenters/', stateToSend)
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
    console.log(this.state.redirect);
    return (
      <div>
        {/* {this.state.redirect && <Redirect to = {{pathname: '/datacenters/'}} />} */}
        {this.state.redirect &&<Redirect to = {{pathname: '/datacenters/', state: this.state.redirect }}/>}

        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item alignContent='center' xs={12}/>
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Create Datacenter or Offline Storage Site
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup aria-label="permissions" name="datacenter-or-storage" value={this.state.is_offline.toString()}
                      onChange={this.handleDatacenterBooleanChange}>
                      <FormControlLabel value='false' control={<Radio />} label="Datacenter" />
                      <FormControlLabel value='true' control={<Radio />} label="Offline Storage Site" />
                    </RadioGroup>
                  </FormControl>
                  </Grid>
                <Grid item xs={4}>
                  <TextField label='Name' type="text" inputProps = {{ maxLength: 50  }} fullWidth onChange={e => {
                    let nameField = e.target.value;
                    this.setState({
                      name: nameField,
                    })
                  }}/>
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Abbreviation' type="text"  inputProps = {{ maxLength: 6}} fullWidth onChange={e => {
                    let abbreviationField = e.target.value;
                    this.setState({
                      abbreviation: abbreviationField,
                    })
                  }}/>{' '}
                </Grid>
                </Grid>
                <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Tooltip title='Submit'>
                    <Button variant="contained" type="submit" color="primary" endIcon={<AddCircleIcon/>}
                            onClick={() => this.handleSubmit}>Create
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <Link to={'/datacenters'}>
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

export default CreateDatacenterForm
