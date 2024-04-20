/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

  getByAdvanceSearch(params: {
    order: any;
    columnDef: { apiNotation: string; filter: string }[];
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: TenantRentContract[]; total: number; requestingAccess: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContracts.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('tenantRentContracts')),
      catchError(this.handleError('tenantRentContracts', []))
    );
  }

  getByCode(tenantRentContractCode: string): Observable<ApiResponse<TenantRentContract>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContracts.getByCode + tenantRentContractCode)
    .pipe(
      tap(_ => this.log('tenantRentContracts')),
      catchError(this.handleError('tenantRentContracts', []))
    );
  }
  getAllByTenantUserCode(tenantUserCode): Observable<ApiResponse<TenantRentContract[]>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContracts.getAllByTenantUserCode + tenantUserCode)
    .pipe(
      tap(_ => this.log('message')),
      catchError(this.handleError('message', []))
    );
  }
  getAllByCollectorUserCode(params): Observable<ApiResponse<TenantRentContract[]>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.tenantRentContracts.getAllByCollectorUserCode,
      {params})
    .pipe(
      tap(_ => this.log('message')),
      catchError(this.handleError('message', []))
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
