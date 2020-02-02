import React, { Component } from 'react'
import '../stylesheets/RackTable.css'

export class RackRow extends Component {
    render() {
       // console.log(this.props.displayColor);

        let objectIsNull = true;

        console.log(this.props.row);
        console.log(this.props.instanceUrl);
        console.log(this.props.displayColor);

        if(this.props.displayColor !== null){
            objectIsNull = false;
        }
        let content; 
        let dispColor = '#';
        dispColor = dispColor.concat(this.props.displayColor);
        console.log(dispColor)
        let bcolor = 'black';
        if(!objectIsNull){
            content = 
             <td style={{
                fontSize: 10,
                background: dispColor, 
                color: bcolor,
             }}>
                <pre>
                    { this.props.model }       { this.props.hostname } 
                </pre>
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
