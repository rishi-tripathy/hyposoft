import React, { Component } from 'react'
import axios from 'axios'
import { CircularProgressbar } from 'react-circular-progressbar';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../stylesheets/TableView.css'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class StatisticsController extends Component {

  constructor() {
    super();
    this.state = {
      rackspace_used: null,
      rackspace_free: null,
      models_allocated: [],
      vendors_allocated: [],
      owners_allocated: [],
    }
  }

  componentDidMount() {
    let dst = '/report/';
    axios.get(dst).then(res => {
      this.setState({ 
        rackspace_used: Math.round(res.data.rackspace_used * 10) / 10,
        rackspace_free: Math.round(res.data.rackspace_free * 10) / 10,
        models_allocated: res.data.models_allocated,
        vendors_allocated: res.data.vendors_allocated,
        owners_allocated: res.data.owners_allocated,
      });
    })
    .catch(function (error) {
      alert('Could not get report.\n' + JSON.stringify(error.response.data));
    });
  }

  renderModelsData() {
    const models = Object.entries(this.state.models_allocated);
    console.log(models);
    return models.map((model) => {
       return (
          <tr>
						<td>{model[0]}</td>
            <td>{model[1]}</td>
          </tr>
       )
    })
  }
  
  renderVendorsData() {
    const vendors = Object.entries(this.state.vendors_allocated);
    return vendors.map((vendor) => {
       return (
          <tr>
						<td>{vendor[0]}</td>
						<td>{vendor[1]}</td>
          </tr>
       )
    })
  }
  
  renderOwnersData() {
    const owners = Object.keys(this.state.owners_allocated);
    return owners.map((owner) => {
       return (
          <tr>
						<td>{owner[0]}</td>
						<td>{owner[1]}</td>
          </tr>
       )
    })
	}
  
  render() {
    
    return (
      <div>
  
        <div style={{ width: "30%" }}>
          <CircularProgressbarWithChildren value={this.state.rackspace_used}>
            {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
            <div style={{ width: 60, fontSize: 20, marginTop: -5 }}>
              <strong>{this.state.rackspace_used}</strong> Rack-space used
            </div>
          </CircularProgressbarWithChildren>
        </div>

        <div style={{ width: "30%" }}>
          <CircularProgressbarWithChildren value={this.state.rackspace_free}>
            {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
            <div style={{ width: 60, fontSize: 20, marginTop: -5 }}>
              <strong>{this.state.rackspace_free}</strong> Rack-space free
            </div>
          </CircularProgressbarWithChildren>
        </div>

        <div>
          <table id="entries">
            <tbody>
              <tr>
                <th>Models Allocated</th>
                <th>Number (#)</th>
              </tr>
              { this.renderModelsData() }
            </tbody>
          </table>
        </div>

        <div>
          <table id="entries">
            <tbody>
              <tr>
                <th>Vendors Allocated</th>
                <th>Number (#)</th>
              </tr>
              { this.renderVendorsData() }
            </tbody>
          </table>
        </div>

        <div>
          <table id="entries">
            <tbody>
              <tr>
                <th>Owners Allocated</th>
                <th>Number (#)</th>
              </tr>
              { this.renderOwnersData() }
            </tbody>
          </table>
        </div>
        
      </div>
    )
  }
}

export default StatisticsController
