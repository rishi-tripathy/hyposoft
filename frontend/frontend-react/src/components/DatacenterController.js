import React, {Component, useState} from 'react'
import FilterListIcon from '@material-ui/icons/FilterList';
import axios from 'axios'
import '../stylesheets/Printing.css'
import '../stylesheets/RackTable.css'
import '../stylesheets/RacksView.css'
import {UncontrolledCollapse, CardBody, Card} from 'reactstrap';
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, Typography
} from "@material-ui/core"
import {Link} from 'react-router-dom'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DatacenterController extends Component {
 
    render() {
        return(
            <div>
                sup datacenterz
            </div>
        )
    }
}

export default DatacenterController
