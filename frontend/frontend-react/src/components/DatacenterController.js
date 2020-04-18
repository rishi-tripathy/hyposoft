import React, {Component, useState} from 'react'
import FilterListIcon from '@material-ui/icons/FilterList';
import axios, {post} from 'axios'
import '../stylesheets/Printing.css'
import '../stylesheets/RackTable.css'
import '../stylesheets/RacksView.css'
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {UncontrolledCollapse, CardBody, Card} from 'reactstrap';
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, Typography
} from "@material-ui/core"
import {Link} from 'react-router-dom'
import DatacenterTable from './DatacenterTable'
import DatacenterContext from './DatacenterContext';
import OfflineStorageSiteTable from './OfflineStorageSiteTable';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DatacenterController extends Component {

    constructor() {
        super();
        this.state = {
          datacenters: [{}
          ],
          offlineStorageSites: [{}
          ],
          showingAll: false,
          dcPrevPage: null,
          dcNextPage: null,
          offlinePrevPage: null,
          offlineNextPage: null,
          filterQuery: "",
          rerender: false,
        //   file: null
        };

      }

      getDatacenters = () => {
        // console.log(this.props.location.state)
         if(this.props.location.state === undefined || this.props.location.state === null){
        }
        else{
         window.location = '/';

        }

        let datacenterDst = "/api/datacenters/" + "?offline=false" + "&";
        let offlineDst = "/api/datacenters/" + "?offline=true" + "&";
        // console.log("QUERY")
        // console.log(dst)

        axios.get(datacenterDst).then(res => {
          this.setState({
            datacenters: res.data.results,
            dcPrevPage: res.data.previous,
            dcNextPage: res.data.next,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
          });

      axios.get(offlineDst).then(res => {
        this.setState({
          offlineStorageSites: res.data.results,
          offlinePrevPage: res.data.previous,
          offlineNextPage: res.data.next,
        });
      })
        .catch(function (error) {
          // TODO: handle error
          alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
        });
    }



      getFilterQuery = (q) => {
        this.setState({filterQuery: q});
        // console.log(this.state.filterQuery);
      }

      componentDidMount() {
        this.getDatacenters();
      }

      //component did update

      paginateNextDc = () => {
        axios.get(this.state.dcNextPage).then(res => {
          this.setState({
            datacenters: res.data.results,
            dcPrevPage: res.data.previous,
            dcNextPage: res.data.next,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
          });
      }

      paginatePrevDc = () => {
        axios.get(this.state.dcPrevPage).then(res => {
          this.setState({
            datacenters: res.data.results,
            dcPrevPage: res.data.previous,
            dcNextPage: res.data.next,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
          });
      }

      paginateNextOffline = () => {
        axios.get(this.state.offlineNextPage).then(res => {
          this.setState({
            offlineStorageSites: res.data.results,
            offlinePrevPage: res.data.previous,
            offlineNextPage: res.data.next,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
          });
      }

      paginatePrevOffline = () => {
        axios.get(this.state.offlinePrevPage).then(res => {
          this.setState({
            offlineStorageSites: res.data.results,
            offlinePrevPage: res.data.previous,
            offlineNextPage: res.data.next,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
          });
      }

      //showing all


      getAllDatacenters = () => {

        let dcDst = "/api/datacenters/" + "?" + "show_all=true";
        let offDst = "/api/datacenters/" + "?" + "show_all=true";

        axios.get(dcDst).then(res => {
          this.setState({
            datacenters: res.data,
            dcPrevPage: null,
            dcNextPage: null,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
          });


        axios.get(dcDst).then(res => {
          this.setState({
            datacenters: res.data,
            offlinePrevPage: null,
            offlineNextPage: null,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
          });
      }

      toggleShowingAll = () => {
        this.state.showingAll ? (
          this.getDatacenters()
        ) : (this.getAllDatacenters())
        this.setState(prevState => ({
          showingAll: !prevState.showingAll
        }));
      }

    render() {

        let paginateNavigation = <p></p>;
            if (this.state.dcPrevPage == null && this.state.dcNextPage != null) {
            paginateNavigation =
                <ButtonGroup>
                <Button color="primary" disabled onClick={this.paginatePrevDc}>prev page
                </Button>{"  "}<Button color="primary" onClick={this.paginateNextDc}>next page</Button>
                </ButtonGroup>
            } else if (this.state.dcPrevPage != null && this.state.dcNextPage == null) {
            paginateNavigation =
                <ButtonGroup>
                <Button color="primary" onClick={this.paginatePrevDc}>prev page
                </Button>{"  "}<Button color="primary" disabled onClick={this.paginateNextDc}>next page</Button>
                </ButtonGroup>
            } else if (this.state.dcPrevPage != null && this.state.dcNextPage != null) {
            paginateNavigation =
                <ButtonGroup>
                <Button color="primary" onClick={this.paginatePrevDc}>prev page
                </Button>{"  "}<Button color="primary" onClick={this.paginateNextDc}>next page</Button>
                </ButtonGroup>
            }

            let paginateNavigationOffline = <p></p>;
            if (this.state.offlinePrevPage == null && this.state.offlineNextPage != null) {
              paginateNavigationOffline =
                <ButtonGroup>
                <Button color="primary" disabled onClick={this.paginatePrevOffline}>prev page
                </Button>{"  "}<Button color="primary" onClick={this.paginateNextOffline}>next page</Button>
                </ButtonGroup>
            } else if (this.state.offlinePrevPage != null && this.state.offlineNextPage == null) {
              paginateNavigationOffline =
                <ButtonGroup>
                <Button color="primary" onClick={this.paginatePrevOffline}>prev page
                </Button>{"  "}<Button color="primary" disabled onClick={this.paginateNextOffline}>next page</Button>
                </ButtonGroup>
            } else if (this.state.offlinePrevPage != null && this.state.offlineNextPage != null) {
              paginateNavigationOffline =
                <ButtonGroup>
                <Button color="primary" onClick={this.paginatePrevOffline}>prev page
                </Button>{"  "}<Button color="primary" onClick={this.paginateNextOffline}>next page</Button>
                </ButtonGroup>
            }

        let showAll = <FormControlLabel labelPlacement="left"
                                control={
                                    <Switch value={this.state.showingAll} onChange={() => this.toggleShowingAll()}/>
                                }
                                label={
                                    <Typography variant="subtitle1"> Show All</Typography>
                                }
        />

        let add = ( this.context.is_admin || this.context.username === 'admin' || this.context.asset_permission.length != 0 ) ? (
            <Link to={'/datacenters/create'}>
              <Button color="primary" variant="contained" endIcon={<AddCircleIcon/>}>
                Add Datacenter/Offline Site
              </Button>
            </Link>

          ) : <p></p>;

        let content = <div>< DatacenterTable
                        datacenters={this.state.datacenters}
                        filterQuery={this.getFilterQuery}
                        sendSortQuery={this.getSortQuery}/>
                        </div>;


        let content2 = <div>< OfflineStorageSiteTable
                        datacenters={this.state.offlineStorageSites}
                        filterQuery={this.getFilterQuery}
                        sendSortQuery={this.getSortQuery}/>
                        </div>;

        return(
            <div>
                <Container maxwidth="xl">
                    <Grid container className="themed-container" spacing={2}>
                        <Grid item justify="flex-start" alignContent='center' xs={12}/>
                        <Grid item justify="flex-start" alignContent='center' xs={10}>
                            <Typography variant="h3">
                                Datacenters and Offline Storage Sites
                            </Typography>
                         </Grid>
                    <Grid item justify="flex-end" alignContent="flex-end" xs={2}>
                        {showAll}
                    </Grid>
                    <Grid item justify="flex-start" alignContent="center" xs={3}>
                        {add}
                    </Grid>
                    <Grid item justify="flex-end" alignContent="flex-end" xs={3}>
                        {paginateNavigation}
                    </Grid>
                    <Grid item xs={12}>
                        {content}
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item justify="flex-start" alignContent="center" xs={3} />

                    <Grid item justify="flex-end" alignContent="flex-end" xs={3}>
                        {paginateNavigationOffline}
                    </Grid>
                    <Grid item xs={12}>
                        {content2}
                    </Grid>                  
                    <Grid item xs={12} />
                    <Grid item xs={12} />
                    <Grid item xs={12} />

                    </Grid>
                </Container>
            </div>
        )
    }
}

DatacenterController.contextType = DatacenterContext;

export default DatacenterController
