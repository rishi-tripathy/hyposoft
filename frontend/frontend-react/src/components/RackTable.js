import React, { Component, Fragment } from 'react'
import '../stylesheets/RackTable.css'
import '../stylesheets/RacksView.css'
import RackRow from './RackRow'

export class RackTable extends Component {

   getRackNum() {
      //need to get data.results 
      let rackNum = "";

      for (var key of Object.keys(this.props.rack[0])) {
         if (key === 'rack_number') {
            rackNum = this.props.rack[0][key];
            return rackNum;
         }
     }
   }

   getRows() {
      let rows = [];
      rows = this.props.rack[0];
      delete rows["id"];
      delete rows["rack_number"];
      return rows;
   }

   renderRows() {
      let realRows = [];
      let rackInstances = [];

      for(var i of Object.keys(this.getRows())){
         realRows.push(i.substring(1,3)); //push U number
         rackInstances.push(this.getRows()[i]); //push rackInstance
      }
      return realRows.reverse().map((row, index) => {
         return (
           <RackRow row={row} object ={rackInstances[realRows.length-index-1]} /> //
         ) 
      })
   } 

   render() {

      let rackNumber = this.getRackNum();

      return (
           <table id="entries1">
               <tbody>
								 <th></th>
								 <th>{rackNumber}</th>
								 <th></th>
                 {this.renderRows()}
               </tbody>
           </table>
     )
   }
}

export default RackTable