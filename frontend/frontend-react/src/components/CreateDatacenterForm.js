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

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateDatacenterForm extends Component {

  constructor() {
    super();
    this.state = {
        'id': null,
        'abbreviation': null,
        'name': null,
    }
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
    axios.post('/api/datacenters/', stateToSend)
      .then(function (response) {
        alert('Created successfully');
        window.location = '/datacenters'
      })
      .catch(function (error) {
        alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
  };

  render() {
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item alignContent='center' xs={12}/>
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Create Datacenter
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Datacenter Name' type="text" fullWidth onChange={e => {
                    let nameField = e.target.value;
                    this.setState({
                      name: nameField,
                    })
                  }}/>
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Datacenter Abbreviation' type="text" fullWidth onChange={e => {
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
