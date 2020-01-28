import React, { Component } from 'react'
import ModelTable from './ModelTable'
import CreateModelForm from './CreateModelForm'
import axios from 'axios'
import EditModelForm from './EditModelForm';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelController extends Component {
  state = {
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
    axios.get('/api/models/?shortform=true').then(res => {
      console.log('nextpage from model shortform')
      console.log(res.data)
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
    if (this.state.showTableView){
        content = <ModelTable models={ this.state.models } 
                    sendShowCreate={this.getShowCreate}
                    sendShowEdit={this.getShowEdit}
                    sendEditID={this.getEditID}
                    sendShowDelete={this.getShowDelete} />
    }
    else if (this.state.showCreateView){
        content = <CreateModelForm /> 
    }
    else if (this.state.showEditView){
        content= <EditModelForm editID={this.state.editID} /> 
    }

    let paginateNavigation = <p>no nav</p>;
    if (this.state.prevPage == null && this.state.nextPage != null) {
      paginateNavigation = <button onClick={ this.paginateNext }>next page</button>;
    } 
    else if (this.state.prevPage != null && this.state.nextPage == null) {
      paginateNavigation = <button onClick={ this.paginatePrev }>prev page</button>;
    }
    else if (this.state.prevPage != null && this.state.nextPage != null) {
      paginateNavigation = <div><button onClick={ this.paginatePrev }>prev page</button><button onClick={ this.paginateNext }>next page</button></div>;
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