import React, { Component, Fragment } from 'react'
import '../stylesheets/TableView.css'
import PropTypes from 'prop-types';
import RackRow from './RackRow'

export class RackTable extends Component {

   // gets instance array
   createInstanceArray = () => {

      let instanceArray = new Array(44);
      this.props.rackInstances.map((rackInstance, index) => {

         const { id, rackU, height } = rackInstance;
				 instanceArray[rackU] = rackInstance;

         for(var i = 1; i < height; i++){
            instanceArray[rackU+i] = rackInstance;
				 }
				 
      });

      return instanceArray;
   }


   renderTableNumbers() {
      
      let list = [];
      list = this.renderTableData();
      //console.log(list);
      let renderList = [];

      return this.props.numbers.map((number, index) => (
         <tr key = {index}>
            <td> { number } </td>
            <td> { list } </td>
            <td> { number } </td>
            </tr>
      ))
    }
    
   renderTableData() {
      return this.props.rackInstances.map((rackInstance, index) => {
         const { hostName, rack, id, vendor, modelNumber } = rackInstance
         return (
            <div key={id}>
               {hostName}{modelNumber}{rack}{vendor}
            </div>
         )
      })
   }

   getRackNum() {

      let rackNum = "";
      for (var key of Object.keys(this.props.rack)) {
         if (key === 'rack_number') {
            rackNum = this.props.rack[key];
            return rackNum;
         }
     }
   }

  

   getRows() {

      let rows = [];
      rows = this.props.rack;
      delete rows["id"];
      delete rows["rack_number"];
      return rows;
   }

   renderRows() {

      let realRows = [];
      for(var i in this.getRows()){
         realRows.push(i);
      }
      //= Array.from(this.getRows());
      console.log(realRows);
      return realRows.map((row, index) => {
         return (
            <RackRow row={row}/> //
         ) 
      })
   }

   render() {

      let rackNumber = this.getRackNum();

      return (
         <div id="rackContainer">
         <h1 id="title">{rackNumber}</h1>
           <table id="entries">
               <tbody>
                 {this.renderRows()}
               </tbody>
           </table>
         </div>
     )
   }
}

export default RackTable
    