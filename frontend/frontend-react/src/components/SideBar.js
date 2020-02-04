import React from 'react';
import '../stylesheets/SideBar.css'
import ModelController from './ModelController'
import InstanceController from './InstanceController'
import RackController from './RackController'
import Landing from './Landing'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class SideBar extends React.Component{
    constructor() {
        super();
        this.state = {
            racks: true,
            models: false,
            instances: false,
            admin: false,
        };
        this.showRacks = this.showRacks.bind(this);
        this.showModels = this.showModels.bind(this);
        this.showInstances = this.showInstances.bind(this);

    }

    showRacks() {
        this.setState({
            racks: true,
            models: false,
            instances: false,
        });
    }

    showModels() {
        this.setState({
            racks: false,
            models: true,
            instances: false,
        });
    }
    
    showInstances() {
        this.setState({
            racks: false,
            models: false,
            instances: true,
        });
    }

    render() {
        
        const rackState = this.state.racks;
        const modelState = this.state.models;
        const instanceState = this.state.instances;

        let content;

            if (rackState){
                content = <RackController />
              }
              else if (modelState){
                  content = <ModelController />
              }
              else {
                  content= <InstanceController />
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
                    <div id="hideOnPrint">
                        <div id="Side-bar">
                            <ul>
                                <div className="myButton" onClick={this.showRacks}> Racks</div>
                                <div className="myButton" onClick={this.showModels}> Models</div>
                                <div className="myButton" onClick={this.showInstances}> Instances</div>
                            </ul>
                        </div>
                    </div>
            </div>
        );
    }
}

export default SideBar;
