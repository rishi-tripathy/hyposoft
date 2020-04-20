import React, {Component} from "react"
import axios, {post} from "axios"
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, Typography, CircularProgress
} from "@material-ui/core"
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {Link} from 'react-router-dom'
import DatacenterContext from "./DatacenterContext";
import ChangePlanTable from "./ChangePlanTable"; 

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ChangePlanController extends Component {

    constructor() {
        super();
        this.state = {
            changePlans: [],
            prevPage: null,
            nextPage: null,
            showingAll: false,
        }
    }

    componentDidMount() {
        // this.initializeFakeData();
        this.getChangePlans();
    }

    getChangePlans() {
      let dst = '/api/cp/';
      axios.get(dst).then(res => {
        console.log(res.data)
        var arr = [];
        res.data.results.map((cp, index) => {
          arr.push(cp);
        });
        this.setState({
          changePlans: arr,
          prevPage: res.data.previous,
          nextPage: res.data.next,
        });
      })
      .catch(function (error) {
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
    }


    getAllChangePlanDetails = () => {
      this.setState({
        loading: true,
      })

      let dst = '/api/cp/' + '?show_all=true';

      axios.get(dst).then(res => {
        console.log(res.data)
        var arr = [];
        res.data.results.map((cp, index) => {
          arr.push(cp);
        });
        this.setState({
          loading: false,
          changePlans: arr,
          prevPage: res.data.previous,
          nextPage: res.data.next,
        });
      })
      .catch(function (error) {
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
        this.setState({
          loading: false,
        })
      });
    }

    paginateNext = () => {
    axios.get(this.state.nextPage).then(res => {
      this.setState({
        changePlans: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  paginatePrev = () => {
    axios.get(this.state.prevPage).then(res => {
      this.setState({
        changePlans: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  toggleShowingAll = () => {
    this.state.showingAll ? (
      this.getChangePlans()
    ) : (this.getAllChangePlanDetails())
    this.setState(prevState => ({
      showingAll: !prevState.showingAll
    }));
  }

    render() {
        console.log(this.state.changePlans)

        let content = <div><ChangePlanTable changePlans={this.state.changePlans}
                                    //   filterQuery={this.getFilterQuery}
                                    //   sendSortQuery={this.getSortQuery}
                                    //   sendRerender={this.getRerender}/>
                                   /> </div>;

        let add = (
            <Link to={'/changeplans/create'}>
              <Button color="primary" variant="contained" endIcon={<AddCircleIcon/>}>
                Add Change Plan
              </Button>
            </Link>
          ) 

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
    
        let showAll = <p></p>;
        if (this.state.prevPage != null || this.state.nextPage != null) {
           showAll = <FormControlLabel labelPlacement="left"
                                          control={
                                            <Switch value={this.state.showingAll} onChange={() => this.toggleShowingAll()}/>
                                          }
                                          label={
                                            <Typography variant="subtitle1"> Show All</Typography>
                                          }
          />
        }
        return (
            <div>
              <Container maxwidth="xl">
                <Grid container className="themed-container" spacing={2}>
                  <Grid item justify="flex-start" alignContent='center' xs={12}/>
                  <Grid item justify="flex-start" alignContent='center' xs={10}>
                    <Typography variant="h3">
                      Change Plans
                    </Typography>
                  </Grid>
                  <Grid item justify="flex-start" alignContent='center' xs={10}>
                    To create a change plan, use the "Add change plan" button, and select view/edit in the table below.
                 </Grid>
                  {/* <Grid item justify="flex-end" alignContent="flex-end" xs={2}>
                    {showAll}
                  </Grid> */}
                  <Grid item justify="flex-start" alignContent="center" xs={3}>
                    {add}
                  </Grid>
                  <Grid item justify="flex-end" alignContent="flex-end" xs={3}>
                    {paginateNavigation}
                  </Grid>
                  <Grid item xs={12}>
                    {this.state.loading ? <center><CircularProgress size={100}/> </center>: content}
                  </Grid>
                </Grid>
              </Container>
            </div>
          )
    }
    
}

ChangePlanController.contextType = DatacenterContext;

export default ChangePlanController