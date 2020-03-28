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

export class CreateChangePlanForm extends Component {

  constructor() {
    super();
    this.state = {
        'id': null,
        'name': null,
        'datacenter': null,
    }
  }

  componentDidMount() {
    this.loadDatacenters();
    this.setState({
      datacenter: '/api/datacenters/'.concat(this.context.datacenter_id).toString().concat('/'),
    })
    console.log(this.state.datacenter)
  }

  loadDatacenters = () => {
    // DCs
    let dst = '/api/datacenters/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      let myIds = [];
      let myIdMap = [];
      for(var i = 0; i < res.data.length; i++) {
        myOptions.push(res.data[i].abbreviation);
        myIds.push(res.data[i].id);
        var obj = {id: res.data[i].id, datacenter: res.data[i].abbreviation};

        myIdMap.push(obj);
      }
      this.setState({
        datacenterOptions: myOptions,
        datacenterToIdMap: myIdMap,
      });

    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not datacenters.\n' + JSON.stringify(error.response.data.result, null, 2));
      });
  }

  handleChangeDatacenter = (event, selectedDataCenterOption) => {
    if(selectedDataCenterOption!== null || selectedDataCenterOption!== undefined ){
      // console.log((this.state.datacenterToIdMap.find(x => x.datacenter === selectedDataCenterOption)))
      let id = this.state.datacenterToIdMap.find(x => x.datacenter === selectedDataCenterOption);
      if(id=== null || id=== undefined){
        //do nothing (doesn't work flipped idk why JS shit)
      }
      else{
        let dc = '/api/datacenters/'.concat(id.id).concat('/');
        this.setState({datacenter: dc});
      }
    }
  };

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
                <Grid item xs={3}>
                  <Autocomplete
                    freeSolo
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="rack-datacenter-select"
                    noOptionsText={"Create New in DC tab"}
                    options={this.state.datacenterOptions}
                    onInputChange={this.handleChangeDatacenter}
                    defaultValue={defVal}
                    renderInput={params => (
                      <TextField {...params} label="Datacenter" fullWidth/>
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

export default CreateChangePlanForm
