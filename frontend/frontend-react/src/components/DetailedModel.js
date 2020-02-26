import React, { Component } from 'react'
import axios from 'axios'
import ModelCard from './ModelCard'
import AllInstancesOfModelView from './AllInstancesOfModelView';
import Typography from '@material-ui/core/Typography';

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
      },
      detailedInstanceID: 0,
      showIndividualInstanceView: false,
      showTableView: true,
    }
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

  getShowDetailedInstance = (show) => {
    show ? this.setState({
      showIndividualInstanceView: true,
      // everything else false
      showTableView: false,
    })
      : this.setState({
        showIndividualInstanceView: false,
      })
  }

  getDetailedInstanceID = (id) => {
    this.setState({ detailedInstanceID: id });
  }

  componentDidMount() {
    this.loadModelData();
  }

  render() {
    console.log(this.props.match)
    // let content = <AllInstancesOfModelView modelID={this.state.model.id}
    //   sendInstanceID={this.getDetailedInstanceID}
    //   sendShowDetailedInstance={this.getShowDetailedInstance} />;

    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Detailed Model View
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <ModelCard model={[this.state.model]} />
              </Paper>
            </Grid>
            <Grid item alignContent='center' xs={12} />
            <Grid item xs={6}>
              <Typography variant="h4" gutterBottom>
                Assets
              </Typography>
            </Grid>
            <Grid item xs={6} />
            <Grid item xs={6}>
              <Paper>
                <AllInstancesOfModelView modelID={this.state.model.id}
                  sendInstanceID={this.getDetailedInstanceID}
                  sendShowDetailedInstance={this.getShowDetailedInstance} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

DetailedModel.propTypes = {
  //modelID: PropTypes.number.isRequired,
  //sendShowTable: PropTypes.func.isRequired,
}

export default DetailedModel
