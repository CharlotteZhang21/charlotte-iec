var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var AptList = require('./AppList');
var AddAppointment = require('./AddAppointment');
var _ = require('lodash');

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}//render

//version higher than 15.0.1 updated React.createClass
//use the following one instead

var MainInterface = createReactClass({
	getInitialState: function(){
		
		return {
			aptBodyVisible: false,
			MyAppointment: [] //data
		}//return

	}, //getInitialState
	
	componentDidMount: function() {
		//Ajax data
		this.serverRequest = $.get('data/data.json', function(result){
			var tempApts = result;
			this.setState({
				MyAppointment: tempApts
			}); // setState
		}.bind(this));
	}, // componenetDidMound

	deleteMessage: function(item) {
		//lodash is a simplified tool to visit all the arrays
		var allApts = this.state.MyAppointment;
		var newApts = _.without(allApts, item);
		this.setState({
			MyAppointment : newApts
		});//setState
	},//deleteMessage


	handleDisplay: function() {
		var flag = true;
		if( this.state.aptBodyVisible ){
			flag = false;
		}else {
			flag = true;
		};
		this.setState({
			aptBodyVisible : flag
		});
	},//handleDisplay

	addItem: function(tempItem) {
		var tempApts = this.state.MyAppointment;
		tempApts.push(tempItem);
		this.setState({
			MyAppointment: tempApts
		});//setState
	},//addItem

	render(){

		/*===========this is for display all the things in the array or json data========*/
		var filteredApts = this.state.MyAppointment;

		filteredApts = filteredApts.map(function(item, index) {
			return(
				
				<AptList key = { index }
					singleItem = { item }
					whichItem = { item }
					onDelete = {this.deleteMessage} />
				
			)//return
		}.bind(this))//fileterApts

		/*=========== END =====*/
	
		return (
			<div className = "interface">
				<AddAppointment 
					bodyVisible = { this.state.aptBodyVisible}
					handleDisplay = {this.handleDisplay}
					addApt = {this.addItem}/>
				<div className = "item-list media-list">
					<ul className="item-list media-list">
						{filteredApts}
					</ul>
				</div>
			</div>
		) //return
	}//render
}); //main interface

ReactDOM.render(
	<MainInterface />,
  	document.getElementById('petAppointments')
); //render