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

      //these store information per rack, for empty ones, everything is added as null except for rackUs 
      let rackUs = [];
      let rackInstances = []; //has URLs or null
      let modelInfo = []; //has model uri or null
      let displayColors = [];
      let hostnameInfo = []; //has hostname String or null

      for(var i of Object.keys(this.getRows())){
         rackUs.push(i.substring(1,3)); //push U number

         if(this.getRows()[i] !== null){
           // there is a rack here, need to break keys again
            console.log(this.getRows()[i].url);
            console.log(this.getRows()[i].model);
            console.log(this.getRows()[i].hostname);
            rackInstances.push(this.getRows()[i].url); //push rackInstance
            modelInfo.push(this.getRows()[i].model.vendor +  " " +this.getRows()[i].model.model_number);
            displayColors.push(this.getRows()[i].model.display_color);
            hostnameInfo.push(this.getRows()[i].hostname);
         }
         else {
            rackInstances.push(this.getRows()[i]); 
            modelInfo.push(this.getRows()[i]); 
            displayColors.push(this.getRows()[i]);
            hostnameInfo.push(this.getRows()[i]); //push rackInstance -- null in this case lol, no need to break it apart
         }
      }

      console.log(rackUs);
      console.log(rackInstances);
      console.log(modelInfo);
      console.log(displayColors);
      console.log(hostnameInfo);

      return rackUs.reverse().map((row, index) => {
         return (
          <RackRow row={row} instanceUrl ={rackInstances[rackUs.length-index-1]} model= {modelInfo[rackUs.length-index-1]} displayColor= {modelInfo[rackUs.length-index-1] } hostname={hostnameInfo[rackUs.length-index-1]}/>
         //<div></div>
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