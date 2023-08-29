import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs';
import { __values } from 'tslib';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
})
export class SelectorPagesComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = []
  public borders: SmallCountry[] = []
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }
  ngOnInit(): void {
    this.onRegionChance()
    this.OnCountryChanged()
  }

  get regions(): Region[] {
    return this.countriesService.regions
  }

  onRegionChance(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')?.setValue('')),
        tap(() => this.borders = []),
        switchMap((region: Region) => this.countriesService.getCountriesByRegion(region))
      )
      .subscribe((countries) => {
        this.countriesByRegion = countries
      })
  }

  OnCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')?.setValue('')),
        filter((value: string) => value.length > 0),
        switchMap((alphacode) => this.countriesService.getCountryByAlphaCode(alphacode)),
        switchMap((country) => this.countriesService.getCountryBordersByCodes(country.borders))
      )
      .subscribe((countries) => {
        this.borders = countries
      })
  }
}

