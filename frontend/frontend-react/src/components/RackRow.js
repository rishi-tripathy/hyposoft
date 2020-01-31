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

        //only return somethin

       // console.log(this.props.displayColor);

        //let color = parseInt(this.props.displayColor, 10);
        let color = 'red';//'#ffffb2';
        //console.log(color);

        // const styleObj = {
        //     backgroundColor: color,
        // }
        let content; 
        let dispColor = this.props.displayColor;
        let bcolor = 'black';
        if(!objectIsNull){
            content = 
             <td style={{
                fontSize: 10,
                background: dispColor, //need to pass a function in
                color: bcolor,
             }}>
            {/* { console.log(this.props.displayColor) } */}
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
