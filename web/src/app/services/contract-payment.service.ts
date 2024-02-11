import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap, catchError, of } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiResponse } from "../model/api-response.model";
import { ContractPayment } from "../model/contract-payment.model";
import { AppConfigService } from "./app-config.service";
import { IServices } from "./interface/iservices";

@Injectable({
  providedIn: 'root'
})
export class ContractPaymentService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params: {
    order: any;
    columnDef: { apiNotation?: string; filter: any; type?: any }[];
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: ContractPayment[]; total: number; requestingAccess: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.contractPayment.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('contractPayment')),
      catchError(this.handleError('contractPayment', []))
    );
  }

  getByCode(contractPaymentCode: string): Observable<ApiResponse<ContractPayment>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.contractPayment.getByCode + contractPaymentCode)
    .pipe(
      tap(_ => this.log('contractPayment')),
      catchError(this.handleError('contractPayment', []))
    );
  }

  create(data: any): Observable<ApiResponse<ContractPayment>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.contractPayment.create, data)
    .pipe(
      tap(_ => this.log('contractPayment')),
      catchError(this.handleError('contractPayment', []))
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
