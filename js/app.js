'use strict';

let store = {
  //after constructor function is added these can all be added to prototype
  numberCustomersRand: function(){
    let customers = Math.round(Math.random() * (this.hourlyCust.max - this.hourlyCust.min) + this.hourlyCust.min);
    return customers;
  },
  addHourlySale: function(){
    let sales = Math.round(this.numberCustomersRand() * this.avgSale);
    this.totalSales += sales;
    this.hourlySales.push(sales);
  },
  displaySales: function(){
    let time = 6;
    const section = document.createElement('section');
    const list = document.createElement('ul');
    for (let item of this.hourlySales){
      let listItem = document.createElement('li');
      listItem.appendChild(document.createTextNode(`${this.timeConvert(time)}: ${item}`));
      list.appendChild(listItem);
      time++;
    }
    let listItem = document.createElement('li');
    listItem.appendChild(document.createTextNode(`Total: ${this.totalSales} cookies`));
    list.appendChild(listItem);

    section.appendChild(document.createTextNode(`${this.storeName}\n`));
    section.appendChild(list);
    document.body.appendChild(section);
  },
  timeConvert: function(milTime){
    if (milTime <= 12){
      return `${milTime}am`;
    }
    else {
      return `${milTime - 12}pm`;
    }
  },
  addDaysSales: function(hours) {
    for (let i = 0; i < hours; i++){
      this.addHourlySale();
    }
  }
};

function addProperties(subObj, superObj){
  //this func will be replaced by adding to prototype after constructor is created
  for (let key in superObj){
    subObj[key] = superObj[key];
  }
}

function runDailySales(aStore){
  //after constructor created and prototypes added, this can be replaced with a method
  addProperties(aStore, store);
  aStore.addDaysSales(14);
  aStore.displaySales();
}

let seattle = {
  storeName: 'Seattle',
  hourlyCust: {min: 23, max: 65},
  avgSale: 6.3,
  hourlySales: [],
  totalSales: 0
};
runDailySales(seattle);

let tokyo = {
  storeName: 'Tokyo',
  hourlyCust: {min: 3, max: 24},
  avgSale: 1.2,
  hourlySales: [],
  totalSales: 0
};
runDailySales(tokyo);

let dubai = {
  storeName: 'Dubai',
  hourlyCust: {min: 23, max: 65},
  avgSale: 6.3,
  hourlySales: [],
  totalSales: 0
};
runDailySales(dubai);

let paris = {
  storeName: 'Paris',
  hourlyCust: {min: 20, max: 38},
  avgSale: 2.3,
  hourlySales: [],
  totalSales: 0
};
runDailySales(paris);

let lima = {
  storeName: 'Lima',
  hourlyCust: {min: 2, max: 16},
  avgSale: 4.6,
  hourlySales: [],
  totalSales: 0
};
runDailySales(lima);










