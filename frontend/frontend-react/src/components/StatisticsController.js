import React, {Component} from 'react'
import axios from 'axios'
import {CircularProgressbar} from 'react-circular-progressbar';
import {CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../stylesheets/TableView.css'
import {UncontrolledCollapse, Button, ButtonGroup, Table, Container, Card, Row, Col} from 'reactstrap';

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
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
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

    return (
      <Container className="themed-container">
        <h2>Statistics</h2>
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
      </Container>
    )
  }
}

export default StatisticsController
