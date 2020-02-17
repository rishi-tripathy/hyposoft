import React, { useEffect, useState } from 'react';

import {
  Button, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, Grid, FormGroup, FormControlLabel, Checkbox,
  List, ListItem
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"

//const powerPorts = 10;


export default function PowerPortConnectionDialog() {

  const [open, setOpen] = useState(false);
  const [powerPorts, setPowerPorts] = useState(10);
  const [powerPortSelection, setPowerPortSelection] = useState(
    {
      selection: [
        {
          pduPortNumber: null,
          isLeft: false,
          isRight: false,
        }
      ]
    }
  );

  useEffect(() => {
    let listOfSelections = [];
    for (let i = 0; i < powerPorts; i++) {
      listOfSelections.push({
        pduPortNumber: null,
        isLeft: false,
        isRight: false,
      })
    }
    let selectionArrayCopy = Object.assign({}, powerPortSelection.selection);
    selectionArrayCopy = listOfSelections;
    setPowerPortSelection({
      selection: selectionArrayCopy
    });
  },[]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
  }

  const showPPFields = () => {
    let fieldList = [];
    for (let i = 0; i < powerPorts; i++) {
      fieldList.push(
        <div>
          <ListItem>
            <Grid item xs={6}>
              <TextField label='PDU Port Number' type="text" fullWidth onChange={e => {
                let selectionArrayCopy = Object.assign({}, powerPortSelection.selection);
                selectionArrayCopy[i].pduPortNumber = e.target.value;
                setPowerPortSelection({
                  selection: selectionArrayCopy
                })
              }} />
            </Grid>
            <Grid item xs={6}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={state.checkedB}
                      // onChange={handleChange('checkedB')}
                      //value="checkedB"
                      color="primary"
                      onChange={e => {
                        let selectionArrayCopy = Object.assign({}, powerPortSelection.selection);
                        selectionArrayCopy[i].isLeft = e.target.checked;
                        setPowerPortSelection({
                          selection: selectionArrayCopy
                        })
                      }}
                    />
                  }
                  label="Left"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={state.checkedB}
                      // onChange={handleChange('checkedB')}
                      //value="checkedB"
                      color="primary"
                      onChange={e => {
                        let selectionArrayCopy = Object.assign({}, powerPortSelection.selection);
                        selectionArrayCopy[i].isRight = e.target.checked;
                        setPowerPortSelection({
                          selection: selectionArrayCopy
                        })
                      }}
                    />
                  }
                  label="Right"
                />
              </FormGroup>
            </Grid>
          </ListItem>
        </div>
      )
    }
    return fieldList;
  }

  console.log(powerPortSelection)

  return (
    <div>
      <Grid item alignContent='center' xs={12}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Setup Power Connections
        </Button>
        {/* {configuredMessage} */}
      </Grid>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Connect Network Port</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For each Power Port, select a PDU port number and connect left/right ports.
          </DialogContentText>
          <List style={{ maxHeight: 200, overflow: 'auto' }}>
            {showPPFields()}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
