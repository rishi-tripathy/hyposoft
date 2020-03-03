import React, {Component} from 'react'
import axios from 'axios'
import {CircularProgressbar} from 'react-circular-progressbar';
import {CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../stylesheets/TableView.css'
import {UncontrolledCollapse, Button, ButtonGroup, Table, Container, Card, Row, Col} from 'reactstrap';
import DatacenterContext from './DatacenterContext';
import {Grid, Typography, CircularProgress} from "@material-ui/core";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class StatisticsController extends Component {

  constructor() {
    super();
    this.state = {
      datacenter: null,
      rackspace_used: null,
      rackspace_free: null,
      models_allocated: [],
      vendors_allocated: [],
      owners_allocated: [],
      loading: true,
    }
  }

  componentDidMount() {
    console.log(this.context.datacenter_ab)
    console.log(this.context.datacenter_ab)
    this.refreshDatacenter();
  }

  refreshDatacenter = () => {
    this.setState({
      datacenter: this.context.datacenter_ab
    })
    let dst;
    if (this.state.datacenter == null || this.state.datacenter == 'ALL') {
      dst = '/report/?show_all=true';
    } else {
      dst = '/report/?datacenter=' + this.state.datacenter;
    }
    console.log(dst)
    axios.get(dst).then(res => {
      console.log(res)
      this.setState({
        rackspace_used: Math.round(res.data.rackspace_used * 10) / 10,
        rackspace_free: Math.round(res.data.rackspace_free * 10) / 10,
        models_allocated: res.data.models_allocated,
        vendors_allocated: res.data.vendors_allocated,
        owners_allocated: res.data.owners_allocated,
        loading: false,
      });
    })
      .catch(function (error) {
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  componentDidUpdate(prevProps, prevState) {
    var delay = 70;
    console.log(this.state.datacenter)
    console.log(this.context.datacenter_ab)
    if (this.context.datacenter_ab !== this.state.datacenter || (this.context.datacenter_ab === null && this.state.datacenter === undefined)) {
      console.log('datacenter selection has changed')
      setTimeout(() => {
        this.refreshDatacenter();
      }, delay);
    }
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
    const owners = Object.entries(this.state.owners_allocated);
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
    let name;
    if (this.context.datacenter_ab == null) {
      name = 'All Datacenters'
    } else {
      name = this.context.datacenter_ab;
    }

    return (
      <Container className="themed-container">
       {this.state.loading 
       ? <center>
          <CircularProgress size={100}/>
        </center>
       :
       <div>
        <Typography variant="h3">
        Statistics in {name}
        </Typography>
       <br></br>
        <Typography variant="h7">
          Use the selector in the navigation bar to change datacenters.
        </Typography>
        <Row>
          <Col xs="6">
            <div style={{width: "60%"}}>
              <CircularProgressbarWithChildren value={this.state.rackspace_used}>
                {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
                <div style={{width: 60, fontSize: 20, marginTop: -5}}>
                  <strong>{this.state.rackspace_used + '%'}</strong> Rack-space used
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </Col>
          <Col xs="6">
            <div style={{width: "60%"}}>
              <CircularProgressbarWithChildren value={this.state.rackspace_free}>
                {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
                <div style={{width: 60, fontSize: 20, marginTop: -5}}>
                  <strong>{this.state.rackspace_free + '%'}</strong> Rack-space free
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </Col>
        </Row>

        <br></br>
        <br></br>

        <h3>Model Allocation</h3>
        <Row>
          <Col xs="6">
            <div>
              <Table hover striped>
                <tbody>
                <tr>
                  <th>Models Allocated</th>
                  <th>Number (#)</th>
                </tr>
                {this.renderModelsData()}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>

        <br></br>
        <br></br>

        <h3>Vendor Allocation</h3>
        <Row>
          <Col xs="6">
            <div>
              <Table hover striped>
                <tbody>
                <tr>
                  <th>Vendors Allocated</th>
                  <th>Number (#)</th>
                </tr>
                {this.renderVendorsData()}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>

        <br></br>
        <br></br>

        <h3>Owner Allocation</h3>
        <Row>
          <Col xs="6">
            <div>
              <Table hover striped>
                <tbody>
                <tr>
                  <th>Owners Allocated</th>
                  <th>Number (#)</th>
                </tr>
                {this.renderOwnersData()}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
     </div>
      }
      </Container>
    )
  }
}

StatisticsController.contextType = DatacenterContext;

export default StatisticsController
