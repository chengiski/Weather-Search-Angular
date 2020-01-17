import { Component, OnInit } from '@angular/core';
import { SubmitService } from '../services/submit.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  shouldOpen = false;
  ifInvalid = false;
  fromresults = true;
  constructor(
    private submitService: SubmitService
  ) { }
  ngOnInit() {
    this.submitService.submitOpenCommand$
      .subscribe(() =>{
        this.ifInvalid = false;
        this.shouldOpen = true;
        this.delay(1500);
    });
    this.submitService.invalidInput$
      .subscribe(() =>{
        this.ifInvalid = true;
    });
    this.submitService.openFavorites$
      .subscribe(() =>{
        this.fromresults = false;
    });
    this.submitService.closeFavorites$
    .subscribe(() =>{
      this.fromresults = true;
  });
    this.submitService.clearTabs$
    .subscribe(() =>{
      this.ifInvalid = false;
    });
  }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>{this.shouldOpen = false;});
  }
  
}
