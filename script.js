var time_slots = ["0300-0700", "0700-1100","0700-1500", "0700-1900", "1100-1500","1100-1900", "1500-1900","1500-2300", "1900-2300","1900-0700", "2300-0300"];

function Request(start,duration,day,user){
  this.start = start;
  this.duration = duration;
  this.day = day;
  this.user = user;
  this.approved = false;
}

function Shift(start){
  this.start = start;
  this.duration = 4;
}

function Need(start,duration,day){
  this.start = start;
  this.duration = duration;
  this.day = day;
  this.fulfilled = false;
}

function MonthlyNeeds(){
  //TALLY NEEDS FOR MONTH
}

function TallyRequests(){

}

function Person(startDate, id){
  this.startDate = startDate;
  this.requests = [];
  this.id = id;
}

function Calendar(){
  this.needs = [];
  this.requests = [];
}
var calendar = new Calendar();

function dummyData(){
  var a = new Person(0, 0);
  var b = new Person(1,1);
  var c = new Person(2,2);
  var d = new Person(3,3);
  var e = new Person(4,4);
  var f = new Person(5,5);
  var users = [a,b,c,d,e,f];
  for(var i = 0; i < users.length;i++){
    for(var j = 0; j<3; j++){
      var startTimes = [7,19];
      var randomTime = Math.floor(Math.random()*2);
      var randomDay = Math.floor(Math.random()*7);
      calendar.requests.push(new Request(startTimes[0], 12,randomDay,users[i].startDate))
    }
  }
}
function dummyNeeds(){
  for(var i = 0; i<24;i++){
    var startTimes = [7,19];
    var randomTime = Math.floor(Math.random()*2);
    var randomDay = Math.floor(Math.random()*7);
    calendar.needs.push(new Need(startTimes[0],12,randomDay));
  }
}

function solve(){
  var users = getUsers();
  for(var i = 0; i<users.length;i++){
    getRequestsByUser(i).forEach(function(request){
      for(var j = 0; j<calendar.needs.length; j++){
        var need = calendar.needs[j];
        if(available(need, request) && matches(need, request)){
          fill(need, request)
        }
      }
    })
  }
}

//starting here, methods should eventually be private methods, residing in a Solver class
function getUsers(){
  return [0,1,2,3,4,5];
}

function fill(need, request){
  need.fulfilled = true;
  request.approved = true;
}

function matches(need, request){
  return (need.day == request.day && need.start == request.start)
}

function available(need, request){
  return (!need.fulfilled && !request.approved)
}

function getRequestsByUser(personID){
  var requests = [];
  for(var i =0; i<calendar.requests.length; i++){
    if(calendar.requests[i].user==personID){
      requests.push(calendar.requests[i]);
    }
  }
  return requests;
}
//TODO: make private Solver methods until here


//make calendar
function make_calendar(){
  for(var i = 0; i<4;i++){
    var week = "week" + i;
    var week_div = "<div class = '" + week + " week'></div>";
    $(".calendar").append(week_div);
    for(var j = 0; j<7;j++){
      var day = "day" + (j + i*7);
      var day_div = "<div class = '" + day + " day'></div>";
      $("."+week).append(day_div);
    }
  }
}
//populate day
function draw_day_needs(day_selector){
  var day_needs = "<div class='day_needs'></div>";
  $("."+day_selector).append(day_needs);
  for(var i = 0; i<time_slots.length;i++){
    var time_slot_inner = "<div>" + time_slots[i] + ": " + "<input type='number' id='"+day_selector+"_"+i + "'</div>";
    //console.log("."+day_selector+"." +day_needs);
    $("."+day_selector + "> div").append(time_slot_inner);
  }

}
//show needs
$("#need").click(function(){
  if($(".day_needs").length<1){
    for(var i = 0; i<28;i++){
      draw_day_needs("day"+i);
    }
    cal_obj_to_cal();
  }
})
$("#request").click(function(){
  for(var i = 0; i<28; i++){
    $(".day"+i).html("");
  }
})

$("#save").click(function(){
  calendar.needs = [];
  for(var i = 0; i<28; i++){
    for(var j = 0; j<time_slots.length; j++){
      var data = $("#day"+i+"_"+j).val();
      data = parseInt(data);
      if(data>0){
        var start_time = time_slots[j].substring(0,4);
        start_time = parseInt(start_time)/100;
        var str = time_slots[j];
        var end = str.substring(5);
        end = parseInt(end)/100;
        var duration = end-start_time;
        for(var k = 0; k<data; k++){
          calendar.needs.push(new Need(start_time, duration, i));
        }
      }

    }
  }
});
$("#clear").click(function(){
  calendar.needs = [];
  calendar.requests = [];
  for(var i = 0; i<28; i++){
    for(var j = 0; j<time_slots.length; j++){
      $("#day"+i+"_"+j).val("");
    }
  }
})

function cal_obj_to_cal(){
  for(var i = 0; i<calendar.needs.length; i++){
    var need = calendar.needs[i];
    var val = $("#day"+need.day+"_"+get_timeslot_id(need.start,need.duration)).val();
    if(val==""){
      val = 0;
    }else{
      val = parseInt(val);
    }
    val += 1;
    $("#day"+need.day+"_"+get_timeslot_id(need.start,need.duration)).val(val);
  }
}
function get_timeslot_id(start,duration){
  switch(start){
    case 3:
      return 0;
      break;
    case 7:
      if(duration == 12){
        return 3;
      }else if(duration==8){
        return 2;
      }else{
        return 1;
      }
      break;
    case 11:
      if(duration == 12){

      }else if(duration==8){
        return 5;
      }else{
        return 4;
      }
      break;
    case 15:
      if(duration == 12){

      }else if(duration==8){
        return 7;
      }else{
        return 6;
      }
      break;
    case 19:
      if(duration == 12){
        return 9;
      }else if(duration==8){

      }else{
        return 8;
      }
      break;
    case 23:
      return 10;
      break;
  }
}

function main(){
  dummyData();
  dummyNeeds();
  solve();
  make_calendar();
  $("#need").click();
  //console.log(calendar);
}
main();
