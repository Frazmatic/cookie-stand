'use strict';

function day(openTime, closeTime){
  let day = {};
  for(let i = openTime; i < closeTime; i++){
    day[i] = 0;
  }
  return day;
}

function Store(storeName, minHourlyCusts, maxHourlyCusts, avgSalesPerCust, openTime, closeTime){
  this.storeName = storeName;
  this.custs = {min: parseInt(minHourlyCusts), max: parseInt(maxHourlyCusts), avg: parseFloat(avgSalesPerCust)};
  this.times = {open: parseInt(openTime) , close: parseInt(closeTime)};
  this.dailyStaffing = day(this.times.open, this.times.close);
  this.dailySales = day(this.times.open, this.times.close);
  this.controlCurve = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];
}

Store.prototype.storesList =
[
  new Store('Seattle', 23, 65, 6.3, 6, 20),
  new Store('Tokyo', 3,24, 1.2, 6, 20),
  new Store('Dubai', 23, 65, 6.3, 6, 20),
  new Store('Paris', 20, 38, 2.3, 6, 20),
  new Store('Lima', 2, 16, 4.6, 6, 20)
];
Store.prototype.minStaffing = 2;
Store.prototype.maxCustomersPerStaff = 20;

Store.prototype.processDailyStaffing = function(){
  for (let hour in this.dailyStaffing){
    let customers = this.dailySales[hour].customers;
    let staffRequirement = customers/this.maxCustomersPerStaff;
    if (staffRequirement < this.minStaffing){
      this.dailyStaffing[hour] = this.minStaffing;
    }
    else {
      this.dailyStaffing[hour] = Math.ceil(staffRequirement);
    }
  }
};

Store.prototype.processDailySales = function(){
  for(let hour in this.dailySales){
    this.dailySales[hour] = {customers: 0, sales: 0};
    this.dailySales[hour].customers = Math.round((Math.random() * (this.custs.max - this.custs.min) + this.custs.min));
    let control = this.controlCurve[hour - this.times.open];
    if (control){
      this.dailySales[hour].sales = Math.round(this.dailySales[hour].customers * this.custs.avg * control);
    }
    else {
      this.dailySales[hour].sales = Math.round(this.dailySales[hour].customers * this.custs.avg);
    }
  }
  this.processDailyStaffing();
};

Store.prototype.sumDailySales = function(){
  let total = 0;
  for(let hour in this.dailySales){
    total += this.dailySales[hour].sales;
  }
  return total;
};

Store.processAllDailySales = function(){
  for(let store of Store.prototype.storesList){
    store.processDailySales();
  }
};

Store.addStore = function(store){
  store.processDailySales();
  Store.prototype.storesList.push(store);
};



function addStore(event)
{
  event.preventDefault();
  let storeName= event.target.storeName.value;
  let minCusts = event.target.minHourlyCustomers.value;
  let maxCusts = event.target.maxHourlyCustomers.value;
  if (parseInt(maxCusts) < parseInt(minCusts))
  {
    alert('Max customers must be greater than or equal to Min');
    return;
  }
  let avgSales = event.target.avgSalesPerCustomer.value;
  let openTime = event.target.openingTime.value;
  let closeTime =  event.target.closingTime.value;
  for (let store of Store.prototype.storesList)
  {
    if (store.storeName.toLowerCase() === storeName.toLowerCase())
    {
      store.storeName = storeName;
      store.custs.min = minCusts;
      store.custs.max = maxCusts;
      store.custs.avg = avgSales;
      store.times.open = openTime;
      store.times.close = closeTime;
      store.processDailySales();
      Table.updateTables();
      return;
    }
  }
  let newStore = new Store(storeName, minCusts, maxCusts, avgSales, openTime, closeTime);
  Store.addStore(newStore);
  Table.updateTables();
}

//Table Type
function Table(){
}

Table.getTimes = function(storesList){
  let minTime = 24;
  let maxTime = 0;
  for(let store of storesList){
    if (store.times.open < minTime){
      minTime = store.times.open;
    }
    if (store.times.close > maxTime){
      maxTime = store.times.close;
    }
  }
  return {start: minTime, stop: maxTime};
};

Table.buildHeader = function(storesList, type){
  let headerRow = document.createElement('tr');
  let cell = document.createElement('th');
  cell.textContent = 'Store Name';
  headerRow.appendChild(cell);

  let times = Table.getTimes(storesList);

  for (let time = times.start; time < times.stop; time++){
    cell = document.createElement('th');
    cell.textContent = Table.timeConvert(time);
    headerRow.appendChild(cell);
  }

  if (type === 'sales'){
    cell = document.createElement('th');
    cell.textContent = 'Daily Location Totals';
    headerRow.appendChild(cell);
    return headerRow;
  }
  else if (type === 'staffing'){
    return headerRow;
  }
};

Table.timeConvert = function(time){
  if (time < 12){
    return `${time}:00 am`;
  }
  else if (time === 12){
    return `${time}:00 pm`;
  }
  else {
    return `${time - 12}:00 pm`;
  }
};



Table.buildTables = function(storesList){
  let salesTable = document.createElement('table');
  let staffingTable =  Table.buildHeader('table');
  salesTable.appendChild(Table.buildHeader(storesList, 'sales'));
  staffingTable.appendChild(Table.buildHeader(storesList, 'staffing'));
  return {sales: salesTable, staffing: staffingTable};
};

Table.addFooter = function(table, type){

};

Table.updateTables = function(tablesObjectt){

};

//MAIN
Store.processAllDailySales();
console.log(Table.buildHeader(Store.prototype.storesList, 'sales'));
console.log(Table.buildHeader(Store.prototype.storesList, 'staffing'));
let storeForm = document.getElementById('newStoreForm');
storeForm.addEventListener('submit', addStore);


