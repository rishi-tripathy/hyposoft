import React, { Component } from 'react'
import '../stylesheets/TableView.css'

export class RackRow extends Component {
    render() {
        console.log(this.props.row);
        return (
            <tr>
                <td-racks>
                    {this.props.row}    
                </td-racks> 
                <td> 
                    rack instance if there is one 
                </td>  
                <td>
                    {this.props.row}    
                </td>                
            </tr>
        )
    }
}

export default RackRow
