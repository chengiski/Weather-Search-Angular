import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { SubmitService } from '../services/submit.service';
import * as Chart from '../../../node_modules/chart.js/dist/Chart.min.js';
import * as CanvasJS from '../../../node_modules/canvasjs/dist/canvasjs.min.js';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  jsonObj;
  detail = {
    "state": '',
    "city": '',
    "timezone": '',
    "tempnoround": '',
    "temp": '',
    "summary": '',
    "humidity": '',
    "pressure": '',
    "windspeed": '',
    "visibility": '',
    "cloudcover": '',
    "ozone": '',
    "sealLink": ''
  };
  shouldOpen = false;
  isValid = true;
  favorite = false;
  favorOpen = false;
  fromresults = true;
  hasrecord = false;
  hourlys = [
    {name:'Temperature', value:'temp'},
    {name:'Pressure', value:'pressure'},
    {name:'Humidity', value:'humid'},
    {name:'Ozone', value:'ozone'},
    {name:'Visibility', value:'visib'},
    {name:'Wind Speed', value:'wspeed'}
  ];
  constructor(
    private submitService: SubmitService,
  ) { }
  ngOnInit() {
    this.submitService.submitJsonSource$
      .subscribe(jsonObj =>{
        this.jsonObj = jsonObj;
        this.detailInfo(jsonObj);
        this.hourlyInfo(jsonObj);
        this.weeklyInfo(jsonObj);
        this.checkIfFavorite();
    });
    this.submitService.submitOpenCommand$
      .subscribe(() =>{
        this.shouldOpen = false;
        this.delay(1500);
    });
    this.submitService.submitSendCity$
      .subscribe(city =>{
        this.detail.city = city;
    });
    this.submitService.submiteStateSeal$
      .subscribe(url =>{
        this.detail.sealLink = url;
    });
    this.submitService.submiteState$
    .subscribe(state =>{
      this.detail.state = state;
    });
    this.submitService.invalidInput$
      .subscribe(() =>{
        this.shouldOpen = false;
    });
    this.submitService.clearTabs$
    .subscribe(() =>{
      this.shouldOpen = false;
    });
    this.submitService.openFavorites$
    .subscribe(() =>{
      this.ifHasRecords();
      this.fromresults = false;
      this.favorOpen = true;
    });
    this.submitService.closeFavorites$
    .subscribe(() =>{
      this.checkIfFavorite();
      this.fromresults = true;
      this.favorOpen = false;
    });
  }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>{this.shouldOpen = true;});
  }
  favoriteCitys = [];
  ifFavorite(){
    this.favorite = true;
    var keyValue = this.detail.state+this.detail.city;
    var value = {state: this.detail.state, city: this.detail.city, stateseal: this.detail.sealLink}
    localStorage.setItem(keyValue, JSON.stringify(value));
  }
  unfavorite(){
    this.favorite = false;
    var keyValue = this.detail.state+this.detail.city;
    localStorage.removeItem(keyValue);
  }
  ifHasRecords(){
    if (localStorage.length != 0){
      this.hasrecord = true;
      this.iteratorRecords();
    }
    else{
      this.hasrecord = false;
    }
  }
  iteratorRecords(){
    this.favoriteCitys = [];
    var parsed;
    for (let i=0; i < localStorage.length; i++){
      parsed = JSON.parse(localStorage.getItem(localStorage.key(i)));
      var eachCity = {
        stateF: parsed.state,
        cityF: parsed.city,
        statesealF: parsed.stateseal
      };
      this.favoriteCitys.push(eachCity);
    }
  }
  deleteFavorite(city, state){
    var keyValue = state+city;
    localStorage.removeItem(keyValue);
    this.ifHasRecords();
  }
  checkIfFavorite(){
    var keyValue = this.detail.state+this.detail.city;
    if(localStorage.getItem(keyValue) == null){
      this.favorite = false;
    }
    else{
      this.favorite = true;
    }
  }
  searchFavor(city, state){
    var cityAndState = {
      city: city,
      state: state
    };
    this.submitService.searchFavoriteCity(cityAndState);
  }
  detailInfo(jsonObj){
    this.detail.timezone= jsonObj.timezone;
    this.detail.tempnoround = jsonObj.currently.temperature;
    this.detail.temp = Math.round(jsonObj.currently.temperature).toString();
    this.detail.summary= jsonObj.currently.summary;
    this.detail.humidity= jsonObj.currently.humidity;
    this.detail.pressure= jsonObj.currently.pressure;
    this.detail.windspeed= jsonObj.currently.windSpeed;
    this.detail.visibility= jsonObj.currently.visibility;
    this.detail.cloudcover= jsonObj.currently.cloudCover;
    this.detail.ozone= jsonObj.currently.ozone;
  }
  selectedHourly = "";
  chart : Chart;
  labels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  backgroundColor = [];
  temp = [];
  press = [];
  humid = [];
  ozone = [];
  visib = [];
  wspeed = [];
  hourlyInfo(jsonObj){
    for (let i = 0; i < 24; i++){
      this.temp[i]=jsonObj.hourly.data[i].temperature;
      this.press[i]=jsonObj.hourly.data[i].pressure;
      this.humid[i]=jsonObj.hourly.data[i].humidity*100;
      this.ozone[i]=jsonObj.hourly.data[i].ozone;
      this.visib[i]=jsonObj.hourly.data[i].visibility;
      this.wspeed[i]=jsonObj.hourly.data[i].windSpeed;
      this.backgroundColor[i]='#a4cfed';
    }
  }
  //If we choose Hourly from the tabs, then selectedHourly will be set as temp and draw chart after 1ms.
  chooseHourly(){
    if (this.chart) {
      this.chart.destroy();
    }
    this.selectedHourly = this.hourlys[0].value;
    setTimeout(()=>{this.drawChartTemp()},2);
  }

  //Hourly temperature
  drawChartTemp(){
    var tick = Math.ceil((Math.max.apply(this, this.temp)-Math.min.apply(this, this.temp))/8);
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      //data
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "temperature",
            backgroundColor: this.backgroundColor,
            data: this.temp
          }
        ]
      },
      //options
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              labelString: 'Time difference from current hour',
              display: true,
              fontSize: 15
            },
            ticks:{}
          }],
          yAxes: [{
            scaleLabel: {
              labelString: 'Fahrenheit',
              display: true,
              fontSize: 15
            },
            ticks:{
              min: Math.floor(Math.min.apply(this, this.temp)/tick)*tick-tick,
              max: Math.ceil(Math.max.apply(this, this.temp)/tick)*tick+tick,
              stepSize: tick
            }
          }]
        },
        legend: {
          onClick: (e)=>e.stopPropagation()
        }
      }
  })
}
  //Hourly pressure
  drawChartPress(){
    var tick = Math.ceil((Math.max.apply(this, this.press)-Math.min.apply(this, this.press))/8);
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "pressure",
            backgroundColor: this.backgroundColor,
            data: this.press
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              labelString: 'Time difference from current hour',
              display: true,
              fontSize: 15
            },
            ticks:{}
          }],
          yAxes: [{
            scaleLabel: {
              labelString: 'Millibars',
              display: true,
              fontSize: 15
            },
            ticks:{
              min: Math.floor(Math.min.apply(this, this.press)/tick)*tick-tick,
              max: Math.ceil(Math.max.apply(this, this.press)/tick)*tick+tick,
              stepSize: tick
            }
          }]
        },
        legend: {
          onClick: (e)=>e.stopPropagation()
        }
      }
    })
  }
  //Hourly humidity
  drawChartHumid(){
    var tick = Math.ceil((Math.max.apply(this, this.humid)-Math.min.apply(this, this.humid))/8);
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "humidity",
            backgroundColor: this.backgroundColor,
            data: this.humid
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              labelString: 'Time difference from current hour',
              display: true,
              fontSize: 15
            },
            ticks:{}
          }],
          yAxes: [{
            scaleLabel: {
              labelString: '% Humidity',
              display: true,
              fontSize: 15
            },
            ticks:{
              min: Math.floor(Math.min.apply(this, this.humid)/tick)*tick-tick,
              max: Math.ceil(Math.max.apply(this, this.humid)/tick)*tick+tick,
              stepSize: tick
            }
          }]
        },
        legend: {
          onClick: (e)=>e.stopPropagation()
        }
      }
    })
  }
  //Hourly ozone
  drawChartOzone(){
    var tick = Math.ceil((Math.max.apply(this, this.ozone)-Math.min.apply(this, this.ozone))/8);
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "ozone",
            backgroundColor: this.backgroundColor,
            data: this.ozone
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              labelString: 'Time difference from current hour',
              display: true,
              fontSize: 15
            },
            ticks:{}
          }],
          yAxes: [{
            scaleLabel: {
              labelString: 'Dobson Units',
              display: true,
              fontSize: 15
            },
            ticks:{
              min: Math.floor(Math.min.apply(this, this.ozone)/tick)*tick-tick,
              max: Math.ceil(Math.max.apply(this, this.ozone)/tick)*tick+tick,
              stepSize: tick
            }
          }]
        },
        legend: {
          onClick: (e)=>e.stopPropagation()
        }
      }
    })
  }
  //Hourly visibility
  drawChartVisib(){
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "visibility",
            backgroundColor: this.backgroundColor,
            data: this.visib
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              labelString: 'Time difference from current hour',
              display: true,
              fontSize: 15
            },
            ticks:{}
          }],
          yAxes: [{
            scaleLabel: {
              labelString: 'Miles (Maximum 10)',
              display: true,
              fontSize: 15
            },
            ticks:{
              min: Math.floor(Math.min.apply(this, this.visib)/2),
              max: Math.ceil(Math.max.apply(this, this.visib))+1,
              stepSize: 1
            }
          }]
        },
        legend: {
          onClick: (e)=>e.stopPropagation()
        }
      }
    })
  }
  //Hourly wind speed
  drawCharWspeed(){
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "windSpeed",
            backgroundColor: this.backgroundColor,
            data: this.wspeed
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              labelString: 'Time difference from current hour',
              display: true,
              fontSize: 15
            },
            ticks:{}
          }],
          yAxes: [{
            scaleLabel: {
              labelString: 'Miles per Hour',
              display: true,
              fontSize: 15
            },
            ticks:{
              min: Math.floor(Math.min.apply(this, this.wspeed)/2),
              max: Math.ceil(Math.max.apply(this, this.wspeed))+1,
              stepSize: 1
            }
          }]
        },
        legend: {
          onClick: (e)=>e.stopPropagation()
        }
      }
    })
  }
  weeklydata = [];
  weeklyInfo(jsonObj){
    var day;
    var month;
    var year;
    var time;
     for (let i = 7; i >= 0; i--){
      time = new Date(jsonObj.daily.data[i].time*1000);
      day = time.getDate();
      month = time.getMonth()+1;
      year = time.getFullYear();
      this.weeklydata[7-i]={name:[jsonObj.daily.data[i].time],y:[jsonObj.daily.data[i].temperatureLow,jsonObj.daily.data[i].temperatureHigh],label:day+"/"+month+"/"+year};
     }
  }
  ifSelected(){
    if (this.selectedHourly == "temp"){
      this.drawChartTemp();
    }
    else if (this.selectedHourly == "pressure"){
      this.drawChartPress();
    }
    else if (this.selectedHourly == "humid"){
      this.drawChartHumid();
    }
    else if (this.selectedHourly == "ozone"){
      this.drawChartOzone();
    }
    else if (this.selectedHourly == "visib"){
      this.drawChartVisib();
    }
    else if (this.selectedHourly == "wspeed"){
      this.drawCharWspeed();
    }
  }

  chooseWeekly(){
    setTimeout(()=>{
      this.chooseWeeklyAgain();
    },1);
  }

  chooseWeeklyAgain(){
    var city = this.detail.city;
    var jsonObj = this.jsonObj;
    CanvasJS.addColorSet("custom",["#a5d0ee"]);
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      dataPointWidth: 20,
      colorSet: "custom",
      title: {
        text: "Weekly Weather",
        margin: 25
      },
      axisX: {
        title: "Days"
      },
      axisY: {
        includeZero: false,
        title: "Temperature in Fahrenheit",
        interval: 10,
        gridThickness: 0
      },
      legend: {
        verticalAlign: "top"
      }, 
      data: [{
        type: "rangeBar",
        showInLegend: true,
        yValueFormatString: "#",
        indexLabel: "{y[#index]}",
        legendText: "Day wise temperature range",
        toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
        dataPoints: this.weeklydata,
        click :function(data){
          weeklydetail(parseInt(data.dataPoint.name),data.dataPoint.label,city);
        }
      }]
    });
    chart.render();

    function weeklydetail(time,date,city){
      var xmlhttp = new XMLHttpRequest();
      var locAndTime = "Lat="+jsonObj.latitude+"&Lon="+ jsonObj.longitude+"&Time="+time;
      xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == XMLHttpRequest.DONE) {
              if (xmlhttp.status == 200) {
                      var jsonObj = JSON.parse(xmlhttp.responseText);
                      open(jsonObj, date, city);
                      return jsonObj;
              }
              else if (xmlhttp.status == 400) {
                  alert('There was an error 400: input');
              }
              else {
                  alert('something else other than 200 was returned: input');
              }
          }
      }
      var url = "/weeklydetail?"+locAndTime;
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    }
    var mySubmitService = this.submitService;
    function open(jsonObj, date, city){
      mySubmitService.openModalCommand(jsonObj);
      mySubmitService.sendModalDate(date);
      mySubmitService.sendModalCity(city);
    }

  }

  



}
