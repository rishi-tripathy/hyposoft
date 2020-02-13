import React, {Component} from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import DetailedModelFromInstance from './DetailedModelFromInstance'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, Container, Grid
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import {Link} from 'react-router-dom'
import ModelCard from "./ModelCard";

axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedInstance extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      instance:
        {}
    }
  }

  loadInstance = () => {
    if (this.props.match.params.id) {
      let dst = '/api/instances/'.concat(this.props.match.params.id).concat('/');
      axios.get(dst).then(res => {
        this.setState({
          instance: res.data
        });
      })
        .catch(function (error) {
          // TODO: handle error
          alert('Cannot load instances. Re-login.\n' + JSON.stringify(error.response, null, 2));
        });
    }
  }

  componentDidMount() {
    this.loadInstance();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadInstance();
    }

  }

  render() {
    const {id, model, hostname, rack, rack_u, owner, comment} = this.state.instance;
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12}/>
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Detailed Instance View
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <InstanceCard is_admin={this.props.is_admin}
                              inst={[this.state.instance]}/>
              </Paper>
            </Grid>
            <Grid item alignContent='center' xs={12}/>
            <Grid item alignContent='center' xs={12}/>
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h6">
                Model for this Asset
              </Typography>
              {model ? (
                <div>
                  <Link to={'/models/' + model.id}>
                    <Tooltip title='View Model Details'>
                      {/* onClick={() => this.showDetailedModel(id)} */}
                      <IconButton size="sm">
                        <PageviewIcon/>
                      </IconButton>
                    </Tooltip>
                  </Link>
                </div>
              ) : <p></p>}
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default DetailedInstance
