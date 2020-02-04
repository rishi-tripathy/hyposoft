import React, { Component } from 'react'
import '../stylesheets/RackTable.css'
import '../stylesheets/Printing.css'

export class RackRow extends Component {

    displayName() {
        let name = '';
        name = name.concat(this.props.hostname);
        let vendor = '';
        vendor = vendor.concat(this.props.model);
        let maxLength = 40;

        console.log(name);
        console.log(vendor);

        if(this.props.hostname !== null){
            if(name.length + vendor.length > maxLength){
                let lengthOvf = maxLength - vendor.length - 10; //10 is space between 2
                name = name.substring(0, lengthOvf).concat('...');
            }
            return name;
        }
        else {
            return this.props.hostname;
        }
    }

    render() {

        let objectIsNull = true;
        let isCondensed = false;
        //console.log(this.props.row)
        if(this.props.displayColor !== null){
            objectIsNull = false;
        }

        if(this.props.condensedView){
            isCondensed = true;
        }

        let content; 
        let dispColor = '#';
        dispColor = dispColor.concat(this.props.displayColor);
        if(!objectIsNull){
            content = 
             <td style={{
                fontSize: 7,
                background: dispColor,
             }}>
                <pre>{ this.props.model }          { this.displayName() }</pre>
            </td> 
        }
        else if(objectIsNull && isCondensed){
            //dots
            content = <td style = {{ textAlign: 'center'}}>{ this.props.hostname }</td>
        }
        else{
            content = <td></td>;
        }

        return (
            <tr style={{maxHeight: '2px'}}>
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
