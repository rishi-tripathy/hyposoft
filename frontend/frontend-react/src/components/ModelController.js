import React, {Component} from "react"
import CreateModelForm from "./CreateModelForm"
import axios, {post} from "axios"
import EditModelForm from "./EditModelForm";
import ModelTableMUI from "./ModelTableMUI"
import DetailedModel from "./DetailedModel";
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, Typography, CircularProgress
} from "@material-ui/core"
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {Link} from 'react-router-dom'
import DatacenterContext from "./DatacenterContext";


axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelController extends Component {

  constructor() {
    super();
    this.state = {
      models: [{}
      ],
      showingAll: false,
      prevPage: null,
      nextPage: null,
      filterQuery: "",
      sortQuery: "",
      rerender: false,
      file: null,
      loading: true,
    };

  }

  getModels = () => {
    let dst = "/api/models/" + "?" + this.state.filterQuery + "&" + this.state.sortQuery;
    console.log("QUERY")
    console.log(dst)
    axios.get(dst).then(res => {
      this.setState({
        models: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
        loading: false,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        this.setState({
          loading: false,
        })
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
      });
  }

  getFilterQuery = (q) => {
    this.setState({filterQuery: q});
    console.log(this.state.filterQuery);
  }

  getSortQuery = (q) => {
    this.setState({sortQuery: q})
    console.log(this.state.sortQuery);
  }

  componentDidMount() {
    this.getModels();
  }

  componentDidUpdate(prevProps, prevState) {
    const delay = 50;

    // When showing table again, rerender
    if (prevState.showTableView === false && this.state.showTableView === true) {
      setTimeout(() => {
        this.getModels();
      }, delay);
    }

    // Once filter changes, rerender
    if (prevState.filterQuery !== this.state.filterQuery) {
      setTimeout(() => {
        this.getModels();
      }, delay);
    }

    // Once sort changes, rerender
    if (prevState.sortQuery !== this.state.sortQuery) {
      setTimeout(() => {
        this.getModels();
      }, delay);
    }

    // After crud, rerender
    if (prevState.rerender === false && this.state.rerender === true) {
      setTimeout(() => {
        this.getModels();
        this.setState({rerender: false});
      }, delay);

    }
  }

  getRerender = (re) => {
    if (re) {
      this.setState({rerender: true})
    }
  }

  exportData = () => {
    let filter = this.state.filterQuery;
    let sort = this.state.sortQuery;

    if (this.state.filterQuery.length !== 0) {
      filter = filter + "&";
    }

    if (this.state.sortQuery.length !== 0) {
      sort = sort + "&"
    }

    let dst = "/api/models/" + "?" + filter + sort + "export=true";
    console.log("exporting to:  " + dst);
    const FileDownload = require("js-file-download");

    axios.get(dst).then(res => {
      // console.log(res.data.next)
      FileDownload(res.data, "model_export.csv");
      alert("Export was successful.");
    })
      .catch(function (error) {
        alert("Export was not successful.\n" + JSON.stringify(error.response.data, null, 2));
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
      alert("Import was successful.\n" + JSON.stringify(response.data, null, 2));
    })
      .catch(function (error) {
        console.log(error.response)
        const fileUploadOverride = (file) => {
          const url = "/api/models/import_file/?override=true";
          const formData = new FormData();
          formData.append("file", file)
          const config = {
            headers: {
              "content-type": "multipart/form-data"
            }
          }
          return post(url, formData, config)
        }

        if (window.confirm("Import was not successful.\n" + JSON.stringify(error.response.data, null, 2))) {
          fileUploadOverride(f).then((response) => {
            alert("Import was successful.\n" + JSON.stringify(response.data, null, 2));
          })
            .catch(function (error) {
              console.log(error.response)
              alert("Import was not successful.\n" + JSON.stringify(error.response.data, null, 2));
            });
        }
      });
    this.setState({
      rerender: true
    });
  }

  handleFileUpload = (e) => {
    console.log(e.target.files[0])
    this.setState({
      file: e.target.files[0],
    });
  }

  fileUpload = (file) => {
    const url = "/api/models/import_file/";
    const formData = new FormData();
    formData.append("file", file)
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    }
    return post(url, formData, config)
  }

  paginateNext = () => {
    axios.get(this.state.nextPage).then(res => {
      this.setState({
        models: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
      });
  }

  paginatePrev = () => {
    axios.get(this.state.prevPage).then(res => {
      this.setState({
        models: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
      });
  }

  toggleShowingAll = () => {
    this.state.showingAll ? (
      this.getModels()
    ) : (this.getAllModels())
    this.setState(prevState => ({
      showingAll: !prevState.showingAll
    }));
  }

  getAllModels = () => {

    this.setState({
      loading: true,
    })
    let filter = this.state.filterQuery;
    let sort = this.state.sortQuery;

    if (this.state.filterQuery.length !== 0) {
      filter = filter + "&";
    }

    if (this.state.sortQuery.length !== 0) {
      sort = sort + "&"
    }

    let dst = "/api/models/" + "?" + filter + sort + "show_all=true";

    console.log("QUERY")
    console.log(dst)
    axios.get(dst).then(res => {
      this.setState({
        models: res.data,
        prevPage: null,
        nextPage: null,
        loading: false,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        this.setState({
          loading: false,
        })
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
      });
  }

  render() {
    let content = <div><ModelTableMUI models={this.state.models}
                                      filter_query={this.getFilterQuery}
                                      sendSortQuery={this.getSortQuery}
                                      sendRerender={this.getRerender}/>
    </div>


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


    let exp = <Button variant="outlined" startIcon={<SaveAltIcon/>} onClick={this.exportData}>Export</Button>
    let showAll = <p></p>;
    if (this.state.prevPage != null || this.state.nextPage != null) {
       showAll = <FormControlLabel labelPlacement="left"
                                      control={
                                        <Switch value={this.state.showingAll} onChange={() => this.toggleShowingAll()}/>
                                      }
                                      label={
                                        <Typography variant="subtitle1"> Show All</Typography>
                                      }
      />
    }

    let add = this.context.is_admin ? (
      <Link to={'/models/create'}>
        <Button color="primary" variant="contained" endIcon={<AddCircleIcon/>}>
          Add Model
        </Button>
      </Link>

    ) : <p></p>;


    let imp = this.context.is_admin ? (
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
    ) : <p></p>;


    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12}/>
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Model Table
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
              {this.state.loading ? <center><CircularProgress size={100}/> </center>: content}
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

ModelController.contextType = DatacenterContext;

export default ModelController
