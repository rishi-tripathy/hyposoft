import React, {Component} from 'react'
import ReactDOMServer from 'react-dom'
import '../stylesheets/RacksView.css'
import '../stylesheets/RackTable.css'
import '../stylesheets/Printing.css'
import RackTable from './RackTable'
import axios from 'axios'
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, Typography, IconButton, Tooltip
} from "@material-ui/core"
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {Link} from 'react-router-dom'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RacksView extends Component {
  //rack isn't variable/no other API endpoint for individual rack

  constructor() {
    super();
    this.state = {
      condensedView: false,
      showAllView: false,
      count: 1,
    }
    this.showCreateForm = this.showCreateForm.bind(this);
    this.showMassCreateForm = this.showMassCreateForm.bind(this);
    this.showMassDeleteForm = this.showMassDeleteForm.bind(this);
    this.showEditForm = this.showEditForm.bind(this);
    this.showAllRacks = this.showAllRacks.bind(this);
  }

  showCreateForm = () => {
    this.props.sendShowCreate(true);
  }

  showMassCreateForm = () => {
    this.props.sendShowMassCreate(true);
  }

  showMassDeleteForm = () => {
    this.props.sendShowMassDelete(true);
  }

  showEditForm = (id) => {
    this.props.sendShowEdit(true);
    this.props.sendEditID(id);
  }

  showDeleteForm = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      let dst = '/api/racks/'.concat(id).concat('/');
      axios.delete(dst)
        .then(function (response) {
          alert('Delete was successful');
        })
        .catch(function (error) {
          alert('Delete was not successful.\n' + JSON.stringify(error.response.data));
        });
      this.showRerender();
    }
  }

  showRerender = () => {
    this.props.sendRerender(true);
  }

  handleCondensation = () => {
    this.setState({condensedView: true});
  }

  handleCondensationOff = () => {
    this.setState({condensedView: false});
  }

  showAllRacks = () => {
    this.props.sendShowAllRacks(true);
  }

  showLessRacks = () => {
    this.props.sendShowAllRacks(false);
  }


  sendFromRow = (show, id) => {
    this.props.sendViewsToController(show, id);
  }

  toggleShowingAll = () => {
    if(this.state.count === 1){
      this.setState({
        count: 2,
      });
      this.showAllRacks();
    }
    else{
      this.setState(prevState => ({
        showingAll: !prevState.showingAll
      }));
      this.state.showingAll ? (
        this.showAllRacks()
      ) : (this.showLessRacks())
    }
  }

  toggleCondensed = () => {
    this.setState(prevState => ({
      condensedView: !prevState.condensedView
    }));
  }

  render() {
    let add = this.props.is_admin ? (
      <Link to={'/racks/create'}>
        <Button color="primary" variant="contained" endIcon={<AddCircleIcon/>}>
          Add Rack(s)
        </Button>
      </Link>
    ) : {};

    let deleteMultiple = this.props.is_admin ? (
      <Link to={'/racks/delete'}>
        <Button color='primary' variant="contained" endIcon={<DeleteIcon/>}>
          Delete Rack Range
        </Button>
      </Link>
    ) : {};

    let showAll = <FormControlLabel labelPlacement="left"
      control={
        <Switch value={this.state.showingAll} onChange={() => this.toggleShowingAll()}/>
      }
      label={
        <Typography variant="subtitle1"> Show All</Typography>
      }
    />    

    let condensed  = <FormControlLabel labelPlacement="left"
      control={
        <Switch value={this.state.condensedView} onChange={() => this.toggleCondensed()}/>
      }
      label={
        <Typography variant="subtitle1"> Condensed</Typography>
      }
    />

    let empty = '';

    if(!this.props.rack){
      empty = 
      <Grid item justify="flex-start" alignContent='center' xs={2}>
        No racks.
      </Grid>;
    }



    return (
      <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12}/>
            <Grid item justify="flex-start" alignContent='flex-start' xs={2}>
            <div id="hideOnPrint">
              {add}
            </div>
            </Grid>
            <Grid item justify="center" alignContent="center" xs={3}>
              <div id="hideOnPrint">
              {deleteMultiple}
              </div>
            </Grid>
            <Grid item justify="center" alignContent="center" xs={3}>
            <div id="hideOnPrint">              
              {condensed}
              </div>
            </Grid>
            <Grid item justify="center" alignContent="center" xs={3}>
              <div id="hideOnPrint">
              {showAll}
              </div>
            </Grid>
            <Grid item xs={12}>
            {empty}
              {this.props.rack.map((item, key) =>
              <div id="rackContainer">
                <div id='hideOnPrint'>
                  {this.props.is_admin ? (
                      <ButtonGroup alignContent='center'>
                        <Link to={'/racks/' + item.id + '/edit'}>
                          < Tooltip title='Edit'>
                            <IconButton aria-label="edit">
                              <EditIcon />
                            </IconButton>
                          </ Tooltip>
                        </Link>
                        < Tooltip title='Delete'>
                         <IconButton color='secondary' onClick={() => this.showDeleteForm(item.id)}>
                           <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ButtonGroup>
                    )
                    :
                    (<p></p>)}
                </div> 
                <Grid item justify="flex-start" alignContent='center' xs={12} p={2}>
                    <RackTable
                      sending={this.sendFromRow}
                      sendUrl={this.sendUrlInView}
                      rack={item}
                      condensedState={this.state.condensedView}
                      is_admin={this.props.is_admin}/>
                </Grid>
              </div>
        )}
            </Grid>
          </Grid>
        </Container>
    )
  }
}

export default RacksView