import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { Stalls } from '../model/stalls.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class StallService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string; type?: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: Stalls[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stall.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('stall')),
      catchError(this.handleError('stall', []))
    );
  }

  getById(stallId: string): Observable<ApiResponse<Stalls>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stall.getById + stallId)
    .pipe(
      tap(_ => this.log('stall')),
      catchError(this.handleError('stall', []))
    );
  }

  getByCode(stallCode: string): Observable<ApiResponse<Stalls>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stall.getByCode + stallCode)
    .pipe(
      tap(_ => this.log('stall')),
      catchError(this.handleError('stall', []))
    );
  }

  create(data: any): Observable<ApiResponse<Stalls>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stall.create, data)
    .pipe(
      tap(_ => this.log('stall')),
      catchError(this.handleError('stall', []))
    );
  }

  update(id: string, data: any): Observable<ApiResponse<Stalls>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stall.update + id, data)
    .pipe(
      tap(_ => this.log('stall')),
      catchError(this.handleError('stall', []))
    );
  }

  delete(id: string): Observable<ApiResponse<Stalls>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stall.delete + id)
    .pipe(
      tap(_ => this.log('stall')),
      catchError(this.handleError('stall', []))
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
