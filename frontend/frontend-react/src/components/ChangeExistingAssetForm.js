import React, {Component} from 'react'
import axios from 'axios'
import {Autocomplete} from "@material-ui/lab"
import {
  Button, Container, TextField,
  Grid, Input, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography,
  Tooltip, Paper, List,
  ListItem, Card, CardContent
} from "@material-ui/core";
import {Redirect, Link} from 'react-router-dom'
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from '@material-ui/icons/Cancel';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ChangeExistingAssetForm extends Component {
    
    constructor() {
        super();
        this.state = {
            selectedAssetId: 5, //eventually from id from form
            changePlanId: 1,
            asset: null,
        }
    }

    componentDidMount() {
        this.getAssetData();
    }

    getAssetData= () => {
        let dst = '/api/assets/5/'
        console.log(dst)

        axios.get(dst).then(res => {
            this.setState({
                asset: res.data,
            });
            console.log(this.state.asset)
        })
        .catch(function (error) {
            alert('something went wrong! try again \n' + error.response);
        });
    }

    render() {
        return(
            <div>
            <Container maxwidth="xl">
                <Grid container className="themed-container" spacing={2}>
                  <Grid item justify="flex-start" alignContent='center' xs={12}/>
                  <Grid item justify="flex-start" alignContent='center' xs={10}>
                    <Typography variant="h3">
                        Changing Asset: {this.state.selectedAssetId}
                    </Typography>
                  </Grid>
                  <Grid item justify="flex-start" alignContent='center' xs={10}>
                  <Typography variant="h5" >
                    in Change Plan: {this.state.changePlanId}
                  </Typography>
                  </Grid>

                  {/* column 1 */}
                  <Grid item justify="flex-start" alignContent='center' xs={6}>
                    <Card>
                        <CardContent>
                            <Container maxwidth="xl">
                            <Grid container className="themed-container" spacing={2}>
                            <Grid item justify="flex-start" alignContent='center' xs={6}>
                            <Typography variant="h4" >
                                Live View
                            </Typography>
                            </Grid>
                            <Grid item justify="flex-start" alignContent='center' xs={6} />
                            <Grid item justify="flex-start" alignContent='center' xs={6} />
                                <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Asset ID</TableCell>
                                        <TableCell align="center">Hostname</TableCell>
                                        <TableCell align="center">Datacenter</TableCell>
                                        <TableCell align="center">Rack</TableCell>
                                        <TableCell align="center">Rack U</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    {this.state.asset!==null &&
                                    <TableBody>
                                    <TableRow>
                                        <TableCell align="center">{this.state.asset['id']}</TableCell>
                                        <TableCell align="center">{this.state.asset['hostname']}</TableCell>
                                        <TableCell align="center">{this.state.asset['datacenter'].abbreviation}</TableCell>
                                        <TableCell align="center">{this.state.asset['rack'].rack_number}</TableCell>
                                        <TableCell align="center">{this.state.asset['rack_u']}</TableCell>
                                    </TableRow>
                                    </TableBody>}
                                </Table>
                                </TableContainer>
                            <Grid item justify="flex-start" alignContent='center' xs={6} />
                            <Grid item justify="flex-start" alignContent='center' xs={6} />
                            <Card>
                            </Card>
                        </Grid>
                        </Container>
                        </CardContent>
                    </Card>
                  </Grid>

                  {/* column 2 */}
                  <Grid item justify="flex-start" alignContent='center' xs={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" >
                                Changes to Add
                            </Typography>
                        </CardContent>
                    </Card>
                  </Grid>

                </Grid>
              </Container>
            </div>
        )
    }

}

export default ChangeExistingAssetForm