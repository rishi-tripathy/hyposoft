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
        }
    }

    render() {

        let content = <div><ChangePlanTable changePlans={this.state.changePlans}
                                    //   filterQuery={this.getFilterQuery}
                                    //   sendSortQuery={this.getSortQuery}
                                    //   sendRerender={this.getRerender}/>
                                   /> </div>;

        let add = this.context.is_admin ? (
            <Link to={'/changeplans/create'}>
              <Button color="primary" variant="contained" endIcon={<AddCircleIcon/>}>
                Add Change Plan
              </Button>
            </Link>
      
          ) : <p></p>;      

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