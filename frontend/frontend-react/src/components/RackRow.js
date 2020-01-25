import React, { Component } from 'react'
import '../stylesheets/RackTable.css'

export class RackRow extends Component {
    render() {
        //console.log(this.props.row);

        let objectIsNull = true;

        if(this.props.object != null){
            objectIsNull = false;
        }

        return (
          // <tr {objectIsNull ? style={{'background-color': purple}} : style={{'background-color': white}}>
            <tr>
                <td>
                    { this.props.row }    
                </td> 
                { objectIsNull &&
                    <td> 
                    { this.props.object }
                    </td> 
                } 
                { !objectIsNull &&
                    <td2> 
                    { this.props.object }
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
