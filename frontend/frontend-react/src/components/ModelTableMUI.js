import React, {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import ModelFilters from './ModelFilters';
import '../stylesheets/TableView.css'
import axios, {post} from 'axios'


axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelTable extends Component {

  constructor() {
    super();

    this.state = {
      filtersOpen: false,
      dense: false
    }
    this.showEditForm = this.showEditForm.bind(this);
    this.showEditForm = this.showEditForm.bind(this);
  }


  showDetailedModel = (id) => {
    //this.props.sendShowTable(false);
    this.props.sendShowDetailedModel(true);
    this.props.sendModelID(id);
  }

  showEditForm = (id) => {
    this.props.sendShowEdit(true);
    this.props.sendEditID(id);
  }

  showDeleteForm = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      let dst = '/api/models/'.concat(id).concat('/');
      axios.delete(dst)
        .then(function (response) {
          alert('Delete was successful');
        })
        .catch(function (error) {
          alert('Delete was not successful.\n' + JSON.stringify(error.response.data, null, 2));
        });
    }
    this.showRerender();
  }

  handleOpenFilters = () => {
    this.setState(prevState => ({
      filtersOpen: !prevState.filtersOpen
    }));
  }

  showRerender = () => {
    this.props.sendRerender(true);
  }

  renderTableToolbar = () => {
    return (
      <Toolbar>
        {
          <Typography style={{flex: '1 1 100%'}} variant="h6" id="modelTableTitle">
            Models
          </Typography>
        }
        <Collapse in={this.state.filtersOpen}>
          <Paper>
            {
              <ModelFilters sendFilterQuery={this.props.filter_query}/>
            }
          </Paper>
        </Collapse>
        <Tooltip title="Filter list">
          <IconButton onClick={() => this.handleOpenFilters()} aria-label="filter list">
            <FilterListIcon/>
          </IconButton>
        </Tooltip>


      </Toolbar>
    );
  };

  renderTableHeader() {
    let headCells = [
      {id: 'vendor', numeric: false, disablePadding: false, label: 'Vendor'},
      {id: 'model-number', numeric: false, disablePadding: false, label: 'Model Number'},
      {id: 'height', numeric: true, disablePadding: false, label: 'Height (U)'},
      {id: 'display-color', numeric: true, disablePadding: false, label: 'Display Color'},
      {id: 'ethernet-ports', numeric: true, disablePadding: false, label: 'Ethernet Ports'},
      {id: 'power-ports', numeric: true, disablePadding: false, label: 'Power Ports'},
      {id: 'cpu', numeric: false, disablePadding: false, label: 'CPU'},
      {id: 'memory', numeric: true, disablePadding: false, label: 'Memory (GB)'},
      {id: 'storage', numeric: false, disablePadding: false, label: 'Storage'},
    ];
    return headCells.map(headCell => (
      <TableCell
        key={headCell.id}
        align={headCell.numeric ? 'right' : 'left'}
        padding={headCell.disablePadding ? 'none' : 'default'}
        // sortDirection={orderBy === headCell.id ? order : false}
      >
        {/*<TableSortLabel*/}
        {/*  active={orderBy === headCell.id}*/}
        {/*  direction={orderBy === headCell.id ? order : 'asc'}*/}
        {/*  onClick={createSortHandler(headCell.id)}*/}
        {/*>*/}
        {headCell.label.toUpperCase()}
        {/*  {orderBy === headCell.id ? (*/}
        {/*    <span className={classes.visuallyHidden}>*/}
        {/*      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}*/}
        {/*    </span>*/}
        {/*  ) : null}*/}
        {/*</TableSortLabel>*/}
      </TableCell>
    ))

    let header = ['vendor', 'model number', 'height',
      'display color', 'ethernet ports', 'power ports', 'cpu', 'memory', 'storage'];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.models.map((model, index) => {
      const {id, vendor, model_number, height, display_color} = model //destructuring
      const {ethernet_ports, power_ports, cpu, memory, storage, comment} = model //more destructuring
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{vendor}</TableCell>
          <TableCell align="center">{model_number}</TableCell>
          <TableCell align="right">{height}</TableCell>
          <TableCell align="right">
            <div style={{
              width: 12,
              height: 12,
              backgroundColor: '#' + display_color,
              left: 5,
              top: 5,
            }}></div>
            {display_color}</TableCell>
          <TableCell align="right">{ethernet_ports}</TableCell>
          <TableCell align="right">{power_ports}</TableCell>
          <TableCell align="center">{cpu}</TableCell>
          <TableCell align="right">{memory}</TableCell>
          <TableCell align="center">{storage}</TableCell>
          {this.props.is_admin ? (
              <div>
                <TableCell align="right">
                  <Tooltip title='View Details'>
                    <IconButton size="sm" onClick={() => this.showDetailedModel(id)}>
                      <PageviewIcon/>
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title='Edit'>
                    <IconButton size="sm" onClick={() => this.showEditForm(id)}>
                      <EditIcon/>
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title='Delete'>
                    <IconButton size="sm" onClick={() => this.showDeleteForm(id)}>
                      <DeleteIcon/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </div>
            ) :
            (<p></p>)}
        </TableRow>
      )
    })
  }


  render() {
    return (
      <div>
        <Paper>
          {this.renderTableToolbar()}
          <TableContainer>
            <Table
              aria-labelledby="modelTableTitle"
              aria-label="enhanced table"
            >
              <TableRow>{this.renderTableHeader()}</TableRow>

              <TableBody>
                {this.renderTableData()}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        {/*<TablePagination*/}
        {/*  rowsPerPageOptions={[5, 10, 25]}*/}
        {/*  component="div"*/}
        {/*  count={rows.length}*/}
        {/*  rowsPerPage={rowsPerPage}*/}
        {/*  page={page}*/}
        {/*  onChangePage={handleChangePage}*/}
        {/*  onChangeRowsPerPage={handleChangeRowsPerPage}*/}
        {/*/>*/}
      </div>
    );
  }
}


