import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubmitService } from '../services/submit.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @ViewChild("button", {static: false})button: ElementRef;
  information = {
    "date": '',
    "city": '',
    "temp": '',
    "sum": '',
    "precipitation": '',
    "chance": '',
    "windspeed": '',
    "humid": '',
    "visib": '',
    "iconURL": ''
  };
  constructor(
    private submitService: SubmitService,
    ) { }

  ngOnInit() {
    this.submitService.openModal$
      .subscribe(modalJson =>{
        this.button.nativeElement.click();
        this.modalInfo(modalJson);
    });
    this.submitService.sendCitytoModal$
      .subscribe(city =>{
        this.information.city = city;
    });
    this.submitService.sendDatetoModal$
      .subscribe(date =>{
        this.information.date = date;
    });
  }
  modalInfo(modalJson){
    this.information.temp = Math.round(modalJson.currently.temperature).toString(),
    this.information.sum = modalJson.currently.summary,

    this.information.precipitation = (Math.round(modalJson.currently.precipIntensity*100)/100).toString(),
    this.information.chance = (Math.round(modalJson.currently.precipProbability*10000)/100).toString(),
    this.information.windspeed = (Math.round(modalJson.currently.windSpeed*100)/100).toString(),
    this.information.humid = (Math.round(modalJson.currently.humidity*10000)/100).toString(),
    this.information.visib = (Math.round(modalJson.currently.visibility*100)/100).toString(),
    this.iconSwitch(modalJson.currently.icon);
  }
  iconSwitch(icon){
    var iconURL;
    switch(icon){
      case "clear-day":
      iconURL="https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
      break;
      case "clear-night":
      iconURL="https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
      break;
      case "rain":
      iconURL="https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
      break;
      case "snow":
      iconURL="https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
      break;
      case "sleet":
      iconURL="https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png";
      break;
      case "wind":
      iconURL="https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
      break;
      case "fog":
      iconURL="https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
      break;
      case "cloudy":
      iconURL="https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png";
      break;
      case "partly-cloudy-day":
      iconURL="https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
      break;
      case "partly-cloudy-night":
      iconURL="https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
      break;
      default:
      iconURL="";
    }
    this.information.iconURL = iconURL;
  }
  

}
