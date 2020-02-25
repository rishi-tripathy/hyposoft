import React, {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import ModelFilters from './ModelFilters';
import '../stylesheets/TableView.css'
// import AuditLogFilters from './AuditLogFilters'
import axios, {post} from 'axios'
import {Link} from 'react-router-dom'


axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class AuditLogTable extends Component {

    constructor(){
        super();

        this.state={
            filtersOpen: false,

        };
    }

    handleOpenFilters = () => {
        this.setState(prevState => ({
          filtersOpen: !prevState.filtersOpen
        }));
      }

    renderTableToolbar = () => {
        return (
          <Toolbar>
            {
              <Typography style={{flex: '1 1 20%'}} variant="h6" id="modelTableTitle">
                Audit Logs
              </Typography>
            }    
        <Collapse in={this.state.filtersOpen}>
          <Paper>
            {
              // <AuditLogFilters sendAuditLogQuery={this.props.filter_query}/>
            }
          </Paper>
        </Collapse>
        <Tooltip title="Filter list">
          <Button endIcon={<FilterListIcon/>} onClick={() => this.handleOpenFilters()} aria-label="filter logs">
            Filter
          </Button>
        </Tooltip>
          </Toolbar>
        );
      };
    
      renderTableHeader() {
        let headCells = [
          {id: 'user', label: 'User'},
          {id: 'action', label: 'Action'},
          {id: 'datetime', label: 'Date and Time'},
        ];
        return headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={'default'}
    
          >
            {/* <TableSortLabel
              active={this.state.sortBy === headCell.id}
              hideSortIcon={!(this.state.sortBy === headCell.id)}
              direction={this.state.sortBy === headCell.id ? this.state.sortType : false}
              onClick={() => this.handleHeaderClickSort(headCell.id)}
            > */}
              {headCell.label.toUpperCase()}
            {/* </TableSortLabel> */}
          </TableCell>
        ))
      }

      handleClick = (type, id) => {
        if(type === 'user'){
            console.log('user' + id)
        }
        else if (type === 'datacenters'){
            console.log('dc' + id)
        }
        else if(type ==='racks'){
            console.log('racks' + id)
        }
      }
    
      renderTableData() {
        if (this.props.objectList.length === 0){
        return (
          <TableRow hover tabIndex={-1}>
            <TableCell align="center" colSpan={12}>No entries</TableCell>
          </TableRow>
        )}
        else{
            console.log(this.props.objectList.length)
            return this.props.objectList.map((object, i) => {
                console.log(this.props.objectList[i])
                console.log(this.props.userList[i])
                console.log(this.props.dateTimeList[i])

                let user;
                
                if(this.props.userList[i] == null){
                  user = 'deleted user';
                }
                else {
                 user = this.props.userList[i].username;
                }

                
                let action_type = this.props.objectList[i].action_type;
                let action_object = this.props.objectList[i].object_repr;
                let action_object_type = this.props.objectList[i].object_type;

                // id for onclick instance to send?
                let action_object_id = this.props.objectList[i].object_id; 

                let datetime = this.props.dateTimeList[i];
                
                let action = '' + action_type+ 'd '+ action_object_type +' : '+ action_object;
                return (
                    <TableRow
                    hover
                    tabIndex={-1}
                    key={i}
                    >
                    <TableCell align="center">{user}</TableCell>
                    <TableCell align="center">{action}</TableCell>
                    <TableCell align="center">{datetime}</TableCell>
                    <div>
                        <TableCell align="right" onClick={() => this.handleClick(action_object_id, action_object_id)}>
                        {/* changee lol */}
                        <Link to={'/models/'}> 
                            <Tooltip title='View Details'>
                            <IconButton size="sm">
                                <PageviewIcon/>
                            </IconButton>
                            </Tooltip>
                        </Link>
                        </TableCell>
                    </div>
                    </TableRow>)
            })
        }
      }
    
    
      render() {
        return (
          <div>
            <Paper>
              {this.renderTableToolbar()}
              <TableContainer>
                <Table
                  size="small"
                  aria-labelledby="auditLogTableTitle"
                  aria-label="enhanced table"
                >
                  <TableRow>{this.renderTableHeader()}</TableRow>
    
                  <TableBody>
                    {this.renderTableData()}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        );
      }
}
export default AuditLogTable