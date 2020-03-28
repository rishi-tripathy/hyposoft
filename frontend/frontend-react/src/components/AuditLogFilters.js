import React, {Component} from 'react'
import {Button, TextField, Grid, Input, Container, FormControl} from "@material-ui/core";

export class AuditLogFilters extends Component {

  constructor() {
    super();
    this.state = {
      identifiers: {
        user: '',
        hostname: '',
      },
      query: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  createQuery = () => {
    const {user, hostname} = this.state.identifiers;
    console.log(this.state.identifiers)

    // NO '?' here!!
    let q = '' +
      'user=' + user + '&' +
      'hostname=' + hostname + '&'
    this.setState({ query: q });
    return q;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let stateCopy = Object.assign({}, this.state.identifiers);
    let stateToSend = this.removeEmpty(stateCopy);

    console.log(stateToSend)
    console.log(this.createQuery())

    this.props.sendFilterQuery(this.createQuery());
  }

  render() {
    return (
      <div>
        <Container maxWidth="xl">
          <form onSubmit={this.handleSubmit}>
            <h4>Filter</h4>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <TextField label='Hostname' type="text" fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.hostname = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={3}>
                <TextField label='Username' type="text" fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.user = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" type="submit" color="primary" onClick={() => this.handleSubmit}>Searchs</Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </div>
    )
  }
}

export default AuditLogFilters
