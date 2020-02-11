import React, { Component } from 'react'
import axios from 'axios'
// import { Button, Table } from '@material-ui/core'
import { Link } from 'react-router-dom'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';

 
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class AllInstancesOfModelView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      instances: [{}]
    }
  }

  showDetailedInstance = (id) => {
    this.props.sendShowDetailedInstance(true);
    this.props.sendInstanceID(id);
  }

  loadInstances = () => {
    if (this.props.modelID) {
      let dst = '/api/models/'.concat(this.props.modelID).concat('/instances/');
      console.log(dst)
      axios.get(dst).then(res => {
        this.setState({
          instances: res.data.results
        });
      })
        .catch(function (error) {
          // TODO: handle error
          alert('Cannot load instances. Re-login..\n' + JSON.stringify(error.response.data, null, 2));
        });
    }
  }

  componentDidMount() {
    this.loadInstances();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.modelID !== this.props.modelID) {
      this.loadInstances();
    }
  }

  renderTableHeader() {
    let headCells = [
      { id: 'hostname', numeric: false, disablePadding: false, label: 'Hostname' },
      { id: 'rack', numeric: false, disablePadding: false, label: 'Rack' },
      { id: 'rack_u', numeric: true, disablePadding: false, label: 'Rack (U)' },
    ];
    return headCells.map(headCell => (
      <TableCell
        key={headCell.id}
        align={headCell.numeric ? 'right' : 'left'}
        padding={headCell.disablePadding ? 'none' : 'default'}
      // sortDirection={orderBy === headCell.id ? order : false}
      >
        {/*<TableSortLabel*/}
        {/*  active={orderBy === headCell.id}*/}
        {/*  direction={orderBy === headCell.id ? order : 'asc'}*/}
        {/*  onClick={createSortHandler(headCell.id)}*/}
        {/*>*/}
        {headCell.label.toUpperCase()}
        {/*  {orderBy === headCell.id ? (*/}
        {/*    <span className={classes.visuallyHidden}>*/}
        {/*      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}*/}
        {/*    </span>*/}
        {/*  ) : null}*/}
        {/*</TableSortLabel>*/}
      </TableCell>
    ))
  }

  renderTableData() {
    //if (this.state.instances == null) return;
    return this.state.instances.map((instance) => {
      const { id, model, hostname, rack, owner, rack_u } = instance //destructuring
      // return (
      //   <tr key={id}>
      //     <td>{hostname}</td>
      //     <td>{rack ? rack.rack_number : null}</td>
      //     <td>{rack_u}</td>
      //     <td>
      //       <Link to={'/assets/' + id}>
      //         <Button color="info">More details</Button>
      //       </Link>
      //     </td>
      //   </tr>
      // )
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{hostname}</TableCell>
          <TableCell align="right">{rack ? rack.rack_number : null}</TableCell>
          <TableCell align="right">{rack_u}</TableCell>
          <TableCell align="right">
            <Link to={'/assets/' + id}>
              <Tooltip title='View Details'>
                {/* onClick={() => this.showDetailedModel(id)} */}
                <IconButton size="sm" >
                  <PageviewIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </TableCell>   
        </TableRow>
      )



    })
  }

  render() {
    return (
      <div>
        <Paper>
          <TableContainer>
            <Table
              aria-labelledby="modelTableTitle"
              aria-label="enhanced table"
            >
              <TableRow>{this.renderTableHeader()}</TableRow>

              <TableBody>
                {this.renderTableData()}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        {/* <h3>Instances of this Model</h3> */}
      </div>
    )
  }
}

export default AllInstancesOfModelView
