/* eslint-disable no-use-before-define */
import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import DatacenterContext  from './DatacenterContext'

export class DatacenterNavbar extends Component{

  render() {
  
    // console.log(this.context.datacenterOptions[0].name);
    let options = this.context.datacenterOptions.map(option => {
      let firstLetter = option.is_offline;
      console.log(firstLetter);
        return {
          firstLetter: /true/.test(firstLetter) ? "Offline Sites" : "Datacenters",
          ...option
        };
    })
    
  return (
    <Autocomplete
      id="highlights-demo"
      style={{ width: 150, marginRight: '0px', fontSize: '10px', borderRadius: '15px'}}
      options={options.sort((a, b) => -b.name)}
      groupBy={option => option.firstLetter}
      onChange={(event, value) =>this.context.setDatacenter(value.id, value.name, value.abbreviation, value.is_offline)} 
      getOptionLabel={option => option.abbreviation}
      disableClearable={true}
      defaultValue={this.context.datacenterOptions[0]}
      renderInput={params => (
        <TextField style={{backgroundColor: 'white', borderRadius: '15px', fontSize: '8'}} {...params} label="DC/Offline Site" variant="outlined" fullWidth margin="normal" variant="filled"
        color="primary" />
      )}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.abbreviation, inputValue);
        const parts = parse(option.abbreviation, matches);

        return (
          <div>
            {parts.map((part, index) => (
              <span key={index} style={{ fontSize: 10, fontWeight: part.highlight ? 700 : 400 }}>
                {part.text}
              </span>
            ))}
          </div>
        );
      }}
    />
  );
}
}

DatacenterNavbar.contextType = DatacenterContext;
export default DatacenterNavbar;