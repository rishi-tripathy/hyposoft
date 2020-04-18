import React, { Component } from 'react'
import { IconButton, Table, TableCell, TableRow, TableBody, TableSortLabel, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import PageviewIcon from '@material-ui/icons/Pageview';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

export class InstanceCardOffline extends Component {
  showModel = (e) => {
    const { model } = this.props.asset;
    console.log(model.url)
  }

  renderTableHeader() {
    let headCells = [
      { id: 'model__vendor', label: 'Vendor' },
      { id: 'model__model_number', label: 'Model Number' },
      { id: 'hostname', label: 'Hostname' },
      { id: 'datacenter', label: 'Datacenter' },
      { id: 'owner', label: 'Owner' },
      { id: 'assetNumber', label: 'Asset no.' },
      { id: 'comment', label: 'Comment' }
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
    return this.props.asset.map((asset) => {
      const { id, model, hostname, rack, owner, rack_u, comment, datacenter, network_ports, power_ports, asset_number  } = asset //destructuring
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{model ? model.vendor : null}</TableCell>
          <TableCell align="center"><Link to={'/models/' + (model ? model.id : '') }>{model ? model.model_number : null}</Link></TableCell>
          <TableCell align="center">{hostname}</TableCell>
          <TableCell align="center">{datacenter ? datacenter.abbreviation : null}</TableCell>
          <TableCell align="center">{owner ? owner.username : null}</TableCell>
          <TableCell align="center">{asset_number}</TableCell>
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

export default InstanceCardOffline
