import React, { Component } from 'react'

export class RackRow extends Component {
    render() {
        console.log(this.props.row);
        return (
            <tr>
                hi
                {this.props.row}
            </tr>
        )
    }
}

export default RackRow