ModelTable.propTypes = {
  models: PropTypes.array.isRequired
}

export default ModelTable;


//
// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }
//
// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Honeycomb', 408, 3.2, 87, 6.5),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0),
//   createData('KitKat', 518, 26.0, 65, 7.0),
//   createData('Lollipop', 392, 0.2, 98, 0.0),
//   createData('Marshmallow', 318, 0, 81, 2.0),
//   createData('Nougat', 360, 19.0, 9, 37.0),
//   createData('Oreo', 437, 18.0, 63, 4.0),
// ];
//
// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }
//
// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }
//
// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map(el => el[0]);
// }
//
// const headCells = [
//   { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
//   { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
//   { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
//   { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
//   { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
// ];
//
//   function
//
//   EnhancedTableHead(props) {
//     const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
//     const createSortHandler = property => event => {
//       onRequestSort(event, property);
//     };
//
//     return (
//       <TableHead>
//         <TableRow>
//           {headCells.map(headCell => (
//             <TableCell
//               key={headCell.id}
//               align={headCell.numeric ? 'right' : 'left'}
//               padding={headCell.disablePadding ? 'none' : 'default'}
//               sortDirection={orderBy === headCell.id ? order : false}
//             >
//               <TableSortLabel
//                 active={orderBy === headCell.id}
//                 direction={orderBy === headCell.id ? order : 'asc'}
//                 onClick={createSortHandler(headCell.id)}
//               >
//                 {headCell.label}
//                 {orderBy === headCell.id ? (
//                   <span className={classes.visuallyHidden}>
//                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                 </span>
//                 ) : null}
//               </TableSortLabel>
//             </TableCell>
//           ))}
//         </TableRow>
//       </TableHead>
//     );
//   }
//
//   EnhancedTableHead
// .
//   propTypes = {
//     classes: PropTypes.object.isRequired,
//     numSelected: PropTypes.number.isRequired,
//     onRequestSort: PropTypes.func.isRequired,
//     onSelectAllClick: PropTypes.func.isRequired,
//     order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//     orderBy: PropTypes.string.isRequired,
//     rowCount: PropTypes.number.isRequired,
//   };
//
//   const
//   useToolbarStyles = makeStyles(theme => ({
//     root: {
//       paddingLeft: theme.spacing(2),
//       paddingRight: theme.spacing(1),
//     },
//     highlight:
//       theme.palette.type === 'light'
//         ? {
//           color: theme.palette.secondary.main,
//           backgroundColor: lighten(theme.palette.secondary.light, 0.85),
//         }
//         : {
//           color: theme.palette.text.primary,
//           backgroundColor: theme.palette.secondary.dark,
//         },
//     title: {
//       flex: '1 1 100%',
//     },
//   }));
//
//   const
//   EnhancedTableToolbar = props => {
//     const classes = useToolbarStyles();
//     const {numSelected} = props;
//
//     return (
//       <Toolbar>
//         <Tooltip title="Filter list">
//           <IconButton aria-label="filter list">
//             <FilterListIcon/>
//           </IconButton>
//         </Tooltip>
//       </Toolbar>
//     );
//   };

