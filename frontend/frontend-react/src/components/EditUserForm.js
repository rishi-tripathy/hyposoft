import React, {Component} from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'
import {
  Button, Container, FormLabel, RadioGroup, Radio,
  Grid, Input, FormControl, FormControlLabel, Typography, Tooltip,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditUserForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'is_admin': false,
      'username': '',
      'redirect': false
    }
  }

  componentDidMount() {
    const editID = this.props.match.params.id
    console.log(editID)
    let dst = '/api/users/'.concat(this.props.match.params.id).concat('/');
    axios.get(dst).then(res => {
      console.log(res.data)
      this.setState({
        is_admin: res.data.is_superuser,
        username: res.data.username
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
    e.preventDefault();
    let dst = '/api/users/'.concat(this.props.match.params.id).concat('/');

    let stateCopy = Object.assign({}, this.state.instance);

    stateCopy.is_admin = this.state.is_admin
    console.log(stateCopy)
    var self = this;
    axios.patch(dst, stateCopy)
      .then(function (response) {
        alert('Edit was successful');
        self.setState({
          redirect: true
        })
      })
      .catch(function (error) {
        alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }


  handleChange = (event) => {
    this.setState({is_admin: event.target.value});
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={{pathname: '/users'}}/>

    }
    let header = <Typography variant="h3" gutterBottom>
      Edit User: {this.state.username}
    </Typography>
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12}/>
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  {header}
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Permissions</FormLabel>
                    <RadioGroup aria-label="permissions" name="permissions" value={this.state.is_admin.toString()}
                                onChange={this.handleChange}>
                      <FormControlLabel value='true' control={<Radio/>} label="Administrator"/>
                      <FormControlLabel value='false' control={<Radio/>} label="User"/>
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title='Submit'>
                    <Button variant="contained" type="submit" color="primary"
                            onClick={() => this.handleSubmit}>Update
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={2}>
                  <Link to={'/users'}>
                    <Tooltip title='Cancel'>
                      <Button variant="outlined" type="submit" color="primary" endIcon={<CancelIcon/>}>Cancel</Button>
                    </Tooltip>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Container>
      </div>
    )
  }
}


export default EditUserForm
