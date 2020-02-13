import React, {Component} from 'react'
import DetailedModelModal from './DetailedModelModal';
import DetailedModelFromInstance from './DetailedModelFromInstance';
import {IconButton, Table, TableCell, TableRow, TableBody, TableSortLabel, Tooltip} from "@material-ui/core";
import {Link} from "react-router-dom";
import PageviewIcon from '@material-ui/icons/Pageview';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

export class InstanceCard extends Component {
  showModel = (e) => {
    const {model} = this.props.inst;
    console.log(model.url)
  }

  renderTableHeader() {
    let headCells = [
      {id: 'rack__rack_number', label: 'Rack'},
      {id: 'rack_u', label: 'Rack U'},
      {id: 'model__vendor', label: 'Vendor'},
      {id: 'model__model_number', label: 'Model Number'},
      {id: 'hostname', label: 'Hostname'},
      {id: 'owner', label: 'Owner'},
      {id: 'comment', label: 'Comment'}

    ];
    return headCells.map(headCell => (
      <TableCell
        key={headCell.id}
        align={'center'}
        padding={'default'}

      >
        {headCell.label.toUpperCase()}
      </TableCell>
    ))
  }

  renderTableData() {
    return this.props.inst.map((asset) => {
      const {id, model, hostname, rack, owner, rack_u, comment} = asset //destructuring
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{rack ? rack.rack_number : null}</TableCell>
          <TableCell align="center">{rack_u}</TableCell>
          <TableCell align="center">{model ? model.vendor : null}</TableCell>
          <TableCell align="center">{model ? model.model_number : null}</TableCell>
          <TableCell align="center">{hostname}</TableCell>
          <TableCell align="center">{owner ? owner.username : null}</TableCell>
          <TableCell align="center">{comment}</TableCell>
        </TableRow>
      )
    })
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <Table hover striped>
          <TableBody>
            <TableRow>{this.renderTableHeader()}</TableRow>
            {this.renderTableData()}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default InstanceCard
