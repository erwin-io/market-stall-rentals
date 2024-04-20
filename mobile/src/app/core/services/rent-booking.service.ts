/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { TenantRentBooking } from '../model/tenant-rent-booking.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class RentBookingService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params: {
    order: any;
    columnDef: { apiNotation: string; filter: any; type: string}[];
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: TenantRentBooking[]; total: number; requestingAccess: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.rentBooking.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('rentBooking')),
      catchError(this.handleError('rentBooking', []))
    );
  }

  getByCode(rentBookingCode: string): Observable<ApiResponse<TenantRentBooking>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.rentBooking.getByCode + rentBookingCode)
    .pipe(
      tap(_ => this.log('rentBooking')),
      catchError(this.handleError('rentBooking', []))
    );
  }

  create(data: any): Observable<ApiResponse<TenantRentBooking>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.rentBooking.create, data)
    .pipe(
      tap(_ => this.log('rentBooking')),
      catchError(this.handleError('rentBooking', []))
    );
  }

  cancel(rentBookingCode: string, data: any): Observable<ApiResponse<TenantRentBooking>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.rentBooking.updateStatus + rentBookingCode, data)
    .pipe(
      tap(_ => this.log('rentBooking')),
      catchError(this.handleError('rentBooking', []))
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
