import React, { Component } from 'react'
import ModelTable from './ModelTable'
import CreateModelForm from './CreateModelForm'
import axios from 'axios'
import EditModelForm from './EditModelForm';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelController extends Component {
  constructor() {
    super();
    this.state = {
      models: [
        // {
        //   'id': 99,
        //   'vendor': 'default',
        //   'model_number': 'default',
        //   'height': 2,
        //   'display_color': 'Red',
        //   'ethernet_ports': 1,
        //   'power_ports': 1,
        //   'cpu': 'Intel CPU',
        //   'memory': 3,
        //   'storage': 'Lots of Raid',
        //   'comment': 'First Model'
        // }
      ],
      showTableView: true,
      showCreateView: false,
      showEditView: false,
      showDeleteView: false,
      editID: 0,
      deleteID: 0,
      prevPage: null,
      nextPage: null,
    };
    //this.refreshTable = this.refreshTable.bind(this);
    this.getShowTable = this.getShowTable.bind(this);
  }
  

  getShowTable = (show) => {
    console.log('showing talbe')
    show ? this.setState({
      showTableView: true,
      showCreateView : false,
      showEditView: false,
      showDeleteView: false,
    })
    : this.setState({
      showTableView : false,
    }) 
  }

  getShowCreate = (show) => {
    show ? this.setState({
      showTableView: false,
      showCreateView : true,
      showEditView: false,
      showDeleteView: false,
    })
    : this.setState({
      showCreateView : false,
    }) 
  }

  getShowEdit = (show) => {
    show ? this.setState({
      showTableView: false,
      showCreateView : false,
      showEditView: true,
      showDeleteView: false,
    })
    : this.setState({
      showEditView : false,
    }) 
  }

  getEditID = (id) => {
    this.setState({
      editID: id,
    });
  }

  getShowDelete = (show) => {
    show ? this.setState({
      showTableView: false,
      showCreateView : false,
      showEditView: false,
      showDeleteView: true,
    })
    : this.setState({
      showDeleteView : false,
    }) 
  }

  componentDidMount() {
    this.refreshTable();
    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showTableView === false && this.state.showTableView === true) {
      console.log('rerending table, must refresh')
      this.refreshTable();
    }
  }

  refreshTable = () => {
    axios.get('/api/models/?shortform=true').then(res => {
      this.setState({ 
        models: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
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
      console.log(error.response);
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
      console.log(error.response);
    });
  }

  render() {
    let content;
    console.log('rerender')

    if (this.state.showTableView){
      content = <div><h2>Model Table</h2><ModelTable models={ this.state.models } 
                  sendShowCreate={this.getShowCreate}
                  sendShowEdit={this.getShowEdit}
                  sendEditID={this.getEditID}
                  sendShowDelete={this.getShowDelete} /></div>

      
    }
    else if (this.state.showCreateView){
        content = <CreateModelForm sendShowTable={this.getShowTable} /> 
    }
    else if (this.state.showEditView){
        content= <EditModelForm editID={this.state.editID} 
                    sendShowTable={ this.getShowTable } 
                    sendShowCreate={this.getShowCreate}
                    sendShowEdit={this.getShowEdit}
                    sendShowDelete={this.getShowDelete}/> 
    }

    let paginateNavigation = <p></p>;
    if (this.state.prevPage == null && this.state.nextPage != null) {
      paginateNavigation = <div><button onClick={ this.paginateNext }>next page</button></div>;
    } 
    else if (this.state.prevPage != null && this.state.nextPage == null) {
      paginateNavigation = <div><button onClick={ this.paginatePrev }>prev page</button></div>;
    }
    else if (this.state.prevPage != null && this.state.nextPage != null) {
      paginateNavigation = <div><button onClick={ this.paginatePrev }>prev page</button><button onClick={ this.paginateNext }>next page</button></div>;
    }

    // if we're not on the table, then don't show pagination
    if (! this.state.showTableView) {
      paginateNavigation = <p></p>;
    }
  
    if (this.state.models[0] == null) {
      return <p>No models exist</p>
    } else {
      return (
        <div>
          { paginateNavigation }
          <br></br>
          {content}
        </div>
      )
    }
  }
}

export default ModelController