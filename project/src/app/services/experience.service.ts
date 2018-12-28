import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface IExperienceItem {
    title: string;
    company: string;
    location: string;
    timeframe: string;
    skills: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {

    private _experience_location = '../../assets/experiences.json'

    constructor(private http: HttpClient) { }

    getExperiences(): Observable<IExperienceItem[]> {
        return this.http.get<IExperienceItem[]>(this._experience_location)
    }
}
