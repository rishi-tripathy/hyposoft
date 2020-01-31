import React, { Component, Fragment } from 'react'
import '../stylesheets/RackTable.css'
import '../stylesheets/RacksView.css'
import RackRow from './RackRow'

export class RackTable extends Component {

   getRackNum() {
      //need to get data.results 
      let rackNum = "";

      console.log(this.props.rack);

      for (var key of Object.keys(this.props.rack)) {
         if (key === 'rack_number') {
            rackNum = this.props.rack[key];
            return rackNum;
         }
     }
   }

   fixRows() {
      let rows = [];
      rows = this.props.rack;
      delete rows["id"];
      delete rows["rack_number"];

      console.log(this.props.rack);

      for(var i of Object.keys(rows)){
         rows[i.substring(1,3)] = rows[i]; //replace key
         delete rows[i];
      }
      
      console.log(rows);

      return rows;
   }

   getRows(){
      return this.props.rack;
   }

   renderRows() {

      //these store information per rack, for empty ones, everything is added as null except for rackUs 
      let rackUs = [];
      let rackInstances = []; //has URLs or null
      let modelInfo = []; //has model uri or null
      let displayColors = [];
      let hostnameInfo = []; //has hostname String or null

      for(var i of Object.keys(this.getRows())){
         let previousRackU;
         let nextRackU;
         let currentRackU;

         rackUs.push(i);

         if(i!==1 && this.getRows()[i] !== null){

            currentRackU = this.getRows()[i];

           // there is a rack here, need to break keys again
            // console.log(currentRackU);
            // console.log(currentRackU.url);
            // console.log(currentRackU.model);
            // console.log(currentRackU.hostname);
            rackInstances.push(currentRackU.url); //push rackInstance
            displayColors.push(currentRackU.model.display_color);


            //only want to display things if FIRST (which is last backwards)... 
            previousRackU = this.getRows()[i-1];
            nextRackU = this.getRows()[i+1];

            console.log(previousRackU);
            console.log(nextRackU);

            if(previousRackU === null){
               //the previous one is null and this is the first U of the thing
               modelInfo.push(currentRackU.model.vendor +  " " + currentRackU.model.model_number);
               hostnameInfo.push(currentRackU.hostname);
            }
            else{
               modelInfo.push(null);
               hostnameInfo.push(null);
            }
               
         }
         else {
            rackInstances.push(this.getRows()[i]); 
            modelInfo.push(this.getRows()[i]); 
            displayColors.push(this.getRows()[i]);
            hostnameInfo.push(this.getRows()[i]); //push rackInstance -- null in this case lol, no need to break it apart
         }
      }

      // console.log(rackUs);
      // console.log(rackInstances);
      // console.log(modelInfo);
      // console.log(displayColors);
      // console.log(hostnameInfo);

      return rackUs.reverse().map((row, index) => {
         return (
          <RackRow row={row} instanceUrl ={rackInstances[rackUs.length-index-1]} model= {modelInfo[rackUs.length-index-1]} displayColor= {displayColors[rackUs.length-index-1] } hostname={hostnameInfo[rackUs.length-index-1]}/>
         //<div></div>
          ) 
      })
   } 

   render() {

      let rackNumber = this.getRackNum();
      let rows = this.fixRows();

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