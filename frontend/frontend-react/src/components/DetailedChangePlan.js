import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import {
  Typography, Dialog, DialogTitle, DialogContent, Container, Grid, Button, TextField
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
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
      showDialog: false,
      assets: [],
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  // initializeFakeData = () => {
  //   this.state.assets = null;

  //   var arr = [];

  //   var ass1 = {
  //     id:0,
  //     name: 'asset1',
  //   }

  //   arr.push(ass1);

  //   this.setState({
  //     assets: arr,
  //   })
  // }

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
        var raw_assets = res.data;
      //put in digestible form 
      var ass_arr = [];
      raw_assets.map((asset, index) =>{
        var temp = asset['id'];
        ass_arr.push(temp);
      });

      this.setState({
        assets: ass_arr,
      });
      
      console.log(this.state.assets)

    })
    .catch(function (error) {
      console.log(error.response)
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  handleChangeAsset = () => {
    //do later when string stuff is fixed 
  }

  render() {
    console.log(this.state)

    let content = <div><ChangePlanAssetTable assets={this.state.assets}
                                    //   filterQuery={this.getFilterQuery}
                                    //   sendSortQuery={this.getSortQuery}
                                    //   sendRerender={this.getRerender}/>
                                   /> </div>;

    let addNewAsset = 
      <Link to={'/changeplans/1/changeNewAsset'}>
        {/* change above to :id later */}
        <Button color="primary" variant="contained" endIcon={<AddCircleIcon/>}>
          Add Change Plan Action to New Asset
        </Button>
      </Link>;

    let editExistingAsset =
    <div>
      <Button onClick={this.open.bind(this)}> Add Change Plan Action to Existing Asset</Button>
        <Dialog
          open={this.state.showDialog}
          onClose={this.close}
        >
          <DialogTitle>
            Select an Asset within Datacenter: {this.context.datacenter_ab} 
          </DialogTitle>
          
          <DialogContent>
            {console.log(this.state.assets)}
          <Autocomplete
                    freeSolo
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="rack-datacenter-select"
                    noOptionsText={"Create New in DC tab"}
                    options={this.state.assets}
                    onInputChange={this.handleChangeAsset}
                    defaultValue={this.state.assets[0]}
                    renderInput={params => (
                      <TextField {...params} label="Asset" fullWidth/>
                    )}
                  />
          </DialogContent>
        </Dialog>
    </div>


    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Detailed Change Plan:
              </Typography>
            </Grid>

            <Grid item justify="flex-start" alignContent='center' xs={6}>
              {addNewAsset}
            </Grid>

            <Grid item justify="flex-start" alignContent='center' xs={6}>
              {editExistingAsset}
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
