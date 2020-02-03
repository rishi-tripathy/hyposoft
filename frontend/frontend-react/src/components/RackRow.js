import React, { Component } from 'react'
import '../stylesheets/RackTable.css'

export class RackRow extends Component {
    render() {
        let objectIsNull = true;

        if(this.props.displayColor !== null){
            objectIsNull = false;
        }
        let content; 
        let dispColor = '#';
        dispColor = dispColor.concat(this.props.displayColor);
        let bcolor = 'black';
        if(!objectIsNull){
            content = 
             <td style={{
                fontSize: 10,
                background: dispColor, 
                color: bcolor,
             }}>
                <pre>{ this.props.model }       { this.props.hostname }</pre>
            </td> 
        }
        else{
            content = <td></td>;
        }

        return (
            <tr>
                <td>
                    { this.props.row }   
                </td> 
               { content }
                <td>
                    {this.props.row}    
                </td>                
            </tr>
        )
    }
}

export default RackRow
