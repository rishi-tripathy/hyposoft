import React, { Component } from 'react'
import '../stylesheets/RackTable.css'

export class RackRow extends Component {

    showInstance() {
        console.log("ia m showing");
    }

    render() {
        //console.log(this.props.row);

        let objectIsNull = true;

        if(this.props.object != null){
            objectIsNull = false;
        }

        return (
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
                    <td2 onClick={this.showInstance}> 
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
