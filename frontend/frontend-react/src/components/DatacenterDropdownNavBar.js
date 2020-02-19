/* eslint-disable no-use-before-define */
import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

export default function DatacenterNavbar() {
  return (
    <Autocomplete
      id="highlights-demo"
      style={{ width: 150, marginRight: '0px', fontSize: '10px', borderRadius: '15px'}}
      options={fakeData}
      getOptionLabel={option => option.name}
      renderInput={params => (
        <TextField style={{backgroundColor: 'white', borderRadius: '15px'}} {...params} label="Datacenter" variant="outlined" fullWidth margin="normal" variant="filled"
        color="primary" />
      )}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);

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

// to be passed in as data after API integration
var fakeData = [
    { name: 'ALL' },
    { name: 'RTP1'},
    { name: 'RTP2'},
    { name: 'RTP3'},
    { name: 'NYC111'}, //spec: longest abbrevation is 6 chars?
  ];