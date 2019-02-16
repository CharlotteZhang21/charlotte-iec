var React = require('react');
var createReactClass = require('create-react-class');

var AppList = createReactClass({
	
	handleDelete: function(){
		this.props.onDelete(this.props.whichItem)
	}, // handleDelete

	render(){
		return(
				
			<li className="pet-item media">
				<div className = "media-left">
					<button className="pet-delete btn btn-xs btn-danger" onClick = {this.handleDelete}>
					<span className="glyphicon glyphicon-remove"></span></button>
				</div>
				<div className = "pet-info media-body">
					<div className = "pet-head">
						<span className = "pet-name">{this.props.singleItem.petName}</span>
						<span className = "apt-date pull-right">{this.props.singleItem.aptDate}</span>
					</div>
					<div className = "ownerName">
						<span className = "label-item">{this.props.singleItem.ownerName}</span>
						<span className = "label-item">{this.props.singleItem.aptNotes}</span>
					</div>
				</div>
			</li>
				
		)//return	
	}
	
});

module.exports = AppList;