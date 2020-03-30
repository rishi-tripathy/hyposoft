import React, { Component } from 'react'
import axios from 'axios'
import {
  Typography, Tooltip, Dialog, DialogTitle, DialogContent, Container, Grid, Button, TextField, IconButton, CircularProgress
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import { Link, Redirect } from 'react-router-dom'
import ChangePlanAssetTable from './ChangePlanAssetTable'
import DatacenterContext from './DatacenterContext';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Autocomplete } from "@material-ui/lab"


axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedChangePlan extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      id: null,
      owner: null,
      name: null,
      changedName: null,
      datacenter: null,
      datacenterAbbreviation: null,
      executed: null,
      showDialog: false,
      assetOptions: [],
      assets_cp: [],
      existingAssetSelected: {
        id: null,
      },
      showEditModal: false,
      redirect: false,
      selectedAsset: null,
      spinnerSpinning: false,
      exSpinnerSpinning: false,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.getChangePlanDetails();
  }

  getChangePlanDetails = () => {
    console.log(this.context.user_id)
    if (this.props.match.params.id) {
      let dst = '/api/cp/'.concat(this.props.match.params.id).concat('/');
      axios.get(dst).then(res => {
        var assets_arr = [];
        res.data.assets_cp.map((ass, index) => {
          assets_arr.push(ass);
        });

        this.setState({
          id: res.data.id,
          name: res.data.name,
          owner: this.context.user_id,
          changedName: res.data.name,
          datacenter: res.data.datacenter,
          executed: res.data.executed,
          assets_cp: assets_arr,
        });

        let dst2 = '/api/datacenters/' + res.data.datacenter + '/';
        axios.get(dst2).then(res2 => {
          console.log(res2)
          this.setState({
            datacenterAbbreviation: res2.data.abbreviation,
          })
        })
        .catch(function (error1) {
          console.log(error1.response)
          alert('Cannot load. Re-login.\n' + JSON.stringify(error1.response.data, null, 2));
        });
  })
  .catch(function (error) {
    // TODO: handle error
    alert('Could not load owners. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
  });
  }
  }

  open = () => {
    this.setState({
      showDialog: true,
    });
    //need to get existing assets bc modal open
    this.loadExistingAssetsInDatacenter();
  }

  close = () => {
    this.setState({
      showDialog: false,
    });
  }

  loadExistingAssetsInDatacenter= () => {
    //get assets from dc
    let dst = '/api/assets/?datacenter=' + this.state.datacenter + '&show_all=true';
    console.log(dst)

    axios.get(dst).then(res => {
      console.log(res)
      this.setState({
        assetOptions: res.data,
      })

      console.log(this.state.assetOptions)

    })
    .catch(function (error) {
      console.log(error.response)
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  getDatacenterAbbreviation = () => {
    let dst = '/api/datacenters/' + this.state.datacenter + '/';
    axios.get(dst).then(res => {
      console.log(res)
      this.setState({
        datacenterAbbreviation: res.abbreviation,
      })
    })
  }

  showEditForm = () => {
    this.setState({
      showEditModal: true,
    })
  }

  hideEditForm = () => {
    this.setState({
      showEditModal: false,
    })
  }

  handleChangeAsset = (event, selectedAsset) => {
    //do later when string stuff is fixed 
    console.log(selectedAsset)
    var obj = {id: selectedAsset.id}
    this.setState({
      existingAssetSelected: obj,
    });
    console.log(this.state)
  }

  submitEditName = (e) => {
    this.setState({
      name: this.state.changedName,
    })
      e.preventDefault();
      let dst = '/api/cp/'.concat(this.props.match.params.id).concat('/');
  
      let stateCopy = Object.assign({}, this.state);
      let stateToSend = this.removeEmpty(stateCopy);
      console.log(stateToSend)
      var self = this;
      axios.put(dst, stateToSend)
        .then(function (response) {
          alert('Edit was successful');
          self.setState({
            showEditModal: false,
            redirect: true,
          })
        })
        .catch(function (error) {
          alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
        });
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  }

  validateCP = () => {
    let dst='/api/cp/'.concat(this.props.match.params.id).concat('/validate/');
    this.setState({
      spinnerSpinning: true,
    });

    axios.get(dst).then(res => {
      this.setState({
        spinnerSpinning: false,
      })
      alert('Validation Successful');
    })
    .catch(function (error) {
      console.log(error)
      this.setState({
        spinnerSpinning: false,
      })
      alert('Conflicts found:\n'+ JSON.stringify(error.response.data));
      
    })
  }

  executeCP = () => {
    let dst='/api/cp/'.concat(this.props.match.params.id).concat('/execute/');
    this.setState({
      exSpinnerSpinning: true,
    });

    axios.get(dst).then(res => {
      this.setState({
        exSpinnerSpinning: false,
      })
      alert('Validation Successful');
    })
    .catch(function (error) {
      console.log(error)
      alert('Conflicts found:\n'+ JSON.stringify(error.response.data));
      this.setState({
        exSpinnerSpinning: false,
      })
    })
  }

  render() {
    console.log(this.state)

    let content = <div><ChangePlanAssetTable assets={this.state.assets_cp}
                                    //   filterQuery={this.getFilterQuery}
                                    //   sendSortQuery={this.getSortQuery}
                                    //   sendRerender={this.getRerender}/>
                                   /> </div>;

    let addNewAsset = 
      <Link to={'/changeplans/'.concat(this.state.id).concat('/changeNewAsset')}>
        {/* change above to :id later */}
        <Button color="primary" variant="contained" endIcon={<AddCircleIcon/>}>
          Add New Asset
        </Button>
      </Link>;

     


    return (
      <div>
        {this.state.redirect && <Redirect to={{ pathname: '/changeplans/'.concat(this.props.match.params.id).concat('/') }} />}
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <Grid item justify="flex-start" alignContent='center' xs={4}>
              <Typography variant="h3">
                Change Plan: {this.state.name}
              </Typography>
            </Grid>
            <Grid item justify="flex-start" alignContent='center' xs={8}>
              < Tooltip title='Rename Change Plan'> 
              <IconButton color="primary" aria-label="edit changeplan" component="span" onClick={this.showEditForm}>
                <EditIcon />
              </IconButton>
              </ Tooltip>
              <Dialog open={this.state.showEditModal}>
                <DialogTitle>
                  Edit Change Plan Name
                </DialogTitle>
                <DialogContent>
                <Container maxwidth="xl">
                <Grid container className="themed-container" spacing={2}>
                  <Grid item justify="flex-start" alignContent='center' xs={12} />
                  <Grid item justify="flex-start" alignContent='center' xs={10}>
                  <TextField label='Name' type="text" fullWidth
                    value={this.state.changedName}
                    defaultValue={this.state.name}
                    InputLabelProps={{ shrink: true }}
                    onChange={e => {
                      this.setState({
                        changedName: e.target.value,
                      });
                    }} />
                    </Grid>
                    <Grid item justify="flex-start" alignContent='center' xs={1}>
                      <Button variant="contained" onClick={this.submitEditName}>
                        Submit
                      </Button>
                    </Grid>
                    <Grid item justify="flex-start" alignContent='center' xs={1} />
                    <Grid item justify="flex-start" alignContent='center' xs={1}>
                      <Button variant="outlined" onClick={this.hideEditForm}>
                        Cancel
                      </Button>
                    </Grid>
                    </Grid>
                  </Container>
                  </DialogContent>
              </Dialog>
            </Grid>


            <Grid item justify="flex-start" alignContent='center' xs={2}>
              {addNewAsset}
            </Grid>

            <Grid item justify="flex-start" alignContent='center' xs={3}>
            <div>

              <Button 
                color="primary" 
                variant="contained" 
                endIcon={<AddCircleIcon/>}
                onClick={this.open.bind(this)}> 
                Change an Existing Asset
              </Button>

              <Dialog
                open={this.state.showDialog}
              >
                <DialogTitle>
                  Select an Asset within Datacenter: {this.state.datacenterAbbreviation} 
                </DialogTitle>
                
                <DialogContent>
                  {console.log(this.state.assetOptions)}
                
                <Container maxwidth="xl">
                  <Grid container className="themed-container" spacing={2}>
                    <Grid item justify="flex-start" alignContent='center' xs={12}>
                      <Autocomplete
                        id="cp-existing-asset-select"
                        //noOptionsText="No existing assets in Datacenter"
                        options={this.state.assetOptions}
                        getOptionLabel={(option) => option.hostname}
                        onChange={this.handleChangeAsset}
                        // defaultValue={this.state.assetOptions[0]}
                        value={this.state.selectedAsset}
                        renderInput={(params) =>
                          <TextField {...params} label="Asset" fullWidth/>}
                      />
                    </Grid>
                    <Grid item justify="flex-start" alignContent='center' xs={6}>
                      {/* change 1 to :id to edit existing asset page below */}
                      {/* TWO ids below, first is CP, second is asset */}
                      {console.log(this.state.existingAssetSelected)}
                      <Link to={'/changeplans/'.concat(this.props.match.params.id).concat('/changeExistingAsset/').concat(this.state.existingAssetSelected.id)}>
                        <Button color="primary" variant="contained" onClick={this.submitAsset}>
                          Submit
                        </Button>
                      </Link>
                    </Grid>
                    <Grid item justify="flex-start" alignContent='center' xs={6}>
                      <Button variant="contained" onClick={this.close}>
                        Close
                      </Button>
                    </Grid>
                  </Grid>
                </Container>
                </DialogContent>
              </Dialog>
            </div>
            </Grid>
            <Grid item justify="flex-start" alignContent='center' xs={2}>
              <Button variant="contained" onClick={this.validateCP}>
                Validate
              </Button>
              {this.state.spinnerSpinning && 
              <CircularProgress size={15}/>}
            </Grid>
            <Grid item justify="flex-start" alignContent='center' xs={3}>
              <Button variant="contained" onClick={this.executeCP}>
                Validate + Execute
              </Button>
              {this.state.exSpinnerSpinning && 
                <CircularProgress size={15}/>
              }
            </Grid>
            <Grid item alignContent='center' xs={12} />
            <Grid item alignContent='center' xs={12} />

            <Grid item justify="flex-start" alignContent='center' xs={12}>
              {content}
            </Grid>
          </Grid>

        </Container>
      </div>
    )
  }
}

DetailedChangePlan.contextType = DatacenterContext;

export default DetailedChangePlan
