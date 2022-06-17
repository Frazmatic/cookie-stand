'use strict';
//This time, I tried to keep all the 'data' stuff in Store and all the 'display' stuff in Table

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
  //this could have been of format {hour: {customers: 0; sales: 0; staffing: 0}}
  //didn't think of it until almost done
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

Store.sumHour = function(hour, type){
  let storesList = Store.prototype.storesList;
  let sum = 0;
  for (let store of storesList){
    if(type === 'sales'){
      if(store.dailySales[hour]){
        sum += store.dailySales[hour].sales;
      }
    }
    else if (type === 'staffing'){
      if(store.dailyStaffing[hour]){
        sum += store.dailyStaffing[hour];
      }
    }
  }
  return sum;
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
  let newStore = new Store(storeName, minCusts, maxCusts, avgSales, openTime, closeTime);
  for (let store of Store.prototype.storesList)
  {
    if (store.storeName.toLowerCase() === storeName.toLowerCase())
    {
      store.storeName = newStore.storeName;
      store.custs = newStore.custs;
      store.times = newStore.times;
      store.dailyStaffing = newStore.dailyStaffing;
      store.dailySales = newStore.dailySales;
      store.processDailySales();
      Table.showTables();
      return;
    }
  }
  Store.addStore(newStore);
  Table.showTables();
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

Table.buildHeader = function(times, type){
  let headerRow = document.createElement('tr');
  let cell = document.createElement('th');
  cell.textContent = 'Store Name';
  headerRow.appendChild(cell);

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

Table.buildSalesRow = function(store, times){
  let row = document.createElement('tr');
  let cell = document.createElement('td');
  cell.textContent = store.storeName;
  cell.classList.add('highlight');
  row.appendChild(cell);

  for(let time = times.start; time < times.stop; time++){
    cell = document.createElement('td');
    if(store.dailySales[time]){
      cell.textContent = store.dailySales[time].sales;
    }
    else {
      cell.textContent = 0;
    }
    cell.classList.add('data');
    row.appendChild(cell);
  }

  cell = document.createElement('td');
  cell.textContent = store.sumDailySales();
  row.appendChild(cell);

  return row;
};

Table.buildStaffingRow = function(store, times){
  let row = document.createElement('tr');
  let cell = document.createElement('td');
  cell.textContent = store.storeName;
  cell.classList.add('highlight');
  row.appendChild(cell);

  for(let time = times.start; time < times.stop; time++){
    cell = document.createElement('td');
    if(store.dailyStaffing[time]){
      cell.textContent = store.dailyStaffing[time];
    }
    else {
      cell.textContent = 0;
    }
    cell.classList.add('data');
    row.appendChild(cell);
  }

  return row;
};

Table.buildSalesFooter = function(times){
  let row = document.createElement('tr');
  let cell = document.createElement('th');
  cell.textContent = 'Totals:';
  row.appendChild(cell);

  let total = 0;
  for(let time = times.start; time < times.stop; time++){
    cell = document.createElement('td');
    let sum = Store.sumHour(time, 'sales');
    total += sum;
    cell.textContent = Store.sumHour(time, 'sales');
    cell.classList.add('data');
    row.appendChild(cell);
  }

  cell = document.createElement('td');
  cell.textContent = total;
  cell.classList.add('highlight');
  row.appendChild(cell);
  return row;
};

Table.buildRow = function(store, times, type){
  if (type === 'sales'){
    return Table.buildSalesRow(store, times);
  }
  else if (type === 'staffing'){
    return Table.buildStaffingRow(store, times);
  }
};

Table.buildTables = function(storesList){
  let salesTable = document.createElement('table');
  let staffingTable =  document.createElement('table');
  let times = Table.getTimes(storesList);

  let salesHeader = Table.buildHeader(times, 'sales');
  let staffingHeader = Table.buildHeader(times, 'staffing');
  salesTable.appendChild(salesHeader);
  staffingTable.appendChild(staffingHeader);

  

  for (let store of storesList){
    let salesRow = Table.buildRow(store, times, 'sales');
    let staffingRow = Table.buildRow(store, times, 'staffing');
    salesTable.appendChild(salesRow);
    staffingTable.appendChild(staffingRow);
  }

  let salesFooter = Table.buildSalesFooter(times);
  salesTable.appendChild(salesFooter);

  return {sales: salesTable, staffing: staffingTable};
};

Table.showTables = function(){
  let tables = Table.buildTables(Store.prototype.storesList);
  let salesTable = tables.sales;
  let staffingTable = tables.staffing;

  let salesSection = document.getElementById('salesProjections');
  salesSection.innerHTML = '';
  let staffingSection = document.getElementById('staffingProjections');
  staffingSection.innerHTML ='';

  let salesHeadline = document.createElement('h2');
  salesHeadline.textContent = 'Sales Projections';
  salesSection.appendChild(salesHeadline);
  salesSection.appendChild(salesTable);

  let staffingHeadline = document.createElement('h2');
  staffingHeadline.textContent ='Staffing Projections';
  staffingSection.appendChild(staffingHeadline);
  staffingSection.appendChild(staffingTable);
  
};

//MAIN
Store.processAllDailySales();

let storeForm = document.getElementById('newStoreForm');
storeForm.addEventListener('submit', addStore);

Table.showTables();





