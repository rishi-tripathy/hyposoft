import React, { Component, Fragment } from 'react'
import '../stylesheets/RackTable.css'
import '../stylesheets/RacksView.css'
import RackRow from './RackRow'

export class RackTable extends Component {

   getRackNum() {
      console.log("rack object");
      console.log(this.props.rack);
      console.log("item");
      console.log(this.props.rack[0]); //correctly gets data
      //need to get data.results 
      let rackNum = "";

      for (var key of Object.keys(this.props.rack[0])) {
         console.log(this.props.rack[0][key]);
         if (key === 'rack_number') {
            rackNum = this.props.rack[0][key];
            console.log(rackNum);
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
         realRows.push(i.substring(1,3));
         // console.log("curr rackU "+i); //rackU
         // console.log("curr rack instance "+this.getRows()[i]); //rackInstance
         rackInstances.push(this.getRows()[i]); //push rackInstance
      }

      console.log(this.getRackNum());

      return realRows.reverse().map((row, index) => {
         return (
           <RackRow row={row} object ={rackInstances[index]} /> //
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