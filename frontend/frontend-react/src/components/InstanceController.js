import React, {Component} from 'react'
import InstanceTableMUI from './InstanceTableMUI'
import axios, {post} from 'axios'
import DetailedInstance from './DetailedInstance';
import CreateInstanceForm from './CreateInstanceForm';
import EditInstanceForm from './EditInstanceForm';
import InstanceFilters from './InstanceFilters';
import InstanceSort from './InstanceSort';
//import {UncontrolledCollapse, Button, ButtonGroup, Container, Card, ButtonToolbar, Row, Col} from 'reactstrap';
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, Typography
} from "@material-ui/core"
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ModelTableMUI from "./ModelTableMUI";
import {Link} from "react-router-dom";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class InstanceController extends Component {


  constructor() {
    super();
    this.state = {
      instances: [{}
        // {
        //   id: 99,
        //   model: 'default',
        //   hostname: 'default',
        // }
      ],
      showTableView: true,
      showIndividualInstanceView: false,
      detailedInstanceID: 0,
      showCreateView: false,
      showEditView: false,
      prevPage: null,
      nextPage: null,
      filterQuery: '',
      sortQuery: '',
      rerender: false,
      file: null,
      showingAll: false
    };

    this.getShowTable = this.getShowTable.bind(this);
    this.getDetailedInstanceID = this.getDetailedInstanceID.bind(this);
    this.getFilterQuery = this.getFilterQuery.bind(this);
    //this.getRerender = this.getRerender.bind(this);
  }

  getRerender = (re) => {
    if (re) {
      this.setState({rerender: true})
    }
  }

  getShowTable = (show) => {
    show ? this.setState({
        showTableView: true,
        // everything else false
        showIndividualInstanceView: false,
        showCreateView: false,
        showEditView: false,
      })
      : this.setState({
        showTableView: false,
      })
  }

  getShowDetailedInstance = (show) => {
    show ? this.setState({
        showIndividualInstanceView: true,
        // everything else false
        showTableView: false,
        showCreateView: false,
        showEditView: false,
      })
      : this.setState({
        showIndividualInstanceView: false,
      })
  }

  getShowCreate = (show) => {
    show ? this.setState({
        showCreateView: true,
        // everything else false
        showTableView: false,
        showIndividualInstanceView: false,
        showEditView: false,

      })
      : this.setState({
        showCreateView: false,
      })
  }

  getShowEdit = (show) => {
    show ? this.setState({
        showEditView: true,
        // everything else false
        showTableView: false,
        showIndividualInstanceView: false,
        showCreateView: false,
      })
      : this.setState({
        showEditView: false,
      })
  }

  getEditID = (id) => {
    this.setState({
      editID: id,
    });
  }

  getDetailedInstanceID = (id) => {
    this.setState({detailedInstanceID: id});
  }

  getInstances = () => {
    let dst = '/api/instances/' + '?' + this.state.filterQuery + '&' + this.state.sortQuery;
    console.log('QUERY')
    console.log(dst)
    axios.get(dst).then(res => {
      // console.log(res.data.next)
      this.setState({
        instances: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  getAllInstances = () => {
    let filter = this.state.filterQuery;
    let sort = this.state.sortQuery;

    if (this.state.filterQuery.length !== 0) {
      filter = filter + '&';
    }

    if (this.state.sortQuery.length !== 0) {
      sort = sort + '&'
    }

    let dst = '/api/instances/' + '?' + filter + sort + 'show_all=true';

    console.log('QUERY')
    console.log(dst)
    axios.get(dst).then(res => {
      // console.log(res.data.next)
      this.setState({
        instances: res.data,
        prevPage: null,
        nextPage: null,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response.data)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  getFilterQuery = (q) => {
    this.setState({filterQuery: q});
  }

  getSortQuery = (q) => {
    this.setState({sortQuery: q})
    console.log(this.state.sortQuery);
  }

  componentDidMount() {
    this.getInstances();
  }

  componentDidUpdate(prevProps, prevState) {
    const delay = 50;

    // When showing table again, rerender
    if (prevState.showTableView === false && this.state.showTableView === true) {
      setTimeout(() => {
        this.getInstances();
      }, delay);
    }

    // Once filter changes, rerender
    if (prevState.filterQuery !== this.state.filterQuery) {
      setTimeout(() => {
        this.getInstances();
      }, delay);
    }

    // Once sort changes, rerender
    if (prevState.sortQuery !== this.state.sortQuery) {
      setTimeout(() => {
        this.getInstances();
      }, delay);
    }

    // After crud, rerender
    if (prevState.rerender === false && this.state.rerender === true) {
      setTimeout(() => {
        this.getInstances();
        this.setState({rerender: false});
      }, delay);

    }
  }

  paginateNext = () => {
    axios.get(this.state.nextPage).then(res => {
      this.setState({
        instances: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  paginatePrev = () => {
    axios.get(this.state.prevPage).then(res => {
      this.setState({
        instances: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }
  toggleShowingAll = () => {
    this.state.showingAll ? (
      this.getInstances()
    ) : (this.getAllInstances())
    this.setState(prevState => ({
      showingAll: !prevState.showingAll
    }));
  }
  exportData = () => {
    let filter = this.state.filterQuery;
    let sort = this.state.sortQuery;

    if (this.state.filterQuery.length !== 0) {
      filter = filter + '&';
    }

    if (this.state.sortQuery.length !== 0) {
      sort = sort + '&'
    }

    let dst = '/api/instances/' + '?' + filter + sort + 'export=true';
    console.log('exporting to:  ' + dst);
    const FileDownload = require('js-file-download');
    axios.get(dst).then(res => {
      // console.log(res.data.next)
      FileDownload(res.data, 'instance_export.csv');
      alert("Export was successful.");
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Export was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  handleImport = (e) => {
    e.preventDefault();
    let f = this.state.file;
    if (f == null) {
      alert("You must upload a file.");
      return;
    }
    this.fileUpload(this.state.file).then((response) => {
      alert("Import was successful." + JSON.stringify(response.data, null, 2));
    })
      .catch(function (error) {
        console.log(error.response)
        const fileUploadOverride = (file) => {
          const url = '/api/instances/import_file/?override=true';
          const formData = new FormData();
          formData.append('file', file)
          //formData.append('name', 'sup')
          const config = {
            headers: {
              'content-type': 'multipart/form-data'
            }
          }
          return post(url, formData, config)
        }

        if (window.confirm('Import was not successful.\n' + JSON.stringify(error.response.data, null, 2))) {
          fileUploadOverride(f).then((response) => {
            console.log(response.data);
          })
            .catch(function (error) {
              console.log(error.response)
              alert('Import was not successful.\n' + JSON.stringify(error.response.data, null, 2));
            });
        }
      });
    this.showRerender();
  }

  handleFileUpload = (e) => {
    console.log(e.target.files[0])
    this.setState({
      file: e.target.files[0],
    });
  }

  fileUpload = (file) => {
    const url = '/api/instances/import_file/';
    const formData = new FormData();
    formData.append('file', file)
    //formData.append('name', 'sup')
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return post(url, formData, config)
  }


  render() {
    let content;

    if (this.state.showTableView) {
      content = <InstanceTableMUI
        instances={this.state.instances}
        filter_query={this.getFilterQuery}
        sendSortQuery={this.getSortQuery}
        sendRerender={this.getRerender}
        sendShowTable={this.getShowTable}
        sendShowDetailedInstance={this.getShowDetailedInstance}
        sendInstanceID={this.getDetailedInstanceID}
        sendShowCreate={this.getShowCreate}
        sendShowEdit={this.getShowEdit}
        sendEditID={this.getEditID}
        is_admin={this.props.is_admin}/>;
    } else if (this.state.showIndividualInstanceView) {
      content = <DetailedInstance instanceID={this.state.detailedInstanceID}
                                  sendShowTable={this.getShowTable}
                                  is_admin={this.props.is_admin}/>;
    } else if (this.state.showCreateView) {
      content = <CreateInstanceForm sendRerender={this.getRerender}
                                    sendShowTable={this.getShowTable}/>
    } else if (this.state.showEditView) {
      content = <EditInstanceForm editID={this.state.editID}
                                  sendRerender={this.getRerender}
                                  sendShowTable={this.getShowTable}
                                  sendShowCreate={this.getShowCreate}
                                  sendShowEdit={this.getShowEdit}/>
    }

    let paginateNavigation = <p></p>;
    if (this.state.prevPage == null && this.state.nextPage != null) {
      paginateNavigation =

        <ButtonGroup>
          <Button color="primary" disabled onClick={this.paginatePrev}>prev page
          </Button>{"  "}<Button color="primary" onClick={this.paginateNext}>next page</Button>
        </ButtonGroup>
    } else if (this.state.prevPage != null && this.state.nextPage == null) {
      paginateNavigation =
        <ButtonGroup>
          <Button color="primary" onClick={this.paginatePrev}>prev page
          </Button>{"  "}<Button color="primary" disabled onClick={this.paginateNext}>next page</Button>
        </ButtonGroup>
    } else if (this.state.prevPage != null && this.state.nextPage != null) {
      paginateNavigation =
        <ButtonGroup>
          <Button color="primary" onClick={this.paginatePrev}>prev page
          </Button>{"  "}<Button color="primary" onClick={this.paginateNext}>next page</Button>
        </ButtonGroup>
    }


    // let filters = <InstanceFilters sendFilterQuery={ this.getFilterQuery } />
    // let sorting = <InstanceSort sendSortQuery={ this.getSortQuery } />
    let exp = <Button variant="outlined" startIcon={<SaveAltIcon/>} onClick={this.exportData}>Export</Button>

    let showAll = <FormControlLabel labelPlacement="left"
                                    control={
                                      <Switch value={this.state.showingAll} onChange={() => this.toggleShowingAll()}/>
                                    }
                                    label={
                                      <Typography variant="subtitle1"> Show All</Typography>
                                    }
    />

    let add = this.props.is_admin ? (
      <Link to={'/assets/create'}>
        <Button color="primary" variant="contained" endIcon={<AddCircleIcon/>}>
          Add Instance +
        </Button>
      </Link>

    ) : {};

    let imp = this.props.is_admin ? (
      <>
        <Button variant="outlined" component="span" startIcon={<CloudUploadIcon/>} onClick={this.handleImport}>
          Import
        </Button>
        <input
          accept="text/csv"
          id="outlined-button-file"
          multiple
          type="file"
          onChange={this.handleFileUpload}
        />
      </>
    ) : {};

    // if we're not on the table, then don't show pagination or filters or sorting
    if (!this.state.showTableView) {
      paginateNavigation = <p></p>;
      // filters = <p></p>;
      exp = <p></p>;
      showAll = <p></p>;
      add = <p></p>
      imp = <p></p>
    }

    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12}/>
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Instance Table
              </Typography>
            </Grid>
            <Grid item justify="flex-end" alignContent="flex-end" xs={2}>
              {showAll}
            </Grid>
            <Grid item justify="flex-start" alignContent="center" xs={3}>
              {add}
            </Grid>
            <Grid item justify="center" alignContent="center" xs={3}>
              {exp}
            </Grid>
            <Grid item justify="center" alignContent="center" xs={3}>
              {imp}
            </Grid>
            <Grid item justify="flex-end" alignContent="flex-end" xs={3}>
              {paginateNavigation}
            </Grid>
            <Grid item xs={12}>
              {content}
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default InstanceController