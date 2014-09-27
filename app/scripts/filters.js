'use strict';
/*jshint unused:vars */
angular.module('Bullet3.filters',[])
.filter('dateTime', function($filter){
  return function(input){
    if(typeof input === 'undefined'){ return ''; }
    var _date = $filter('date')(new Date(input),'MMM dd yyyy h:mm a');
    return _date;
  };
})
.filter('time', function($filter){
  return function(input){
    if(typeof input ==='undefined'){ return ''; }
    var _date = $filter('date')(new Date(input),'h:mm a');
    return _date;
  };
})
.filter('keySize',function(){
  return function(obj){
    if(typeof obj ==='undefined'){
      return 0;
    }
    return Object.keys(obj).length;
  };
})
/*Filter for checking for message or author but no other properties*/
.filter('searchFilter',function(){
  return function (items,search) {
    if(!search){
      return items;
    }
    return items.filter(function(element,index,array){
      var re = new RegExp(search, 'i');
      return re.test(element.message) || re.test(element.author);
    });
  };
})
.filter('votes',function(){
  return function(i){
    if(typeof i==='undefined'){
      return 0;
    }
    return i;
  };
});