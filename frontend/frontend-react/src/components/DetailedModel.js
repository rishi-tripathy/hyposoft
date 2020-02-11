import React, { Component } from 'react'
import axios from 'axios'
import ModelCard from './ModelCard'
import DetailedInstance from './DetailedInstance'
import AllInstancesOfModelView from './AllInstancesOfModelView';
import DetailedInstanceFromModel from './DetailedInstanceFromModel';
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel
} from '@material-ui/core'
import PropTypes from 'prop-types';

axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedModel extends Component {

  constructor() {
    super();
    this.state = {
      model: {
        // 'id': 37,
        // 'vendor': 'Dell',
        // 'model_number': '34d',
        // 'height': 3,
        // 'display_color': '000000',
        // 'ethernet_ports': null,
        // 'power_ports': null,
        // 'cpu': '',
        // 'memory': null,
        // 'storage': '',
        // 'comment': '',
        
      },
      detailedInstanceID: 0,
      showIndividualInstanceView: false,
      showTableView : true,
    }
  }

  getShowDetailedInstance = (show) => {
    show ? this.setState({
      showIndividualInstanceView: true,
      // everything else false
      showTableView : false,
    })
    : this.setState({
      showIndividualInstanceView : false,
    }) 
  }

  getShowTableView = (show) => {
    show ? this.setState({
      showTableView : true,
      // everything else false
      showIndividualInstanceView: false,
    })
    : this.setState({
      showTableView : false,
    })
  }

  getDetailedInstanceID = (id) => {
    this.setState({ detailedInstanceID: id});
  }

  loadModelData = () => {
    if (this.props.match.params.id) {
      let dst = '/api/models/'.concat(this.props.match.params.id).concat('/');
      console.log(dst);
      axios.get(dst).then(res => {
        this.setState({
          model: res.data
        });
      })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load models. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
    }
  }

  componentDidMount() {
    this.loadModelData();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props.modelID !== undefined) {
  //     this.loadModelData();
  //   }
  // }

  render() {
    console.log(this.props.match)
    let content = <AllInstancesOfModelView modelID={this.state.model.id} 
                  sendInstanceID={ this.getDetailedInstanceID }
                  sendShowDetailedInstance={ this.getShowDetailedInstance } />;

    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item xs={12}>
              <ModelCard model={ [this.state.model] } />
            </Grid>
            <Grid item xs={12}>
              {content}
            </Grid>
          </Grid>
        </Container>
        {/* // TODO: this is such bad code lmao */}
        
        {/* <br></br>
        <br></br>
        <h4>Instances of this Model</h4>
        { content } */}
      </div>
    )
  }
}

DetailedModel.propTypes = {
  //modelID: PropTypes.number.isRequired,
  //sendShowTable: PropTypes.func.isRequired,
}

export default DetailedModel
