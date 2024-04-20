/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { Users } from '../model/users';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params: {
    order: any;
    columnDef: { apiNotation: string; filter: string }[];
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: Users[]; total: number; requestingAccess: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  getByCode(userCode: string): Observable<ApiResponse<Users>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.getByCode + userCode)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  create(data: any): Observable<ApiResponse<Users>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.create, data)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  updateProfile(userCode: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.updateProfile + userCode, data)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  resetUserPassword(userCode: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.resetUserPassword + userCode + '/resetPassword', data)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  updateProfilePicture(userCode: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.updateProfilePicture + userCode, data)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  delete(userCode: string): Observable<ApiResponse<Users>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.delete + userCode)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
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