//
// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//   },
//   paper: {
//     width: '100%',
//     marginBottom: theme.spacing(2),
//   },
//   table: {
//     minWidth: 750,
//   },
//   visuallyHidden: {
//     border: 0,
//     clip: 'rect(0 0 0 0)',
//     height: 1,
//     margin: -1,
//     overflow: 'hidden',
//     padding: 0,
//     position: 'absolute',
//     top: 20,
//     width: 1,
//   },
// }));
//
// export default function EnhancedTable() {
//   const classes = useStyles();
//   const [order, setOrder] = React.useState('asc');
//   const [orderBy, setOrderBy] = React.useState('calories');
//   const [dense, setDense] = React.useState(false);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);
//
//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };
//
//   const handleSelectAllClick = event => {
//     if (event.target.checked) {
//       const newSelecteds = rows.map(n => n.name);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   };
//
//   const handleClick = (event, name) => {
//     const selectedIndex = selected.indexOf(name);
//     let newSelected = [];
//
//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, name);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1),
//       );
//     }
//
//     setSelected(newSelected);
//   };
//
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };
//
//   const handleChangeRowsPerPage = event => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//
//   const handleChangeDense = event => {
//     setDense(event.target.checked);
//   };
//
//   const isSelected = name => selected.indexOf(name) !== -1;
//
//   const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
//
//   return (
//     <div className={classes.root}>
//       <Paper className={classes.paper}>
//         <EnhancedTableToolbar numSelected={selected.length} />
//         <TableContainer>
//           <Table
//             className={classes.table}
//             aria-labelledby="tableTitle"
//             size={dense ? 'small' : 'medium'}
//             aria-label="enhanced table"
//           >
//             <EnhancedTableHead
//               classes={classes}
//               numSelected={selected.length}
//               order={order}
//               orderBy={orderBy}
//               onSelectAllClick={handleSelectAllClick}
//               onRequestSort={handleRequestSort}
//               rowCount={rows.length}
//             />
//             <TableBody>
//               {stableSort(rows, getComparator(order, orderBy))
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row, index) => {
//                   const isItemSelected = isSelected(row.name);
//                   const labelId = `enhanced-table-checkbox-${index}`;
//
//                   return (
//                     <TableRow
//                       hover
//                       onClick={event => handleClick(event, row.name)}
//                       role="checkbox"
//                       aria-checked={isItemSelected}
//                       tabIndex={-1}
//                       key={row.name}
//                       selected={isItemSelected}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isItemSelected}
//                           inputProps={{ 'aria-labelledby': labelId }}
//                         />
//                       </TableCell>
//                       <TableCell component="th" id={labelId} scope="row" padding="none">
//                         {row.name}
//                       </TableCell>
//                       <TableCell align="right">{row.calories}</TableCell>
//                       <TableCell align="right">{row.fat}</TableCell>
//                       <TableCell align="right">{row.carbs}</TableCell>
//                       <TableCell align="right">{row.protein}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
//                   <TableCell colSpan={6} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onChangePage={handleChangePage}
//           onChangeRowsPerPage={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <FormControlLabel
//         control={<Switch checked={dense} onChange={handleChangeDense} />}
//         label="Dense padding"
//       />
//     </div>
//   );
// }
