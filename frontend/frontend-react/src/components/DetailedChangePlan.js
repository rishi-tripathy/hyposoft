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
      assetOptions: [],
      assetsAffectedByChangePlan: [],
      existingAssetSelected: null,
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

  handleChangeAsset = (event, selectedAsset) => {
    //do later when string stuff is fixed 
    console.log('changing asset')
    this.setState({
      existingAssetSelected: selectedAsset,
    });
    console.log(this.state)
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
          Add Change Plan Action to New Asset
        </Button>
      </Link>;


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
            <div>

              <Button 
                color="primary" 
                variant="contained" 
                endIcon={<AddCircleIcon/>}
                onClick={this.open.bind(this)}> 
                Add Change Plan Action to Existing Asset
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
                    <Grid item justify="flex-start" alignContent='center' xs={3}>
                      {/* change 1 to :id to edit existing asset page below */}
                      {/* TWO ids below, first is CP, second is asset */}
                      <Link to={'/changeplans/1/changeExistingAsset/1/'}>
                        <Button color="primary" variant="contained" onClick={this.submitAsset}>
                          Submit
                        </Button>
                      </Link>
                    </Grid>
                    <Grid item justify="flex-start" alignContent='center' xs={3}>
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
