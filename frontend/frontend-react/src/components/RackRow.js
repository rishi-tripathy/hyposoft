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

        if(this.props.hostname !== null){
            if(name.length + vendor.length > maxLength){
                let lengthOvf = maxLength - vendor.length - 10; //10 is space between 2
                name = name.substring(0, lengthOvf).concat('...');
            }
        }
            return name;
    }

      // handleInstanceClick = (url) => {
   handleInstanceClick = (id) => {

       if(id !== null){
            console.log("in an instance");
            console.log(id);
            this.props.sendFromRow(true, id);
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
        if(!objectIsNull && this.props.hostname !== null){
            content = 
             <td style={{
                fontSize: 7,
                background: dispColor,
                verticalAlign: 'bottom',
             }}>
                { this.props.model }          { this.displayName() }
            </td>;
        }
        else if(!objectIsNull && this.props.hostname == null){
            content = 
            <td style={{
                fontSize: 7,
                background: dispColor,
                cursor: 'pointer',
            }}>

            </td>;
        }
        else{
            content = <td></td>;
        }
        return (
            <tr onClick={() => this.handleInstanceClick(this.props.id)}>
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
