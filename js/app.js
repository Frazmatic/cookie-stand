'use strict';

function createDailySalesObject(startTime, endTime){
  let timeList = {};
  for(let milTime = startTime; milTime < endTime; milTime++){
    let time;
    if (milTime < 12){
      time = `${milTime}am`;
    }
    else if (milTime === 12){
      time = `${milTime}pm`;
    }
    else {
      time = `${milTime - 12}pm`;
    }
    timeList[time] = 0;
  }
  return timeList;
}

function Store(storeName, minHourlyCusts, maxHourlyCusts, avgSalesPerCust, startTime, endTime){
  this.storeName = storeName;
  this.hourlyCusts = {min: minHourlyCusts, max: maxHourlyCusts};
  this.avgSale = avgSalesPerCust;
  this.openTime = startTime;
  this.closeTime = endTime;
  this.dailySales = createDailySalesObject(this.openTime, this.closeTime);
}

Store.prototype.randomHourlySales = function(){
  let customers = Math.round(Math.random() * (this.hourlyCusts.max - this.hourlyCusts.min) + this.hourlyCusts.min);
  return Math.round(customers * this.avgSale);
};

Store.prototype.addDaySales = function(){
  for(let hour in this.dailySales){
    this.dailySales[hour] = this.randomHourlySales();
  }
};

Store.prototype.totalSales = function(){
  let total = 0;
  for(let hour in this.dailySales){
    total += this.dailySales[hour];
  }
  return total;
};

Store.prototype.render = function(table){
  let row = document.createElement('tr');

  //add name
  let cell = document.createElement('td');
  cell.classList.add('highlight');
  cell.textContent = this.storeName;
  row.appendChild(cell);

  //add cell to row for each hour of sales, but enter 0 for hours this store is not open
  let headerRow = table.rows[0].cells;
  let times = [];
  for(let i = 1; i < headerRow.length - 1; i++){
    times.push(headerRow[i].textContent);
  }
  for(let time of times){
    cell = document.createElement('td');
    cell.classList.add('data');
    if (this.dailySales[time]){
      cell.textContent = this.dailySales[time];
    }
    else {
      cell.textContent = 0;
    }
    row.appendChild(cell);
  }

  //add daily total
  cell = document.createElement('td');
  cell.classList.add('data');
  cell.textContent = this.totalSales();
  row.appendChild(cell);

  table.appendChild(row);
};

//create an object with store names as keys and hourly sales as an array of numbers
Store.tableDataObjectCreate = function(table){
  let data = {};
  
  //get all rows from table excluding first row which is headers
  for(let i = 1; i < table.rows.length; i++){
    let row = table.rows[i];
    //add an array to new object with the name as key
    data[row.cells[0].textContent] = []; 
    //get all cells from row, excluding first cell which is name
    for(let j = 1; j < row.cells.length; j++){
      let cell = row.cells[j];
      data[row.cells[0].textContent].push(parseInt(cell.textContent));
    }
  }
  return data;
};

Store.buildHeaderRow = function(startTime, endTime){
  let row = document.createElement('tr');
  let header = document.createElement('th');
  header.textContent = 'Store Name';
  row.appendChild(header);

  let hoursObject = createDailySalesObject(startTime, endTime);
  for(let hour in hoursObject){
    header = document.createElement('th');
    header.textContent = hour;
    row.appendChild(header);
  }

  header = document.createElement('th');
  header.textContent = 'Daily Location Total';
  row.appendChild(header);
  return row;
};

Store.buildFooterRow = function(table){
  let row = document.createElement('tr');
  let cell = document.createElement('th');
  cell.textContent = 'Totals';
  row.appendChild(cell);

  let data = Store.tableDataObjectCreate(table);
  //get first key so can see array length
  let firstStore = Object.keys(data)[0];
  for(let columnNumber = 0; columnNumber < data[firstStore].length; columnNumber++){
    let columnTotal = 0;
    for(let storeName in data){
      columnTotal += data[storeName][columnNumber];
    }
    let cell = document.createElement('th');
    cell.textContent = columnTotal;
    cell.classList.add('data');
    row.appendChild(cell);
  }
  return row;
};

Store.buildTable = function(storesList){
  //create header based on earliest and latest times needed to show; in case not all stores are same hours
  let minStart = 24;
  let maxEnd = 0;
  for(let store of storesList){
    if(store.openTime < minStart){
      minStart = store.openTime;
    }
    if(store.closeTime > maxEnd){
      maxEnd = store.closeTime;
    }
  }
  let header = Store.buildHeaderRow(minStart, maxEnd);

  let table = document.createElement('table');
  table.appendChild(header);

  //add all stores to table
  for(let store of storesList){
    store.render(table);
  }
  //add footer
  table.appendChild(Store.buildFooterRow(table));
  return table;
};

//MAIN: Use the objects and their methods

let storesList =
[
  new Store('Seattle', 23, 65, 6.3, 6, 20),
  new Store('Tokyo', 3,24, 1.2, 6, 20),
  new Store('Dubai', 23, 65, 6.3, 6, 20),
  new Store('Paris', 20, 38, 2.3, 6, 20),
  new Store('Lima', 2, 16, 4.6, 6, 20)
];

for (let store of storesList){
  store.addDaySales();
}

let table = Store.buildTable(storesList);

let body = document.getElementById('salesBody');
body.appendChild(table);





