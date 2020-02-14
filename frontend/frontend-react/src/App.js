import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import NavBar from './components/NavBar';
import axios from 'axios'
import './stylesheets/Printing.css'
import Landing from './components/Landing'
import RackController from './components/RackController';
import CreateRackForm from './components/CreateRackForm';
import ModelController from './components/ModelController';
import InstanceController from './components/InstanceController';
import UserController from './components/UserController';
import StatisticsController from './components/StatisticsController'
import DetailedModel from './components/DetailedModel';
import DetailedInstance from './components/DetailedInstance';
import CreateModelForm from './components/CreateModelForm';
import EditModelForm from './components/EditModelForm';
import CreateInstanceForm from "./components/CreateInstanceForm";
import EditInstanceForm from "./components/EditInstanceForm";
import EditRackForm from './components/EditRackForm';
import DeleteMultipleRacksForm from './components/DeleteMultipleRacksForm';
import CreateUserForm from './components/CreateUserForm';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      logged_in: false,
      is_admin: true,
      logged_out: true,
    }
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    axios.get('api/users/who_am_i/').then(res => {
      const r = res.data.current_user;
      if (r != '') {
        this.setState({ logged_in: true });
      } else {
        this.setState({ logged_in: false });
      }
    })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.response)
      });


    axios.get('api/users/am_i_admin/').then(res => {
      const r = res.data.is_admin;
      this.setState({ is_admin: r });

    })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.response)
      });
  }

  handleOnClick() {
    window.location = "/accounts/login/";
  }

  handleLogout = (val) => {
    this.setState({ logged_in: false });
  }

  render() {

    let content;


    // if (!this.state.logged_in) {
    //   content =
    //     <div id="contentContainer">
    //       <LandingPage />
    //       <div id='login'>
    //         <Button color='primary' onClick={this.handleOnClick}>
    //           Log In!
    //       </Button>
    //       </div>
    //     </div>
    // }
    // else {
    //   content = <SideBar is_admin={this.state.is_admin} />
    // }

    return (
      <Router>
        <NavBar />
        <Switch>
          <Route path='/' exact component={Landing} />
          <Route
            path='/racks'
            exact
            render={(props) => <RackController {...props} is_admin={true}/>}/>

          <Route
            path='/racks/create'
            exact
            render={(props) => <CreateRackForm {...props} is_admin={true}/>} />

          <Route
            path='/racks/edit'
            exact
            render={(props) => <EditRackForm {...props} is_admin={true}/>} />

          <Route
            path='/racks/delete'
            exact
            render={(props) => <DeleteMultipleRacksForm {...props} is_admin={true}/>} />


          <Route
            path='/models'
            exact
            render={(props) => <ModelController {...props} is_admin={true} />} />

          <Route
            path='/models/create'
            exact
            render={(props) => <CreateModelForm {...props} />} />

          <Route
            path='/models/:id'
            exact
            render={(props) => <DetailedModel {...props} is_admin={true} />} />

          <Route
            path='/models/:id/edit'
            exact
            render={(props) => <EditModelForm {...props} />} />

          <Route
            path='/assets'
            exact
            render={(props) => <InstanceController {...props} is_admin={true} />} />

          <Route
            path='/assets/create'
            exact
            render={(props) => <CreateInstanceForm {...props} />} />

          <Route
            path='/assets/:id'
            exact
            render={(props) => <DetailedInstance {...props} is_admin={true} />} />

          <Route
            path='/assets/:id/edit'
            exact
            render={(props) => <EditInstanceForm {...props} />} />

          <Route
            path='/users'
            exact
            render={(props) => <UserController {...props} is_admin={true} />} />

          <Route
            path='/users/create'
            exact
            render={(props) => <CreateUserForm {...props} />} />

          <Route
            path='/statistics'
            render={(props) => <StatisticsController {...props} is_admin={true} />} />

          <Route
            path='/'
            render={() => <div>404</div>} />

        </Switch>

      </Router>
    )
  }
}

export default App;
