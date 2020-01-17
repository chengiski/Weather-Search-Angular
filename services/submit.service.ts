import { Injectable } from '@angular/core'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmitService {
  private submitJsonSource = new Subject<Object>();
  private submitOpenCommand = new Subject<boolean>();
  private submitSendCity = new Subject<string>();
  private submiteStateSeal = new Subject<string>();
  private submiteState = new Subject<string>();
  private invalidInput = new Subject<boolean>();
  private clearTabs = new Subject<boolean>();
  private openFavorites = new Subject<boolean>();
  private closeFavorites = new Subject<boolean>();
  private favoriteCitySearch = new Subject<Object>();
  private openModal = new Subject<Object>();

  private sendCitytoModal = new Subject<string>();
  private sendDatetoModal = new Subject<string>();

  submitJsonSource$ = this.submitJsonSource.asObservable();
  submitOpenCommand$ = this.submitOpenCommand.asObservable();
  submitSendCity$ = this.submitSendCity.asObservable();
  submiteStateSeal$ = this.submiteStateSeal.asObservable();
  submiteState$ = this.submiteState.asObservable();
  invalidInput$ = this.invalidInput.asObservable();
  clearTabs$ = this.clearTabs.asObservable();
  openFavorites$ = this.openFavorites.asObservable();
  closeFavorites$ = this.closeFavorites.asObservable();
  favoriteCitySearch$ = this.favoriteCitySearch.asObservable();
  openModal$ = this.openModal.asObservable();

  sendCitytoModal$ = this.sendCitytoModal.asObservable();
  sendDatetoModal$ = this.sendDatetoModal.asObservable();

  constructor() { }

  sendJson(jsonObj: Object) {
    this.submitJsonSource.next(jsonObj);
  }
  sendOpenCommand(){
    this.submitOpenCommand.next();
  }
  sendCity(city: string){
    this.submitSendCity.next(city);
  }
  sendStateSeal(url: string){
    this.submiteStateSeal.next(url);
  }
  sendState(state: string){
    this.submiteState.next(state);
  }
  sendInvalidInfo(){
    this.invalidInput.next();
  }
  sendClearCommand(){
    this.clearTabs.next();
  }
  openFavoritesCommand(){
    this.openFavorites.next();
  }
  closeFavoritesCommand(){
    this.closeFavorites.next();
  }
  searchFavoriteCity(cityAndState: Object){
    this.favoriteCitySearch.next(cityAndState);
    console.log(cityAndState);
  }
  openModalCommand(modalJson: Object){
    this.openModal.next(modalJson);
  }
  sendModalCity(city: string){
    this.sendCitytoModal.next(city);
  }
  sendModalDate(date: string){
    this.sendDatetoModal.next(date);
  }
  
}
