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
          showingAll: false,
          prevPage: null,
          nextPage: null,
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
        let dst = "/api/datacenters/" + "?" + this.state.filterQuery + "&";
        // console.log("QUERY")
        // console.log(dst)
        axios.get(dst).then(res => {
          this.setState({
            datacenters: res.data.results,
            prevPage: res.data.previous,
            nextPage: res.data.next,
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

      paginateNext = () => {
        axios.get(this.state.nextPage).then(res => {
          this.setState({
            datacenters: res.data.results,
            prevPage: res.data.previous,
            nextPage: res.data.next,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
          });
      }

      paginatePrev = () => {
        axios.get(this.state.prevPage).then(res => {
          this.setState({
            datacenters: res.data.results,
            prevPage: res.data.previous,
            nextPage: res.data.next,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
          });
      }

      //showing all


      getAllDatacenters = () => {
        let filter = this.state.filterQuery;

        if (this.state.filterQuery.length !== 0) {
          filter = filter + "&";
        }

        let dst = "/api/datacenters/" + "?" + filter + "show_all=true";

        axios.get(dst).then(res => {
          this.setState({
            datacenters: res.data,
            prevPage: null,
            nextPage: null,
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

      // console.log(this.context)

        let paginateNavigation = <p></p>;
            if (this.state.prevPage == null && this.state.nextPage != null) {
            paginateNavigation =
                <ButtonGroup>
                <Button color="primary" disabled onClick={this.paginatePrev}>prev page
                </Button>{"  "}<Button color="primary" onClick={this.paginateNext}>next page</Button>
                </ButtonGroup>
            } else if (this.state.prevPage != null && this.state.nextPage == null) {
            paginateNavigation =
                <ButtonGroup>
                <Button color="primary" onClick={this.paginatePrev}>prev page
                </Button>{"  "}<Button color="primary" disabled onClick={this.paginateNext}>next page</Button>
                </ButtonGroup>
            } else if (this.state.prevPage != null && this.state.nextPage != null) {
            paginateNavigation =
                <ButtonGroup>
                <Button color="primary" onClick={this.paginatePrev}>prev page
                </Button>{"  "}<Button color="primary" onClick={this.paginateNext}>next page</Button>
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
                Add Datacenter
              </Button>
            </Link>

          ) : <p></p>;

        let content = <div>< DatacenterTable
                        datacenters={this.state.datacenters}
                        filterQuery={this.getFilterQuery}
                        sendSortQuery={this.getSortQuery}/>
                        </div>;


        let content2 = <div>< OfflineStorageSiteTable
                        datacenters={this.state.datacenters}
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
                    <Grid item xs={12}>
                        {content2}
                    </Grid>                    
                    </Grid>
                </Container>
            </div>
        )
    }
}

DatacenterController.contextType = DatacenterContext;

export default DatacenterController
