import React, { Component } from 'react'
import '../stylesheets/RackTable.css'

export class RackRow extends Component {
    render() {
        console.log(this.props.displayColor);

        let objectIsNull = true;

        if(this.props.displayColor != null){
            objectIsNull = false;
        }

        //only return somethin

        console.log(this.props.displayColor);

        //let color = parseInt(this.props.displayColor, 10);
        let color = 'red';//'#ffffb2';
        console.log(color);

        // const styleObj = {
        //     backgroundColor: color,
        // }

        return (
            <tr>
                <td>
                    { this.props.row }   
                </td> 

                { objectIsNull &&
                    <td> 
                    { this.props.instanceUrl }
                    </td> 
                } 
                 { !objectIsNull &&
                    <td2 style={{backgroundColor: color}}>
                    {/* <td2> */}
                    <pre>
                        { this.props.model }       { this.props.hostname } 
                    </pre>
                    </td2> 
                }   

                <td>
                    {this.props.row}    
                </td>                
            </tr>
        )
    }
}

export default RackRow
