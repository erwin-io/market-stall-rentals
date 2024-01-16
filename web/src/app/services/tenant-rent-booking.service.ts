import { Injectable } from '@angular/core';
import { IServices } from './interface/iservices';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { TenantRentBooking } from '../model/tenant-rent-booking.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class TenantRentBookingService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string; type?: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: TenantRentBooking[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentBooking.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('tenantRentBooking')),
      catchError(this.handleError('tenantRentBooking', []))
    );
  }

  getByCode(tenantRentBookingCode: string): Observable<ApiResponse<TenantRentBooking>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentBooking.getByCode + tenantRentBookingCode)
    .pipe(
      tap(_ => this.log('tenantRentBooking')),
      catchError(this.handleError('tenantRentBooking', []))
    );
  }

  create(data: any): Observable<ApiResponse<TenantRentBooking>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentBooking.create, data)
    .pipe(
      tap(_ => this.log('tenantRentBooking')),
      catchError(this.handleError('tenantRentBooking', []))
    );
  }

  update(id: string, data: any): Observable<ApiResponse<TenantRentBooking>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentBooking.update + id, data)
    .pipe(
      tap(_ => this.log('tenantRentBooking')),
      catchError(this.handleError('tenantRentBooking', []))
    );
  }

  delete(id: string): Observable<ApiResponse<TenantRentBooking>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentBooking.delete + id)
    .pipe(
      tap(_ => this.log('tenantRentBooking')),
      catchError(this.handleError('tenantRentBooking', []))
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
