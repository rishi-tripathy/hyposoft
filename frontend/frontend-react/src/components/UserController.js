import React, { Component } from 'react'
import AddUserModal from './AddUserModal'
import axios from 'axios'
import UserTable from './UserTable';
import CreateUserForm from './CreateUserForm';
import { UncontrolledCollapse, Button, ButtonGroup, Container, Card } from 'reactstrap';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class UserController extends Component {
  
  constructor() {
    super();
    this.state = {
      users: [],
      prevPage: null,
      nextPage: null,
      showTableView: true,
      showCreateView: false,
      rerender: false,
    }
  }

  getShowTable = (show) => {
    show ? this.setState({
      showTableView: true,
      // everything else false
      showCreateView : false,
    })
    : this.setState({
      showTableView : true,
    }) 
  }

  getShowCreate = (show) => {
    show ? this.setState({
      showCreateView : true,
      // everything else false
      showTableView: false,
    })
    : this.setState({
      showCreateView : false,
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
      alert('Could not get users.\n' + JSON.stringify(error.response.data));
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
      console.log(error.response);
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
      console.log(error.response);
    });
  }
  
  render() {
    let content;

    if (this.state.showTableView){
      content = <div>
                  <UserTable users={ this.state.users } 
                    sendRerender={ this.getRerender }
                    sendShowCreate={this.getShowCreate}
                     />
                </div>
    }
  
    else if (this.state.showCreateView){
        content = <CreateUserForm 
                    sendShowTable={ this.getShowTable }
                     /> 
    }

    let paginateNavigation = <p></p>;
    if (this.state.prevPage == null && this.state.nextPage != null) {
      paginateNavigation = <div><ButtonGroup><Button disabled>prev page</Button>{'  '}<Button onClick={ this.paginateNext }>next page</Button></ButtonGroup></div>;
    }
    else if (this.state.prevPage != null && this.state.nextPage == null) {
    paginateNavigation = <div><ButtonGroup><Button onClick={ this.paginatePrev }>prev page</Button>{'  '}<Button disabled>next page</Button></ButtonGroup></div>;
    }
    else if (this.state.prevPage != null && this.state.nextPage != null) {
      paginateNavigation = <div><ButtonGroup><Button onClick={ this.paginatePrev }>prev page</Button>{'  '}<Button onClick={ this.paginateNext }>next page</Button></ButtonGroup></div>;
    }

    if (! this.state.showTableView) {
      paginateNavigation = <p></p>;
    }

    return (
      <Container className="themed-container">
        <h2>User Table</h2>
        { paginateNavigation }
        <br></br>
        { content }
        <br></br>
      </Container>
    )
  }
}

export default UserController
