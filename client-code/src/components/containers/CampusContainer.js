/*==================================================
CampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCampusThunk } from "../../store/thunks";

import { CampusView } from "../views";

class CampusContainer extends Component {
  // Get the specific campus data from back-end database
  componentDidMount() {
    // Get campus ID from URL (API link)
    this.props.fetchCampus(this.props.match.params.id);
    window.scrollTo(0,0);
  }

  componentDidUpdate(){
    let studentArray = document.querySelectorAll(["div.studentLink"])
    var counter = 0; // Alternate between students
    for(let i = 0; i < studentArray.length; i++){
      if(counter % 2 == 0)
      {
        studentArray[i].style.backgroundColor = '#63229A';
        studentArray[i].style.color = 'white';
        studentArray[i].onmouseenter = function() {imageHover(studentArray[i])};
        studentArray[i].onmouseleave = function() {imageHoverLeave(studentArray[i])};
      }
      studentArray[i].style.borderTopWidth = '0px';
      studentArray[i].style.borderBottomWidth = '0px';
      
      counter++;
    }

    if (studentArray.length){
      studentArray[0].style.borderTopWidth = '3px';
      studentArray[studentArray.length-1].style.borderBottomWidth = '3px';
    }
  }
  
  // Render a Campus view by passing campus data as props to the corresponding View component
  render() {
    return (
      <div>
        <Header />
        <CampusView campus={this.props.campus} />
      </div>
    );
  }
}

function imageHover(x) {
  if(x)
  {
    x.style.color = '#B19CD9';
  }
}

function imageHoverLeave(x){
  if(x){
    x.style.color = 'white';
  }
}

// The following 2 input arguments are passed to the "connect" function used by "CampusContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "campus".
const mapState = (state) => {
  return {
    campus: state.campus,  // Get the State object from Reducer "campus"
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
  return {
    fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
  };
};

// Export store-connected container by default
// CampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(CampusContainer);