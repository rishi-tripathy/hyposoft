import React, {Component} from 'react'
import '../stylesheets/RackTable.css'
// import '../stylesheets/Printing.css'
import {Link} from 'react-router-dom'

export class RackRow extends Component {

  displayName() {
    let name = '';
    name = name.concat(this.props.hostname);
    let vendor = '';
    vendor = vendor.concat(this.props.model);
    let maxLength = 35;

    if (this.props.hostname !== null) {
      if (name.length + vendor.length > maxLength) {
        let lengthOvf = maxLength - vendor.length - 10; //10 is space between 2
        name = name.substring(0, lengthOvf).concat('...');
      }
    }
    return name;
  }

  // handleInstanceClick = (url) => {
  handleInstanceClick = (id) => {

    if (id !== null) {
      // this.props.sendFromRow(true, id);
    }
  }

  render() {
    let objectIsNull = true;
    let isCondensed = false;
    let row = this.props.row;
    if (this.props.displayColor !== null) {
      objectIsNull = false;
    }

    if (this.props.condensedView) {
      isCondensed = true;
    }
    let content;
    let dispColor = '#';
    let textColor = '#000000';
    let borderColor = '#000000';
    dispColor = dispColor.concat(this.props.displayColor);
    if (parseInt(this.props.displayColor, 10) < 818181) {
      //too dark
      textColor = '#ffffff'
    }


    if (isCondensed) {
      if ((!objectIsNull && this.props.hostname !== null)) {
        row = this.props.row;
        //render normally
        content =
          <td style={{
            fontSize: 12,
            backgroundColor: dispColor,
            color: textColor,
            borderBottom: 'solid',
          }}>
            <Link style={{color: textColor }} to={'/assets/' + this.props.id}>
            {this.props.model} {this.displayName()} 
            </Link>
          </td>;
      } else if ((this.props.row === 42) || (!objectIsNull && this.props.hostname == null)) {
        //no display name, just display color
        content =
        // <Link to={'/assets/' + this.props.id}>
          <td style={{
            fontSize: 12,
            backgroundColor: dispColor
          }}>
            <Link style={{color: textColor }} to={'/assets/' + this.props.id}> { } </Link>
          </td>
        // </Link>;
      } else if (objectIsNull) {
        //only null if 1 or 42
        if (this.props.row === '1') {
          content =
            <td style={{
              fontSize: 12,
              borderBottom: 'solid',
            }}>
            </td>;
        } else if (this.props.row === '42') {
          content =
            <td>
            </td>;
        } else if (this.props.model === '...') {
          // ... case
          row = '';
          content =
            <td style={{
              fontSize: 12,
              color: 'black',
            }}>
              {this.props.model}
            </td>;
        } else {
          //null with 2 instances sandwiching, render normal
          content =
            <td style={{fontSize: 12,}}> </td>;
        }
      }
    }

    //not condensed
    else {
      if (!objectIsNull && this.props.hostname !== null) {
        content =
          <td style={{
            fontSize: 12,
            backgroundColor: dispColor,
            color: textColor,
            borderBottom: 'solid',
          }}>
          <Link style={{color: textColor }} to={'/assets/' + this.props.id}>
            {this.props.model} {this.displayName()}
          </Link>
          </td>;
      } else if (!objectIsNull && this.props.hostname == null) {
        content =
          <td style={{
            fontSize: 12,
            backgroundColor: dispColor,
            cursor: 'pointer',
          }}>
            <Link style={{color: textColor }} to={'/assets/' + this.props.id}>{ }</Link>
          </td>;
      } else {
        content = <td style={{fontSize: 12,}}> </td>;
      }

      if (objectIsNull && this.props.index === 1) {
        content =
          <td style={{
            fontSize: 12,
            borderBottom: 'solid',
          }}>

          </td>;
      }
    }

    return (
        <tr>
          <td>
            {row}
          </td>
          {content}
          <td>
            {row}
          </td>
        </tr>
    )
  }
}

export default RackRow