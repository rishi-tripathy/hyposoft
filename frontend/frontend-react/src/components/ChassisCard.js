import React, { Component } from 'react'
import { IconButton, Table, TableCell, TableRow, TableBody, TableSortLabel, Tooltip } from "@material-ui/core";
import { Link } from 'react-router-dom'
import PageviewIcon from '@material-ui/icons/Pageview';


export class ChassisCard extends Component {

  renderTableHeader() {
    let headCells = [
      { id: 'rack__rack_number', label: 'Rack' },
      { id: 'rack_u', label: 'Rack U' },
      { id: 'model__vendor', label: 'Vendor' },
      { id: 'model__model_number', label: 'Model Number' },
      { id: 'hostname', label: 'Hostname' },
      { id: 'datacenter', label: 'Datacenter' },
      { id: 'assetNumber', label: 'Asset no.' },
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
    // worse logic i've ever written
    if (this.props.asset != null && this.props.asset[0] != null) {
      return this.props.asset.map((asset) => {
        const { id, model, hostname, rack, rack_u, datacenter, asset_number } = asset //destructuring
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
            <TableCell align="center">{datacenter ? datacenter.abbreviation : null}</TableCell>
            <TableCell align="center">{asset_number}</TableCell>
            <TableCell align="right">
              <Link to={{
                pathname: '/assets/' + id,
                state: {
                  isBlade: model.mount_type === 'blade'
                }
              }}>
                <Tooltip title='View Details'>
                  <IconButton size="sm">
                    <PageviewIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            </TableCell>
          </TableRow>
        )
      })
    }
  }


  render() {
    console.log(this.props)
    return (
      <div>
        <Table hover striped padding={'none'} size={'small'}>
          <TableBody>
            <TableRow>{this.renderTableHeader()}</TableRow>
            {this.renderTableData()}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default ChassisCard
