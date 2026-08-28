import * as XLSX from 'xlsx';

// For invoices
export const exportToExcel = (filteredinvoices) => {
  if (!filteredinvoices || filteredinvoices.length === 0) {
    alert('No data to export!');
    return;
  }

  const formattedData = filteredinvoices.map(item => ({
    invoiceNumber: item.invoiceNumber,
    jobNumber: item.jobNumber,
    customerName: item.customerName,
    customerEmail: item.customerEmail,
    customerNumber: item.customerNumber,
    gstNumber: item.gstNumber,
    invoiceDate: item.invoiceDate,
    taxPercent: item.taxPercent,
    products: item.products.map(p => `${p.name} (Qty: ${p.quantity}, Price: ${p.price})`).join('; '),
    subtotal: item.subtotal,
    tax: item.tax,
    total: item.total,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
  XLSX.writeFile(workbook, 'Filtered_Invoices.xlsx');
};

// ✅ Fix for customers export
export const exportCustomersExcel = (filteredCustomers) => {
  if (!filteredCustomers || filteredCustomers.length === 0) {
    alert('No customer data to export!');
    return;
  }

  const formattedData = filteredCustomers.map(customer => ({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    zip: customer.zip,
    gstNumber: customer.gstNumber,
    createdAt: customer.createdAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
  XLSX.writeFile(workbook, 'Customer_Details.xlsx');
};
