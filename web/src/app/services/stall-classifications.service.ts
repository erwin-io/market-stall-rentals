import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { StallClassifications } from '../model/stall-classifications.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class StallClassificationsService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: StallClassifications[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassification.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('stallClassification')),
      catchError(this.handleError('stallClassification', []))
    );
  }

  getByCode(stallClassificationCode: string): Observable<ApiResponse<StallClassifications>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassification.getByCode + stallClassificationCode)
    .pipe(
      tap(_ => this.log('stallClassification')),
      catchError(this.handleError('stallClassification', []))
    );
  }

  create(data: any): Observable<ApiResponse<StallClassifications>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassification.create, data)
    .pipe(
      tap(_ => this.log('stallClassification')),
      catchError(this.handleError('stallClassification', []))
    );
  }

  update(stallClassificationCode: string, data: any): Observable<ApiResponse<StallClassifications>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassification.update + stallClassificationCode, data)
    .pipe(
      tap(_ => this.log('stallClassification')),
      catchError(this.handleError('stallClassification', []))
    );
  }

  delete(stallClassificationCode: string): Observable<ApiResponse<StallClassifications>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassification.delete + stallClassificationCode)
    .pipe(
      tap(_ => this.log('stallClassification')),
      catchError(this.handleError('stallClassification', []))
    );
  }

  handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }
  log(message: string) {
    console.log(message);
  }
}
