import React, {Component} from "react"
import ModelTable from "./ModelTable"
import CreateModelForm from "./CreateModelForm"
import axios, {post} from "axios"
import EditModelForm from "./EditModelForm";
import ModelFilters from "./ModelFilters";
import ModelSort from "./ModelSort";
import ModelTableMUI from "./ModelTableMUI"
import DetailedModel from "./DetailedModel";
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, Typography
} from "@material-ui/core"
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {UncontrolledCollapse} from "reactstrap";
import RackFilters from "./RackFilters";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelController extends Component {
  constructor() {
    super();
    this.state = {
      models: [{}
      ],
      showTableView: true,
      showIndividualModelView: false,
      showCreateView: false,
      showEditView: false,
      showingAll: false,
      editID: 0,
      deleteID: 0,
      prevPage: null,
      nextPage: null,
      filterQuery: "",
      sortQuery: "",
      rerender: false,
      file: null
    };

    // I don"t think i need this bind here; but too scared to take it out lol
    this.getShowTable = this.getShowTable.bind(this);
  }

  getRerender = (re) => {
    if (re) {
      this.setState({rerender: true})
    }
  }

  getDetailedModelID = (id) => {
    this.setState({detailedModelID: id});
  }


  getShowTable = (show) => {
    show ? this.setState({
        showTableView: true,
        // everything else false
        showIndividualModelView: false,
        showCreateView: false,
        showEditView: false,
      })
      : this.setState({
        showTableView: true,
      })
  }

  getShowDetailedModel = (show) => {
    show ? this.setState({
        showIndividualModelView: true,
        // everything else false
        showTableView: false,
        showCreateView: false,
        showEditView: false,
      })
      : this.setState({
        showIndividualModelView: false,
      })
  }

  showCreateForm = () => {
    this.getShowCreate(true);
  }

  getShowCreate = (show) => {
    show ? this.setState({
        showCreateView: true,
        // everything else false
        showTableView: false,
        showIndividualModelView: false,
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
        showCreateView: false,
        showIndividualModelView: false,
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
            alert("Import was successful.\n" + JSON.stringify(response, null, 2));
          })
            .catch(function (error) {
              console.log(error.response)
              alert("Import was not successful.\n" + JSON.stringify(error.response.data, null, 2));
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

  getModels = () => {
    let dst = "/api/models/" + "?" + this.state.filterQuery + "&" + this.state.sortQuery;
    console.log("QUERY")
    console.log(dst)
    axios.get(dst).then(res => {
      this.setState({
        models: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
      });
  }

  getAllModels = () => {
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
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response.data, null, 2));
      });
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

  render() {
    let content;
    console.log("rerender")

    if (this.state.showTableView) {
      content = <div><ModelTableMUI models={this.state.models}
                                    filter_query={this.getFilterQuery}
                                    sendSortQuery={this.getSortQuery}
                                    sendRerender={this.getRerender}
                                    sendShowTable={this.getShowTable}
                                    sendShowDetailedModel={this.getShowDetailedModel}
                                    sendModelID={this.getDetailedModelID}
                                    sendShowCreate={this.getShowCreate}
                                    sendShowEdit={this.getShowEdit}
                                    sendEditID={this.getEditID}
                                    is_admin={this.props.is_admin}/></div>
    } else if (this.state.showIndividualModelView) {
      content = <DetailedModel modelID={this.state.detailedModelID}
                               sendShowTable={this.getShowTable}/>;
    } else if (this.state.showCreateView) {
      content = <CreateModelForm

        sendShowTable={this.getShowTable}/>
    } else if (this.state.showEditView) {
      content = <EditModelForm editID={this.state.editID}
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
      <Button color="primary" variant="contained" endIcon={<AddCircleIcon/>}
              onClick={this.showCreateForm}>Add Model</Button>
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

    if (!this.state.showTableView) {
      paginateNavigation = <p></p>;
      exp = <p></p>;
      showAll = <p></p>;
      add = <p></p>
      imp = <p></p>
    }

    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item alignContent="center" xs={10}/>
            <Grid item justify="flex-end" alignContent="center" xs={2}>
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

export default ModelController