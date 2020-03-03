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
import DatacenterController from './components/DatacenterController';
import CreateDatacenterForm from './components/CreateDatacenterForm'
import EditDatacenterForm from './components/EditDatacenterForm'
import AuditController from './components/AuditController.js'
import LandingPage from './components/LandingPage'
import EditUserForm from './components/EditUserForm'
import { Button } from "@material-ui/core"

import DatacenterContext from './components/DatacenterContext';


axios.defaults.xsrfHeaderName = "X-CSRFToken";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      logged_in: false,
      is_admin: false,
      datacenter_id: -1,
      datacenter_name: 'ALL',
      datacenter_ab: 'ALL',
      setDatacenter: this.setDatacenter,
      resetDatacenter: this.resetDatacenter,
      datacenterOptions: null,
      user_first: null,
      user_last: null,
      username: null,
      delay: false,
    }
  }

  setDatacenter  = (value, name, ab) =>  {
    // console.log("changing id to "+ value + " name: "+name);
    this.setState({
      datacenter_id: value,
      datacenter_name: name,
      datacenter_ab: ab,
    });
  }

  resetDatacenter = () => {
    // console.log('resetting dcs')
    this.getDatacenters();
    // console.log(this.state.datacenterOptions)
  }

  getDatacenters = () => {
    let self = this;
    let dst = '/api/datacenters/?show_all=true'; //want all
    //let dst = '/api/datacenters/?&';
    // console.log("QUERY")
    // console.log(dst)
    axios.get(dst).then(res => {
      // console.log(res)
      let d = [];
      let allCase = {id: -1, url: null, abbreviation: 'ALL', name: 'ALL'};
      d.push(allCase);
      res.data.map((dc, index) => {
        d.push(dc)
      });

      // console.log(d)

      this.setState({
        datacenterOptions: d,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
      })
  }

  componentDidMount() {
    // console.log('rerender');
   // this.setDatacenter(this.context.datacenter_id, this.context.datacenter_name, this.conteext.datacenter_ab);
    this.setLoginInfo();
  }


  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  setLoginInfo() {

    //OAuth stuff

    const querystring = require('querystring');

    if(window.location.href.indexOf("token") > -1){ //exists
      // console.log('back from oit')
      // console.log(window.location.hash)
      // console.log(window.location.hash.substring(1));
      // console.log(querystring.parse(window.location.hash.substring(1)));

      let client_id = 'hyposoft-ev2';

      let tokenParams = querystring.parse(window.location.hash.substring(1));

      let tokenCopy = tokenParams.access_token;

      axios.get('/api/users/netid_login/' + '?' + 'token=' + tokenCopy)
      .then(res => {
        // console.log(res)
        this.setState({
          logged_in: true,
          delay: true,
        });
        // console.log('netid state has been set')
        this.getUserPermissions();
      })
      .catch(function (error) {
        alert('NetID login was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
    }
    else {
      this.getUserPermissions();
    }
  }

  getUserPermissions() {
    axios.get('api/users/who_am_i/').then(res => {
      // console.log(res.data)
      if (res.data.current_user != '') {
        this.setState({
          logged_in: true,
          user_first: res.data.first_name,
          user_last: res.data.last_name,
          username: res.data.current_user,
          is_admin: res.data.is_admin,
         });
        //  console.log('going to fill DCs')
         this.resetDatacenter();
        }
    })
      .catch(error => {
        // console.log(error.response)
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

    // console.log(!this.state.logged_in)
    // console.log(this.setDatacenter.datacenterOptions===undefined)
    // console.log(this.setDatacenter.datacenterOptions.length===0)

    let no_render = !this.state.logged_in || this.setDatacenter.datacenterOptions===undefined;

    // console.log(no_render)

    if (!this.state.logged_in) {
     content =
     <div id="contentContainer">
      <LandingPage />
      <div id='login'>
        <Button color='primary' onClick={this.handleOnClick}>
          Log In!
      </Button>
      </div>
    </div>;
  }
  // console.log(this.state.delay)

    return (
      <DatacenterContext.Provider value={{...this.state, setDatacenter: this.setDatacenter, resetDatacenter: this.resetDatacenter}}>
      <div>
      { (this.state.delay  ?
      <p></p> :
      (<center>{content}</center>))}
      { this.state.datacenterOptions &&
      <Router>
        <NavBar />
        <Switch>
          <Route path='/'
          exact
          render={(props) =>
          <DatacenterController {...props}/>}/>

          <Route
            path='/racks'
            exact
            render={(props) =>
            <RackController {...props}/>}/>

          <Route
            path='/datacenters'
            exact
            render={(props) =>
            <DatacenterController {...props}/>}
            />

          <Route
            path='/datacenters/create'
            exact
            render={(props) => <CreateDatacenterForm {...props} />}/>

          <Route
            path='/datacenters/:id/edit'
            exact
            render={(props) => <EditDatacenterForm {...props}/>}/>

          <Route
            path='/racks/create'
            exact
            render={(props) => <CreateRackForm {...props} />} />

          <Route
            path='/racks/:id/edit'
            exact
            render={(props) => <EditRackForm {...props}/>} />

          <Route
            path='/racks/delete'
            exact
            render={(props) => <DeleteMultipleRacksForm {...props} />} />


          <Route
            path='/models'
            exact
            render={(props) => <ModelController {...props} />} />

          <Route
            path='/models/create'
            exact
            render={(props) => <CreateModelForm {...props} />} />

          <Route
            path='/models/:id'
            exact
            render={(props) => <DetailedModel {...props} />} />

          <Route
            path='/models/:id/edit'
            exact
            render={(props) => <EditModelForm {...props} />} />

          <Route
            path='/assets'
            exact
            render={(props) => <InstanceController {...props} />} />

          <Route
            path='/assets/create'
            exact
            render={(props) => <CreateInstanceForm {...props} />} />

          <Route
            path='/assets/:id'
            exact
            render={(props) => <DetailedInstance {...props} />} />

          <Route
            path='/assets/:id/edit'
            exact
            render={(props) => <EditInstanceForm {...props} />} />

          <Route
            path='/users'
            exact
            render={(props) => <UserController {...props} />} />

          <Route
            path='/users/:id/edit'
            exact
            render={(props) => <EditUserForm {...props}/>} />

          <Route
            path='/users/create'
            exact
            render={(props) => <CreateUserForm {...props} />} />

          <Route
            path='/statistics'
            render={(props) => <StatisticsController {...props} />} />

          <Route
            path='/log'
            render={(props) => <AuditController {...props} />} />

          <Route
            path='/'
            render={() => <div>404</div>} />

        </Switch>

      </Router>}
    </div>
    </DatacenterContext.Provider>
    )
  }
}

export default App;
