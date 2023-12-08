/**
 * Filename: advancedDataProcessing.js
 * 
 * Description:
 * This code demonstrates an advanced data processing application that performs various complex operations
 * on a dataset. It utilizes advanced JavaScript features like classes, async/await, and functional programming.
 * 
 * The code analyzes a dataset of sales records, calculates various statistical metrics, filters and sorts the data,
 * and generates a report for further analysis.
 * 
 * Please note that this code is a simplified representation and may not be suitable for production use.
 */

// Import necessary modules
const fs = require('fs');

// Define class for sales records
class SaleRecord {
  constructor(date, product, price, quantity) {
    this.date = date;
    this.product = product;
    this.price = price;
    this.quantity = quantity;
  }
}

// Read dataset from file
const dataset = fs.readFileSync('sales_data.csv', 'utf-8');

// Process the dataset
const processData = async () => {
  try {
    // Parse dataset into an array of SaleRecord objects
    const records = dataset.split('\n').map((row) => {
      const [date, product, price, quantity] = row.split(',');
      return new SaleRecord(date, product, parseFloat(price), parseInt(quantity));
    });
  
    // Calculate total sales by product
    const totalSalesByProduct = {};
    records.forEach((record) => {
      if (!totalSalesByProduct[record.product]) {
        totalSalesByProduct[record.product] = 0;
      }
      totalSalesByProduct[record.product] += record.price * record.quantity;
    });
  
    // Calculate average sale price
    const totalSales = records.reduce((sum, record) => sum + record.price * record.quantity, 0);
    const averageSalePrice = totalSales / records.length;
  
    // Filter records by date range
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-12-31');
    const filteredRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  
    // Sort records by product name in ascending order
    const sortedRecords = filteredRecords.sort((a, b) => a.product.localeCompare(b.product));
  
    // Generate report
    const report = {
      totalSalesByProduct,
      averageSalePrice,
      filteredRecords,
      sortedRecords,
    };
  
    // Save report to file
    await fs.promises.writeFile('report.json', JSON.stringify(report, null, 2));
  
    console.log('Data processing completed successfully.');
  } catch (error) {
    console.error('An error occurred during data processing:', error);
  }
};

// Run the data processing function
processData();