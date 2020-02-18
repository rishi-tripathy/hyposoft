import React, { Component } from 'react'

import {
  Button, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, Grid, FormGroup, FormControlLabel, Checkbox,
  List, ListItem
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"

export class PowerPortConnectionDialog extends Component {

  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    // const powerPorts = 
    // let listOfSelections = [];
    // for (let i = 0; i < powerPorts; i++) {
    //   listOfSelections.push({
    //     pduSlot: null,
    //     left: false,
    //     right: false,
    //   })
    // }
    // let selectionArrayCopy = Object.assign({}, powerPortSelection.selection);
    // selectionArrayCopy = listOfSelections;
    // setPowerPortSelection({
    //   selection: selectionArrayCopy
    // });
  }

  // handleClickOpen = () => {
  //   setPowerPortSelection()
  //   setOpen(true);
  // };

  // handleClose = () => {
  //   setOpen(false);
  // };

  // handleSubmit = () => {
  //   setOpen(false);
  // }

  // showPPFields = () => {
  //   let fieldList = [];
  //   for (let i = 0; i < powerPorts; i++) {
  //     console.log(powerPortSelection)
  //     fieldList.push(
  //       <div>
  //         <ListItem>
  //           <Grid item xs={6}>
  //             <TextField label='PDU Port Number' type="text" fullWidth onChange={e => {
  //               let selectionArrayCopy = Object.assign({}, powerPortSelection.selection);
  //               selectionArrayCopy[i].pduPortNumber = e.target.value;
  //               setPowerPortSelection({
  //                 selection: selectionArrayCopy
  //               })
  //             }} />
  //           </Grid>
  //           <Grid item xs={6}>
  //             <FormGroup row>
  //               <FormControlLabel
  //                 control={
  //                   <Checkbox
  //                     // checked={state.checkedB}
  //                     // onChange={handleChange('checkedB')}
  //                     //checked={powerPortSelection.selection[i].isLeft}
  //                     color="primary"
  //                     onChange={e => {
  //                       let selectionArrayCopy = Object.assign({}, powerPortSelection.selection);
  //                       selectionArrayCopy[i].isLeft = e.target.checked;
  //                       setPowerPortSelection({
  //                         selection: selectionArrayCopy
  //                       })
  //                     }}
  //                   />
  //                 }
  //                 label="Left"
  //               />
  //               <FormControlLabel
  //                 control={
  //                   <Checkbox
  //                     // checked={state.checkedB}
  //                     // onChange={handleChange('checkedB')}
  //                     // checked={powerPortSelection.selection[i].isRight}
  //                     color="primary"
  //                     onChange={e => {
  //                       let selectionArrayCopy = Object.assign({}, powerPortSelection.selection);
  //                       selectionArrayCopy[i].isRight = e.target.checked;
  //                       setPowerPortSelection({
  //                         selection: selectionArrayCopy
  //                       })
  //                     }}
  //                   />
  //                 }
  //                 label="Right"
  //               />
  //             </FormGroup>
  //           </Grid>
  //         </ListItem>
  //       </div>
  //     )
  //   }
  //   return fieldList;
  // }


  render() {
    return (
      <div>
        {/* <Grid item alignContent='center' xs={12}>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Setup Power Connections
          </Button>
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
        </Dialog> */}
      </div>
    )
  }
}

export default PowerPortConnectionDialog
