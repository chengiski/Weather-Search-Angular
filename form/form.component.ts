import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { SubmitService } from '../services/submit.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  constructor(
    private submitService: SubmitService
  ) { }
  ngOnInit(){
    this.submitService.favoriteCitySearch$
        .subscribe(cityAndState =>{
        this.searchFromFavorite(cityAndState); 
    });
  }
  @ViewChild("checkbox", {static: false})checkbox: ElementRef;
  @ViewChild("results", {static: false})results: ElementRef;
  @ViewChild("favorites", {static: false})favorites: ElementRef;
  states = [
    {
        name: 'Select State',
        abbrev: ''
    },
    {
        name: 'Alabama',
        abbrev: 'AL'
    },
    {
        name: 'Alaska',
        abbrev: 'AK'
    },
    {
        name: 'Arizona',
        abbrev: 'AZ'
    },
    {
        name: 'Arkansas',
        abbrev: 'AR'
    },
    {
        name: 'California',
        abbrev: 'CA'
    },
    {
        name: 'Colorado',
        abbrev: 'CO'
    },
    {
        name: 'Connecticut',
        abbrev: 'CT'
    },
    {
        name: 'Delaware',
        abbrev: 'DE'
    },
    {
        name: 'District Of Columbia',
        abbrev: 'DC'
    },
    {
        name: 'Florida',
        abbrev: 'FL'
    },
    {
        name: 'Georgia',
        abbrev: 'GA'
    },
    {
        name: 'Hawaii',
        abbrev: 'HI'
    },
    {
        name: 'Idaho',
        abbrev: 'ID'
    },
    {
        name: 'Illinois',
        abbrev: 'IL'
    },
    {
        name: 'Indiana',
        abbrev: 'IN'
    },
    {
        name: 'Iowa',
        abbrev: 'IA'
    },
    {
        name: 'Kansas',
        abbrev: 'KS'
    },
    {
        name: 'Kentucky',
        abbrev: 'KY'
    },
    {
        name: 'Louisiana',
        abbrev: 'LA'
    },
    {
        name: 'Maine',
        abbrev: 'ME'
    },
    {
        name: 'Maryland',
        abbrev: 'MD'
    },
    {
        name: 'Massachusetts',
        abbrev: 'MA'
    },
    {
        name: 'Michigan',
        abbrev: 'MI'
    },
    {
        name: 'Minnesota',
        abbrev: 'MN'
    },
    {
        name: 'Mississippi',
        abbrev: 'MS'
    },
    {
        name: 'Missouri',
        abbrev: 'MO'
    },
    {
        name: 'Montana',
        abbrev: 'MT'
    },
    {
        name: 'Nebraska',
        abbrev: 'NE'
    },
    {
        name: 'Nevada',
        abbrev: 'NV'
    },
    {
        name: 'New Hampshire',
        abbrev: 'NH'
    },
    {
        name: 'New Jersey',
        abbrev: 'NJ'
    },
    {
        name: 'New Mexico',
        abbrev: 'NM'
    },
    {
        name: 'New York',
        abbrev: 'NY'
    },
    {
        name: 'North Carolina',
        abbrev: 'NC'
    },
    {
        name: 'North Dakota',
        abbrev: 'ND'
    },
    {
        name: 'Ohio',
        abbrev: 'OH'
    },
    {
        name: 'Oklahoma',
        abbrev: 'OK'
    },
    {
        name: 'Oregon',
        abbrev: 'OR'
    },
    {
        name: 'Pennsylvania',
        abbrev: 'PA'
    },
    {
        name: 'Rhode Island',
        abbrev: 'RI'
    },
    {
        name: 'South Carolina',
        abbrev: 'SC'
    },
    {
        name: 'South Dakota',
        abbrev: 'SD'
    },
    {
        name: 'Tennessee',
        abbrev: 'TN'
    },
    {
        name: 'Texas',
        abbrev: 'TX'
    },
    {
        name: 'Utah',
        abbrev: 'UT'
    },
    {
        name: 'Vermont',
        abbrev: 'VT'
    },
    {
        name: 'Virginia',
        abbrev: 'VA'
    },
    {
        name: 'Washington',
        abbrev: 'WA'
    },
    {
        name: 'West Virginia',
        abbrev: 'WV'
    },
    {
        name: 'Wisconsin',
        abbrev: 'WI'
    },
    {
        name: 'Wyoming',
        abbrev: 'WY'
    }
  ];
  address = {
    "street": '',
    "city": '',
    "state": this.states[0].abbrev,
    "currentLoc": false
  };
  ifInvalid = false;
  citycomplete = [];
  resultsClick(){
    this.results.nativeElement.style.color = "white";
    this.results.nativeElement.style.backgroundColor = "#6d90a9";
    this.favorites.nativeElement.style.color = "#838383";
    this.favorites.nativeElement.style.backgroundColor = "white";
    this.submitService.closeFavoritesCommand();
  }
  favoritesClick(){
    this.favorites.nativeElement.style.color = "white";
    this.favorites.nativeElement.style.backgroundColor = "#6d90a9";
    this.results.nativeElement.style.color = "#838383";
    this.results.nativeElement.style.backgroundColor = "white";
    this.submitService.openFavoritesCommand();
  }
  autocomplete(){
    var xmlhttp = new XMLHttpRequest();
    var cityfromkey = "City="+this.address.city;
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                    var jsonObj = JSON.parse(xmlhttp.responseText);
                    cityComplete(jsonObj);
                    return jsonObj;
            }
            else if (xmlhttp.status == 400) {
                console.log('There was an error 400: autocomplete');
            }
            else {
                console.log('something else other than 200 was returned: autocomplete');
            }
        }
    }
    var url = "/autocomplete?"+cityfromkey;
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
    var cityComplete = (jsonObj) => {
        for(let i = 0; i < jsonObj.predictions.length; i++){
            this.citycomplete[i]=jsonObj.predictions[i].structured_formatting.main_text;
        }
    } 
  }

  clear(){
    this.address.street="";
    this.address.city="";
    this.address.state="";
    this.address.currentLoc=false;
    this.resultsClick();
    this.submitService.sendClearCommand();
  }
  search(){
    this.resultsClick();
    var mySubmitService = this.submitService;
    var xmlhttp = new XMLHttpRequest();
    //If choose current location.
    if (this.checkbox.nativeElement.checked){
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                        var jsonObj = JSON.parse(xmlhttp.responseText);
                        afterLatLng(jsonObj.latitude, jsonObj.longitude);
                        stateSeal(jsonObj.region_code);
                        sendCity(jsonObj.city);
                        return jsonObj;
                }
                else if (xmlhttp.status == 400) {
                    alert('There was an error 400: currentLoc');
                }
                else {
                    alert('something else other than 200 was returned: currentLoc');
                }
            }
        }
        var url = "https://ipapi.co/json";
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        function afterLatLng(lat, lon){
            var location = "Lat="+lat+"&Lon="+lon;
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                            var jsonObj = JSON.parse(xmlhttp.responseText);
                            ifChangeCurrent(jsonObj);
                            return jsonObj;
                    }
                    else if (xmlhttp.status == 400) {
                        alert('There was an error 400: afterLatLng');
                    }
                    else {
                        alert('something else other than 200 was returned: afterLatLng');
                    }
                }
            }
            var url = "/currweather?"+location;
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
        //send the motion (click the search button) to subscribers.
        this.submitService.sendOpenCommand();
        //send current location city.
        function sendCity(city){
            mySubmitService.sendCity(city);
        }
        //send jsonObj to subscribers: current location
        function ifChangeCurrent(jsonObj){
            mySubmitService.sendJson(jsonObj);
        }
    }
    //If user input.
    else{
        var address = "street="+this.address.street+"&city="+ this.address.city+"&state="+this.address.state;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                        var jsonObj = JSON.parse(xmlhttp.responseText);
                        ifChange(jsonObj);
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
        var url = "/weather?"+address;
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    var cityinput = this.address.city;
    var stateinput = this.address.state;
    //send jsonObj to subscribers: from input
    function ifChange(jsonObj){
        if (jsonObj == null || JSON.stringify(jsonObj) == JSON.stringify({ifError:'error'})){
            //send the motion (click the search button) to subscribers.
            mySubmitService.sendInvalidInfo();
        }
        else{
        //send the motion (click the search button) to subscribers.
        mySubmitService.sendOpenCommand();
        //Call function to send state.
        stateSeal(stateinput);
        //send the input city.
        mySubmitService.sendCity(cityinput);
        //send jsonObj
        mySubmitService.sendJson(jsonObj);
        }
    }

    //Send the state(from currentloc or input) to get state seal.
    function stateSeal(state){
        mySubmitService.sendState(state);
        var xmlhttp = new XMLHttpRequest();
        var State = "State="+state;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                        var jsonObj = JSON.parse(xmlhttp.responseText);
                        sendStateURL(jsonObj.items[0].link)
                        return jsonObj;
                }
                else if (xmlhttp.status == 400) {
                    alert('There was an error 400: stateSeal');
                }
                else {
                    alert('something else other than 200 was returned: stateSeal');
                }
            }
        }
        var url = "/stateseal?"+State;
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        //send State Seal URL and state
        function sendStateURL(url){
            mySubmitService.sendStateSeal(url);
        }
    }   
  }
  //click the city from favorites will call this function
  searchFromFavorite(cityAndState){
    var city = cityAndState.city;
    var state = cityAndState.state;
    var mySubmitService = this.submitService;
    var xmlhttp = new XMLHttpRequest();
    var address = "street="+""+"&city="+city+"&state="+state;
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                    var jsonObj = JSON.parse(xmlhttp.responseText);
                    ifChange(jsonObj);
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
    var url = "/weather?"+address;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    //send jsonObj to subscribers: from favorite
    function ifChange(jsonObj){
        //Call function to send state.
        stateSeal(state);
        //send the favorite city.
        mySubmitService.sendCity(city);
        //send jsonObj
        mySubmitService.sendJson(jsonObj);
    }

    //Send the state(from favorite) to get state seal.
    function stateSeal(state){
        mySubmitService.sendState(state);
        var xmlhttp = new XMLHttpRequest();
        var State = "State="+state;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                        var jsonObj = JSON.parse(xmlhttp.responseText);
                        sendStateURL(jsonObj.items[0].link)
                        return jsonObj;
                }
                else if (xmlhttp.status == 400) {
                    alert('There was an error 400: stateSeal');
                }
                else {
                    alert('something else other than 200 was returned: stateSeal');
                }
            }
        }
        var url = "/stateseal?"+State;
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        //send State Seal URL and state
        function sendStateURL(url){
            mySubmitService.sendStateSeal(url);
        }
    } 
    this.resultsClick();
    //send the motion (click the search button) to subscribers.
    mySubmitService.sendOpenCommand();
  }

}
