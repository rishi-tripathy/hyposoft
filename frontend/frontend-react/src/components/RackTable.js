import React, { Component, Fragment } from 'react'
import '../stylesheets/RackTable.css'
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
			let rackInstances = [];
      for(var i of Object.keys(this.getRows())){
				 realRows.push(i);
				 console.log(i); //rackU
				 console.log(this.getRows()[i]); //rackInstance
				 rackInstances.push(this.getRows()[i]); //push rackInstance
      }
      //= Array.from(this.getRows());
      //console.log(realRows);
      return realRows.reverse().map((row, index) => {
         return (
            <RackRow row={row} object ={rackInstances[index]} /> //
         ) 
      })
   }

   render() {

      let rackNumber = this.getRackNum();

      return (
           <table id="entries">
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