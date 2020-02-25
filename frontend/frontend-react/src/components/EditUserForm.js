import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import {
  Button, Container, FormLabel, RadioGroup, Radio,
  Grid, Input, FormControl, FormControlLabel, Typography,
} from "@material-ui/core";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditUserForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
        'initial_admin_state': null,
        'is_admin': null,
    }
  }

  componentDidMount() {
    let dst = '/api/users/'.concat(this.props.editID).concat('/');
    axios.get(dst).then(res => {
        console.log(res.data)
        this.setState({
            initial_admin_state: res.data
        })
      })
      .catch(function (error) {
        alert(JSON.stringify(error.response.data, null, 2));
      });
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
   console.log(this.state.is_admin)
  }

   handleChange = (event) => {
    this.setState({ is_admin: event.target.value});
  };

  render() {
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Edit User
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Permissions</FormLabel>
                    <RadioGroup aria-label="permissions" name="permissions" value={this.state.is_admin} onChange={this.handleChange}>
                        <FormControlLabel value='true' control={<Radio />} label="Administrator" />
                        <FormControlLabel value='false' control={<Radio />} label="User" />
                    </RadioGroup>
                </FormControl>
                </Grid>
                </Grid>
            </form>
          </Grid>
        </Container> 
      </div>
    )
  }
}

EditUserForm.propTypes = {
  editID: PropTypes.object.isRequired
}

export default EditUserForm
