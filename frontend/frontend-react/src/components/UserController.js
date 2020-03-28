import React, { Component } from 'react'
import AddUserModal from './AddUserModal'
import axios from 'axios'
import UserTable from './UserTable';
import CreateUserForm from './CreateUserForm';
import UserTableMUI from './UserTableMUI';
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, Typography
} from "@material-ui/core"
import { Link } from 'react-router-dom'
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DatacenterContext from './DatacenterContext';


axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class UserController extends Component {

  constructor() {
    super();
    this.state = {
      users: [],
      prevPage: null,
      nextPage: null,
      rerender: false,
      usersPermissions: [],
    }
  }

  getUsers = () => {
    let dst = '/api/users/';
    axios.get(dst).then(res => {
      this.setState({
        users: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  getUserPermissions = () => {
    let dst = '/all-permissions/';
    axios.get(dst).then(res => {
      // let permissionArray = res.data
      // permissionArray.forEach((userObject) => {
      //   console.log(userObject)
      // })
      
      this.setState({
        usersPermissions: res.data,
      });
    })
      .catch(function (error) {
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  componentDidMount() {
    this.getUsers();
    this.getUserPermissions();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const delay = 50
    // After crud, rerender
    if (prevState.rerender === false && this.state.rerender === true) {
      setTimeout(() => {
        this.getUsers();
        this.getUserPermissions();
        this.setState({ rerender: false });
      }, delay);

    }
  }

  getRerender = (re) => {
    if (re) {
      this.setState({ rerender: true })
    }
  }
  paginateNext = () => {
    axios.get(this.state.nextPage).then(res => {
      this.setState({
        users: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  paginatePrev = () => {
    axios.get(this.state.prevPage).then(res => {
      this.setState({
        users: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  render() {
    let content = <div>
      <UserTableMUI sendRerender={this.getRerender} users={this.state.users} usersPermissions={this.state.usersPermissions}/>
    </div>;

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

    let add = this.context.is_admin ? (
      <Link to={'/users/create'}>
        <Button color="primary" variant="contained" endIcon={<AddCircleIcon />}>
          Add User
        </Button>
      </Link>

    ) : <p></p>;

    return (
      <Container maxwidth="xl">
        <Grid container className="themed-container" spacing={2}>
          <Grid item justify="flex-start" alignContent='center' xs={12} />
          <Grid item justify="flex-start" alignContent='center' xs={10}>
            <Typography variant="h3">
              User Table
              </Typography>
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
            {content}
          </Grid>
        </Grid>
      </Container>
    )
  }
}

UserController.contextType = DatacenterContext;

export default UserController
