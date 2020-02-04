import React from 'react';
import '../stylesheets/SideBar.css'
import ModelController from './ModelController'
import InstanceController from './InstanceController'
import RackController from './RackController'
import Landing from './Landing'
import axios from 'axios'
import UserController from './UserController';
import StatisticsController from './StatisticsController';
import { Button } from 'reactstrap'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class SideBar extends React.Component{
    constructor() {
        super();
        this.state = {
            racks: true,
            models: false,
            instances: false,
            users: false,
            statistics: false,
            admin: false,
        };
        this.showRacks = this.showRacks.bind(this);
        this.showModels = this.showModels.bind(this);
        this.showInstances = this.showInstances.bind(this);
        this.showUsers = this.showUsers.bind(this);
        this.showStatistics = this.showStatistics.bind(this);

    }

    hideAll = () => {
        this.setState({
            racks: false,
            models: false,
            instances: false,
            users: false,
            statistics: false,
        });
    }

    showRacks() {
        this.setState({
            racks: true,
            models: false,
            instances: false,
            users: false,
            statistics: false,
        });
    }

    showModels() {
        this.forceUpdate();
        this.setState({
            racks: false,
            models: true,
            instances: false,
            users: false,
            statistics: false,
        });
    }
    
    showInstances() {
        this.setState({
            racks: false,
            models: false,
            instances: true,
            users: false,
            statistics: false,
        });
    }

    showUsers() {
        this.setState({
            racks: false,
            models: false,
            instances: false,
            users: true,
            statistics: false,
        });
    }

    showStatistics() {
        this.setState({
            racks: false,
            models: false,
            instances: false,
            users: false,
            statistics: true,
        });
    }

    render() {
        
        const rackState = this.state.racks;
        const modelState = this.state.models;
        const instanceState = this.state.instances;
        const userState = this.state.users;
        const statisticState = this.state.statistics;

        let content;

            if (rackState){
                content = <RackController />
              }
              else if (modelState){
                  content = <ModelController />
              }
              else if (instanceState){
                  content= <InstanceController />
              }
              else if (userState){
                content = <UserController />
              }
              else if (statisticState) {
                  content = <StatisticsController />
              }

        return(
            <div>
                    <div id ="Content">
                        <div id="header">
                            <Landing />
                            <br></br>
                            <br></br>
                        </div>
                        {content}
                    </div>
                    <div id="Side-bar">
                        <ul>
                            <Button color="success" onClick={this.showRacks} size="lg" block>Racks</Button>
                            <Button color="success" onClick={this.showModels} size="lg" block>Models</Button>
                            <Button color="success" onClick={this.showInstances} size="lg" block>Instances</Button>
                            <Button color="success" onClick={this.showUsers} size="lg" block>Users</Button>
                            <Button color="success" onClick={this.showStatistics} size="lg" block>Statistics</Button>
                        </ul>
                </div>
            </div>
        );
    }
}

export default SideBar;
