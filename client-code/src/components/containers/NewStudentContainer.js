/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk } from '../../store/thunks';
import { fetchAllCampusesThunk } from "../../store/thunks";

class NewStudentContainer extends Component {
  //Get campus data from back end database
  componentDidMount() {
    this.props.fetchAllCampuses();
  }

  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "", 
      email: "", //AL
      gpa: 0.0, //AL
      imageURL: "https://cdn-icons-png.flaticon.com/512/149/149071.png", 
      campusId: null, 
      allCampus: this.props.allCampuses,
      redirect: false, 
      redirectId: null
    };
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.
    
    //Check if campus id is in database
    if (!(this.state.allCampus.map(({id}) => id)).includes(parseInt(this.state.campusId))){ 
      alert("This campus ID is not in our database, please enter a valid campus ID!")
    }
    else{
        let student = {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          campusId: this.state.campusId,
          email: this.state.email, //AL
          gpa: this.state.gpa, //AL
          imageURL: this.state.imageURL //AL
      };
      
      // Add new student in back-end database
      let newStudent = await this.props.addStudent(student);

      // Update state, and trigger redirect to show the new student
      this.setState({
        firstname: "", 
        lastname: "", 
        email: "", //AL
        gpa: 0.0, //AL
        imageURL: null, //AL
        campusId: null, 
        redirect: true, 
        redirectId: newStudent.id
      });
    }
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}     
          allCampuses={this.props.allCampuses} 
        />
      </div>          
    );
  }
}
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "allCampuses".
// The following 2 input arguments are passed to the "connect" function used by "AllCampusesContainer" component to connect to Redux Store.
const mapState = (state) => {
  return {
    allCampuses: state.allCampuses,  // Get the State object from Reducer "allCampuses"
  };
};  
// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        addStudent: (student) => dispatch(addStudentThunk(student)),
        fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(NewStudentContainer);