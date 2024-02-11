import { TenantRentContract } from 'src/app/model/tenant-rent-contract.model';
import { getBill } from './bill';
export const getContract = (c: TenantRentContract) => {

  let startDate = new Date(c.currentDueDate);
  if(c.stallRateCode === 'MONTHLY') {
    startDate = new Date(startDate.setDate(startDate.getMonth()));
  } else if(c.stallRateCode === 'WEEKLY') {
    startDate = new Date(startDate.setDate(startDate.getDate()));
  } else {
    startDate = new Date(startDate.setDate(startDate.getDate()));
  }
  const { overdueMonths, overdueWeeks, overdueDays, overdueCharge } = getBill(Number(c.totalRentAmount), startDate, c.stallRateCode);
  let dueAmount: any = c.totalRentAmount;
  if(c.stallRateCode === 'MONTHLY') {
    dueAmount = overdueMonths > 1 ? (Number(dueAmount) * Number(overdueMonths)) : dueAmount;
  } else if(c.stallRateCode === 'WEEKLY') {
    dueAmount = overdueWeeks > 1 ? (Number(dueAmount) * Number(overdueWeeks)) : dueAmount;
  } else {
    dueAmount = overdueDays > 1 ? (Number(dueAmount) * Number(overdueDays)) : dueAmount;
  }
  const totalDueAmount: any = Number(dueAmount) + (Number(overdueCharge) > 0 ? Number(overdueCharge) : 0);
  // const totalDueAmount: any = Number(dueAmount) + Number(overdueCharge);
  return {
    ...c,
    ...{
      dueAmount,
      overdueMonths,
      overdueWeeks,
      overdueDays,
      overdueCharge,
      totalDueAmount

    }
  };
};
