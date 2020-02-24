/* eslint-disable no-use-before-define */
import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import DatacenterContext  from './DatacenterContext'

export class DatacenterNavbar extends Component{

  render() {
  return (
    <DatacenterContext.Consumer>
    {({ datacenter,  setDatacenter }) => (
    <Autocomplete
      id="highlights-demo"
      style={{ width: 150, marginRight: '0px', fontSize: '10px', borderRadius: '15px'}}
      options={this.props.datacenters}
      onChange={(event, value) => setDatacenter(value.id, value.name, value.abbreviation)}
      getOptionLabel={option => option.abbreviation}
      renderInput={params => (
        <TextField style={{backgroundColor: 'white', borderRadius: '15px'}} {...params} label="Datacenter" variant="outlined" fullWidth margin="normal" variant="filled"
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
    />)}</DatacenterContext.Consumer>
  );
}
}
DatacenterNavbar.contextType = DatacenterNavbar;
export default DatacenterNavbar;