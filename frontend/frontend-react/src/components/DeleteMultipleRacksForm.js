import React, {Component} from 'react'
import axios from 'axios'
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, TextField
} from "@material-ui/core"
import {Link} from 'react-router-dom'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DeleteMultipleRacksForm extends Component {
  constructor() {
    super();
    this.state = {
      'rack_num_start': null,
      'rack_num_start_valid': false,
      'rack_num_end': null,
      'rack_num_end_valid': false
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let start_rack = this.state.rack_num_start;
    let end_rack = this.state.rack_num_end;
    let stateCopy = Object.assign({}, this.state);
    let stateToSend = this.removeEmpty(stateCopy);

    //validate

    // console.log(start_rack);
    // console.log(end_rack);

    const validNumRegex = new RegExp("^[A-Z]\\d+$", 'i');
    // console.log(validNumRegex);

    if (validNumRegex.test(start_rack) && validNumRegex.test(end_rack)) {
      //  console.log(stateToSend);

      axios.delete('/api/racks/many/', {
        data: stateToSend
      })
        .then(function (response) {
          console.log(response);
          let message = response.data.results;
          alert(response.data.results);
          this.props.sendShowTable(true);
        })
        .catch(function (error) {
          alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
        });
    } else {
      alert("Rack Numbers must be specified by a Single Capital Letter Followed by Multiple Numbers.");
      return
    }
    this.props.sendShowTable(true);
  }

  render() {
    let start_rack;
    let end_rack;
    return (
      <Container maxwidth="s">
        <Link to='/racks/'><Button variant="outlined">Back</Button>{' '}</Link>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <h1>Delete Racks</h1>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Deletion Range Start' type="text" fullWidth
                         onChange={e => this.setState({rack_num_start: e.target.value})}/>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Deletion Range End' type="text" fullWidth
                         onChange={e => this.setState({rack_num_end: e.target.value})}/>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" color="primary" onClick={() => this.handleSubmit}>Delete
                -</Button>{' '}
            </Grid>
          </Grid>
        </form>
      </Container>
    )
  }

}

export default DeleteMultipleRacksForm