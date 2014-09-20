'use strict';
angular.module('Bullet3.filters',[])
.filter('dateTime', function($filter){
	return function(input){
		if(input === null){ return ''; }
		var _date = $filter('date')(new Date(input),'MMM dd yyyy h:mm a');
		return _date;
	};
})
.filter('time', function($filter){
	return function(input){
		if(input === null){ return ''; }
		var _date = $filter('date')(new Date(input),'h:mm a');
		return _date;
	};
});