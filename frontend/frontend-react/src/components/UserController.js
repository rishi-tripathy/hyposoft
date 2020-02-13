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


axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class UserController extends Component {

  constructor() {
    super();
    this.state = {
      users: [],
      prevPage: null,
      nextPage: null,
      rerender: false,
    }
  }

  getShowTable = (show) => {
    show ? this.setState({
      showTableView: true,
      // everything else false
      showCreateView: false,
    })
      : this.setState({
        showTableView: true,
      })
  }

  getShowCreate = (show) => {
    show ? this.setState({
      showCreateView: true,
      // everything else false
      showTableView: false,
    })
      : this.setState({
        showCreateView: false,
      })
  }

  componentDidUpdate(prevProps, prevState) {

    // When showing table again, rerender
    if (prevState.showTableView === false && this.state.showTableView === true) {
      this.getUsers();
    }

    // After crud, rerender
    if (prevState.rerender === false && this.state.rerender === true) {
      this.getUsers();
      this.setState({ rerender: false });
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

  componentDidMount() {
    this.getUsers();
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
    let content;


    content = <div>
      <UserTableMUI users={this.state.users} />
    </div>

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

    let add = this.props.is_admin ? (
      <Link to={'/users/create'}>
        <Button color="primary" variant="contained" endIcon={<AddCircleIcon />}>
          Add User
        </Button>
      </Link>

    ) : {};

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

export default UserController
