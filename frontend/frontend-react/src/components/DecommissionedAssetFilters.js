import React, { Component } from 'react'
import { Button, TextField, Grid, Input, Container, FormControl } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


export class DecommissionedAssetFilters extends Component {

  constructor() {
    super();
    this.state = {
      identifiers: {
        dateStart: null,
        dateEnd: null,
        username: null,
      }
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = () => {

  }

  handleStartDateChange = (date) => {
    console.log(date)
    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
    identifiersCopy.dateStart = date
    this.setState({
      identifiers: identifiersCopy
    })
  }

  handleEndDateChange = (date) => {
    console.log(date)
    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
    identifiersCopy.dateEnd = date
    this.setState({
      identifiers: identifiersCopy
    })
  }

  render() {
    console.log(JSON.stringify(this.state, null, 2))
    return (
      <div>
        <Container maxWidth="xl">
          <form onSubmit={this.handleSubmit}>
            <h4>Filters</h4>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <TextField label='Username' type="text" fullWidth
                  onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.username = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  }} />
              </Grid>


              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={4}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Start date"
                    value={this.state.identifiers.dateStart}
                    onChange={this.handleStartDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="End date"
                    value={this.state.identifiers.dateEnd}
                    onChange={this.handleEndDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>


            </Grid>
          </form>
        </Container>
      </div>
    )
  }
}

export default DecommissionedAssetFilters
