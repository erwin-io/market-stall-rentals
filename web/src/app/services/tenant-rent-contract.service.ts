import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { TenantRentContract } from '../model/tenant-rent-contract.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class TenantRentContractService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string; type?: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: TenantRentContract[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContract.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('tenantRentContract')),
      catchError(this.handleError('tenantRentContract', []))
    );
  }

  getByCode(tenantRentContractCode: string): Observable<ApiResponse<TenantRentContract>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContract.getByCode + tenantRentContractCode)
    .pipe(
      tap(_ => this.log('tenantRentContract')),
      catchError(this.handleError('tenantRentContract', []))
    );
  }

  create(data: any): Observable<ApiResponse<TenantRentContract>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContract.create, data)
    .pipe(
      tap(_ => this.log('tenantRentContract')),
      catchError(this.handleError('tenantRentContract', []))
    );
  }

  createFromBooking(data: any): Observable<ApiResponse<TenantRentContract>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContract.createFromBooking, data)
    .pipe(
      tap(_ => this.log('tenantRentContract')),
      catchError(this.handleError('tenantRentContract', []))
    );
  }

  update(id: string, data: any): Observable<ApiResponse<TenantRentContract>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContract.update + id, data)
    .pipe(
      tap(_ => this.log('tenantRentContract')),
      catchError(this.handleError('tenantRentContract', []))
    );
  }

  updateStatus(id: string, data: any): Observable<ApiResponse<TenantRentContract>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContract.updateStatus + id, data)
    .pipe(
      tap(_ => this.log('tenantRentContract')),
      catchError(this.handleError('tenantRentContract', []))
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
