import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { Stalls } from '../model/stalls.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class StallsService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params: {
    order: any;
    columnDef: { apiNotation: string; filter: string }[];
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: Stalls[]; total: number; requestingAccess: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stalls.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('stalls')),
      catchError(this.handleError('stalls', []))
    );
  }

  getAllByTenantUserCode(tenantUserCode: string): Observable<ApiResponse<Stalls[]>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stalls.getAllByTenantUserCode + tenantUserCode)
    .pipe(
      tap(_ => this.log('stalls')),
      catchError(this.handleError('stalls', []))
    );
  }

  getByCode(stallCode: string): Observable<ApiResponse<Stalls>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stalls.getByCode + stallCode)
    .pipe(
      tap(_ => this.log('stalls')),
      catchError(this.handleError('stalls', []))
    );
  }

  create(data: any): Observable<ApiResponse<Stalls>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stalls.create, data)
    .pipe(
      tap(_ => this.log('stalls')),
      catchError(this.handleError('stalls', []))
    );
  }

  update(id: string, data: any): Observable<ApiResponse<Stalls>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stalls.update + id, data)
    .pipe(
      tap(_ => this.log('stalls')),
      catchError(this.handleError('stalls', []))
    );
  }

  delete(stallCode: string): Observable<ApiResponse<Stalls>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.stalls.delete + stallCode)
    .pipe(
      tap(_ => this.log('stalls')),
      catchError(this.handleError('stalls', []))
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
