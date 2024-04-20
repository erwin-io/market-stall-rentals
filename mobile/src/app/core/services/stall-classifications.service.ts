import { Injectable } from '@angular/core';
import { StallClassifications } from '../model/stall-classifications.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class StallClassificationsService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params: {
    order: any;
    columnDef: { apiNotation: string; filter: string }[];
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: StallClassifications[]; total: number; requestingAccess: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassifications.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('stallClassifications')),
      catchError(this.handleError('stallClassifications', []))
    );
  }

  getAll(): Observable<ApiResponse<StallClassifications[]>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassifications.getAll)
    .pipe(
      tap(_ => this.log('stallClassifications')),
      catchError(this.handleError('stallClassifications', []))
    );
  }

  getByCode(stallCode: string): Observable<ApiResponse<StallClassifications>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassifications.getByCode + stallCode)
    .pipe(
      tap(_ => this.log('stallClassifications')),
      catchError(this.handleError('stallClassifications', []))
    );
  }

  create(data: any): Observable<ApiResponse<StallClassifications>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassifications.create, data)
    .pipe(
      tap(_ => this.log('stallClassifications')),
      catchError(this.handleError('stallClassifications', []))
    );
  }

  update(id: string, data: any): Observable<ApiResponse<StallClassifications>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassifications.update + id, data)
    .pipe(
      tap(_ => this.log('stallClassifications')),
      catchError(this.handleError('stallClassifications', []))
    );
  }

  delete(stallCode: string): Observable<ApiResponse<StallClassifications>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stallClassifications.delete + stallCode)
    .pipe(
      tap(_ => this.log('stallClassifications')),
      catchError(this.handleError('stallClassifications', []))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }

  log(message: string) {
    console.log(message);
  }
}
