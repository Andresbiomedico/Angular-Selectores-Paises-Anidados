import { HttpClient } from '@angular/common/http';
import { IfStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
import { Region, SearchResponse, SmallCountry } from '../interfaces/country.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private baseUrl: string = 'https://restcountries.com/v3.1'
  private _regions: Region[] = [Region.Asia, Region.Europe, Region.Africa, Region.Oceania]
  constructor(
    private http: HttpClient
  ) { }

  get regions(): Region[] {
    return [...this._regions]
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if (!region) return of([])
    const url: string = `${this.baseUrl}/region/${region}/?fields=cca3,name,borders`;
    return this.http.get<SearchResponse[]>(url)
      .pipe(
        map(countries => countries.map(countrie => ({
          name: countrie.name.common,
          cca3: countrie.cca3,
          borders: countrie.borders ?? [],
        }))),
        tap((resp) => console.log(resp))
      );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry> {
    const url = `${this.baseUrl}/alpha/${alphaCode}/?fields=cca3,name,borders`
    return this.http.get<SearchResponse>(url)
      .pipe(
        map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? [],
        }))
      )
  }

  getCountryBordersByCodes(borders: string[]): Observable<SmallCountry []> {
    if (!borders || borders.length === 0) return of([])
    const countriesRequests: Observable<SmallCountry>[] =[]

    borders.forEach(code =>{
      const request = this.getCountryByAlphaCode(code);
      countriesRequests.push(request);
    })

    return combineLatest(countriesRequests);
  }
}
