import React, { Component, Fragment } from 'react'
import '../stylesheets/RackTable.css'
import '../stylesheets/RacksView.css'
import RackRow from './RackRow'

export class RackTable extends Component {

   getRackNum() {
      //need to get data.results 
      let rackNum = "";

      //console.log(this.props.rack);

      for (var key of Object.keys(this.props.rack)) {
         if (key === 'rack_number') {
            rackNum = this.props.rack[key];
            return rackNum;
         }
     }
   }

   fixRows() {
      let temp_rows = [];
      temp_rows = this.props.rack;
      // delete rows["id"];
      // delete rows["rack_number"];

      //console.log(this.props.rack);

      for(var i of Object.keys(temp_rows)){
         if(i!=="id" && i!=="rack_number"){
            temp_rows[i.substring(1,3)] = temp_rows[i]; //replace key
            delete temp_rows[i];
         }
      }
    //  console.log(temp_rows);
      return temp_rows;
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

      let rows = [];
      
      rows = this.fixRows();

      for(var i of Object.keys(rows)){
         if(i!=="id" && i!=="rack_number"){
            let previousRackU;
            let nextRackU;
            let currentRackU;

            rackUs.push(i);

            if(i!==1 && rows[i] !== null){

               currentRackU = rows[i];

               // there is a rack here, need to break keys again
               // console.log(currentRackU);
               // console.log(currentRackU.url);
               // console.log(currentRackU.model);
               // console.log(currentRackU.hostname);
               rackInstances.push(currentRackU.url); //push rackInstance
               displayColors.push(currentRackU.model.display_color);


               //only want to display things if FIRST (which is last backwards)... 
               previousRackU = rows[i-1];
               nextRackU = rows[i+1];

               //console.log(previousRackU);
               //console.log(nextRackU);

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
               rackInstances.push(rows[i]); 
               modelInfo.push(rows[i]); 
               displayColors.push(rows[i]);
               hostnameInfo.push(rows[i]); //push rackInstance -- null in this case lol, no need to break it apart
            }
         }
      }
      return rackUs.reverse().map((row, index) => {
         return (
          <RackRow row={row} instanceUrl ={rackInstances[rackUs.length-index-1]} model= {modelInfo[rackUs.length-index-1]} displayColor= {displayColors[rackUs.length-index-1] } hostname={hostnameInfo[rackUs.length-index-1]}/>
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