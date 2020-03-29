import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import {
  Typography, Dialog, DialogTitle, DialogContent, Container, Grid, Button, TextField, IconButton
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
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
      name: null,
      changedName: null,
      datacenter: null,
      executed: null,
      showDialog: false,
      assetOptions: [],
      assetsAffectedByChangePlan: [],
      existingAssetSelected: null,
      showEditModal: false,
      redirect: false,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.getChangePlanDetails();
  }

  getChangePlanDetails = () => {
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
          datacenter: res.data.datacenter,
          executed: res.data.executed,
          assetsAffectedByChangePlan: assets_arr,
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
    console.log(this.context)
    let dst = '/api/assets/?datacenter=' + this.context.datacenter_id + '&show_all=true';
    console.log(dst)

    axios.get(dst).then(res => {
        // var raw_assets = res.data;
      //put in digestible form 
      // var ass_arr = [];
      // raw_assets.map((asset, index) =>{
      //   var temp = asset['id'];
      //   ass_arr.push(temp);
      // });

      // this.setState({
      //   assets: ass_arr,
      // });
      
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
    console.log('changing asset')
    this.setState({
      existingAssetSelected: selectedAsset,
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

  render() {
    console.log(this.state)

    let content = <div><ChangePlanAssetTable assets={this.state.assetsAffectedByChangePlan}
                                    //   filterQuery={this.getFilterQuery}
                                    //   sendSortQuery={this.getSortQuery}
                                    //   sendRerender={this.getRerender}/>
                                   /> </div>;

    let addNewAsset = 
      <Link to={'/changeplans/1/changeNewAsset'}>
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
                    <Grid item justify="flex-start" alignContent='center' xs={4}>
                      <Button variant="contained" onClick={this.submitEditName}>
                        Submit
                      </Button>
                    </Grid>
                    <Grid item justify="flex-start" alignContent='center' xs={4}>
                      <Button variant="outlined" onClick={this.hideEditForm}>
                        Cancel
                      </Button>
                    </Grid>
                    </Grid>
                  </Container>
                  </DialogContent>
              </Dialog>
            </Grid>


            <Grid item justify="flex-start" alignContent='center' xs={3}>
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
                  Select an Asset within Datacenter: {this.context.datacenter_ab} 
                </DialogTitle>
                
                <DialogContent>
                  {console.log(this.state.assetOptions)}
                  {console.log(this.state.assetOptions[1])}
                
                <Container maxwidth="xl">
                  <Grid container className="themed-container" spacing={2}>
                    <Grid item justify="flex-start" alignContent='center' xs={12}>
                      <Autocomplete
                        id="cp-existing-asset-select"
                        //noOptionsText="No existing assets in Datacenter"
                        options={this.state.assetOptions}
                        getOptionLabel={(option) => option.id}
                        onInputChange={this.handleChangeAsset}
                        // defaultValue={this.state.assetOptions[0]}
                        renderInput={(params) =>
                          <TextField {...params} label="Asset" fullWidth/>}
                      />
                    </Grid>
                    <Grid item justify="flex-start" alignContent='center' xs={2}>
                      {/* change 1 to :id to edit existing asset page below */}
                      {/* TWO ids below, first is CP, second is asset */}
                      <Link to={'/changeplans/1/changeExistingAsset/1/'}>
                        <Button color="primary" variant="contained" onClick={this.submitAsset}>
                          Submit
                        </Button>
                      </Link>
                    </Grid>
                    <Grid item justify="flex-start" alignContent='center' xs={2}>
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
            <Grid item justify="flex-start" alignContent='center' xs={3}>
              <Button variant="contained" onClick={this.validateCP}>
                Validate
              </Button>
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
