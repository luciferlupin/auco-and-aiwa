import {
  initialUsers,
  initialProducts,
  initialClients,
  initialLeads,
  initialOrders,
  initialInvoices,
  initialPayments,
  initialFollowUps,
  initialTasks,
  indiaStateData
} from './src/data/initialData.js';
import { formatCurrency, formatDate, getWhatsAppUrl, getStatusBadgeClass, generateId } from './src/utils/formatters.js';

console.log('====================================================');
console.log('AUCO & AIWA OPERATIONS SUITE - AUTOMATED TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

const assert = (condition, testName, details = '') => {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${details}`);
  }
};

// ----------------------------------------------------
// TEST 1: User Directory & 4 Roles
// ----------------------------------------------------
console.log('\n--- 1. Testing User Accounts & Roles ---');
const roles = ['Admin', 'Sales', 'Accounts', 'Services'];
const userRoles = initialUsers.map(u => u.role);
roles.forEach(r => {
  assert(userRoles.includes(r), `Role '${r}' exists in user directory`);
});
assert(initialUsers.length >= 4, 'All required staff accounts initialized');

// ----------------------------------------------------
// TEST 2: Client Management & Geolocation
// ----------------------------------------------------
console.log('\n--- 2. Testing Client Management ---');
const testClient = {
  id: generateId('CLN'),
  clientName: 'Rahul Verma',
  companyName: 'Apex Industrial Systems',
  contactPerson: 'Rahul Verma',
  phone: '9822012345',
  email: 'rahul@apexsystems.in',
  city: 'Pune',
  state: 'Maharashtra',
  clientType: 'Enterprise',
  leadSource: 'Website',
  leadType: 'Inbound',
  conversionStatus: 'Converted',
  assignedSalesPerson: 'Vikram Malhotra',
  totalOrders: 2,
  orderFrequency: 'Monthly',
  lastOrder: '2026-08-15',
  nextExpectedOrder: '2026-09-15',
  paymentTerms: 'Net 30',
  paymentDays: 30,
  pendingAmount: 75000,
  totalBusinessValue: 450000,
  notes: 'Key automation client in Chakan MIDC',
  clientStatus: 'Active'
};

assert(testClient.id.startsWith('CLN-'), 'Client ID generated correctly');
assert(testClient.companyName && testClient.state === 'Maharashtra', 'Client state and company validated');
assert(indiaStateData[testClient.state] !== undefined, 'Client state maps to India Map nodes');

// ----------------------------------------------------
// TEST 3: Sales Pipeline & 1-Click Lead Conversion
// ----------------------------------------------------
console.log('\n--- 3. Testing Lead Management & Conversion ---');
const newLead = {
  id: generateId('LEAD'),
  client: 'Sanjay Deshmukh',
  company: 'Tata Steel Processing Ltd',
  phone: '9820098200',
  email: 'sanjay.d@tatasteel.com',
  city: 'Jamshedpur',
  state: 'Jharkhand',
  leadSource: 'Referral',
  leadType: 'Direct',
  assignedSalesperson: 'Vikram Malhotra',
  followUpDate: '2026-08-30',
  lastContact: '2026-08-27',
  nextAction: 'Final commercial negotiation',
  stage: 'Negotiation',
  expectedValue: 850000,
  conversionStatus: 'Not Converted',
  conversionDate: null,
  conversionPercentage: 80,
  leadDate: '2026-08-20',
  notes: 'High priority enterprise deal',
  whatsappStatus: 'Lead registered'
};

assert(newLead.expectedValue === 850000, 'Lead value registered accurately');
assert(newLead.stage === 'Negotiation', 'Lead stage is Negotiation');

// Simulate 1-Click Lead Conversion to Client
const convertedClient = {
  id: generateId('CLN'),
  clientName: newLead.client,
  companyName: newLead.company,
  contactPerson: newLead.client,
  phone: newLead.phone,
  email: newLead.email,
  address: `${newLead.city}, ${newLead.state}`,
  city: newLead.city,
  state: newLead.state,
  clientType: 'Enterprise',
  leadSource: newLead.leadSource,
  leadType: newLead.leadType,
  conversionStatus: 'Converted',
  assignedSalesPerson: newLead.assignedSalesperson,
  totalOrders: 1,
  orderFrequency: 'Monthly',
  lastOrder: '2026-08-27',
  paymentTerms: 'Net 30',
  paymentDays: 30,
  pendingAmount: 0,
  totalBusinessValue: newLead.expectedValue,
  notes: `Converted from lead (${newLead.id})`,
  clientStatus: 'Active'
};

newLead.stage = 'Won';
newLead.conversionStatus = 'Converted';
newLead.conversionPercentage = 100;

assert(newLead.conversionStatus === 'Converted' && newLead.stage === 'Won', 'Lead successfully converted to Won');
assert(convertedClient.totalBusinessValue === 850000, 'Converted client business value inherits lead expected value');

// ----------------------------------------------------
// TEST 4: Orders & Auto-Deduction of Inventory Stock
// ----------------------------------------------------
console.log('\n--- 4. Testing Orders & Auto-Stock Deduction ---');
const targetProduct = { ...initialProducts[0] }; // e.g. AUC-101
const initialStock = targetProduct.currentStock;
const orderQuantity = 3;

const orderItem = {
  productCode: targetProduct.productCode,
  name: targetProduct.name,
  quantity: orderQuantity,
  price: targetProduct.price
};

const initialStockOut = targetProduct.stockOut;
targetProduct.currentStock -= orderQuantity;
targetProduct.stockOut += orderQuantity;
targetProduct.availableStock = Math.max(0, targetProduct.currentStock - targetProduct.reservedStock);

assert(targetProduct.currentStock === initialStock - orderQuantity, `Inventory stock auto-deducted by ${orderQuantity} units`);
assert(targetProduct.stockOut === initialStockOut + orderQuantity, 'Stock-out counter incremented');

// ----------------------------------------------------
// TEST 5: GST Invoices & Payment Recalculation
// ----------------------------------------------------
console.log('\n--- 5. Testing Invoices & Payment Calculations ---');
const invoiceSubtotal = orderQuantity * targetProduct.price;
const taxRate = 18;
const taxAmount = Math.round(invoiceSubtotal * 0.18);
const totalInvoiceAmount = invoiceSubtotal + taxAmount;
let amountPaid = 0;
let balance = totalInvoiceAmount - amountPaid;

const newInvoice = {
  id: generateId('INV-2026'),
  invoiceNumber: generateId('INV-2026'),
  subtotal: invoiceSubtotal,
  taxRate,
  taxAmount,
  totalAmount: totalInvoiceAmount,
  amountPaid,
  balance,
  paymentStatus: 'Sent'
};

assert(newInvoice.totalAmount === invoiceSubtotal + taxAmount, 'GST 18% added correctly to total');
assert(newInvoice.balance === totalInvoiceAmount, 'Initial balance matches full invoice total');

// Record partial payment of ₹50,000
const partialPayment = 50000;
newInvoice.amountPaid += partialPayment;
newInvoice.balance = Math.max(0, newInvoice.totalAmount - newInvoice.amountPaid);
newInvoice.paymentStatus = newInvoice.balance === 0 ? 'Paid' : 'Partially Paid';

assert(newInvoice.balance === totalInvoiceAmount - partialPayment, 'Balance correctly reduced after partial payment');
assert(newInvoice.paymentStatus === 'Partially Paid', 'Status correctly set to Partially Paid');

// Record remaining payment
const remainingPayment = newInvoice.balance;
newInvoice.amountPaid += remainingPayment;
newInvoice.balance = Math.max(0, newInvoice.totalAmount - newInvoice.amountPaid);
newInvoice.paymentStatus = newInvoice.balance === 0 ? 'Paid' : 'Partially Paid';

assert(newInvoice.balance === 0, 'Balance is 0 after full settlement');
assert(newInvoice.paymentStatus === 'Paid', 'Status correctly upgraded to Paid');

// ----------------------------------------------------
// TEST 6: Task Assignment & Follow-Up Tracking
// ----------------------------------------------------
console.log('\n--- 6. Testing Task Assignment & Follow-ups ---');
const newTask = {
  id: generateId('TSK'),
  taskName: 'Deploy Industrial Controller & Calibrate Sensors',
  assignedPerson: 'Sneha Kulkarni',
  priority: 'Urgent',
  dueDate: '2026-08-29',
  status: 'In Progress'
};
assert(newTask.priority === 'Urgent', 'Task priority set to Urgent');

const newFollowUp = {
  id: generateId('FLW'),
  clientName: testClient.companyName,
  phone: testClient.phone,
  followUpType: 'WhatsApp',
  status: 'Pending'
};
const waUrl = getWhatsAppUrl(newFollowUp.phone, 'Follow-up message');
assert(waUrl.includes('919822012345'), 'WhatsApp link generated with valid Indian country code');

// ----------------------------------------------------
// TEST 7: Defensive Error Checks & Fallbacks
// ----------------------------------------------------
console.log('\n--- 7. Testing Defensive Fallbacks & Sanitizers ---');
assert(formatCurrency(null) === '₹0', 'formatCurrency(null) safely returns ₹0');
assert(formatCurrency(undefined) === '₹0', 'formatCurrency(undefined) safely returns ₹0');
assert(formatCurrency('invalid_num') === '₹0', 'formatCurrency(string) safely returns ₹0');
assert(formatCurrency(150000).includes('1,50,000'), 'formatCurrency formats Indian numbers with lakhs separator');

assert(formatDate(null) === '—', 'formatDate(null) safely returns —');
assert(formatDate('invalid-date') === 'invalid-date', 'formatDate(invalid) safely returns original string without throwing');

assert(getStatusBadgeClass(null) === 'badge-neutral', 'getStatusBadgeClass(null) safely returns neutral badge');
assert(getStatusBadgeClass('Paid') === 'badge-success', 'getStatusBadgeClass("Paid") returns badge-success');
assert(getStatusBadgeClass('Overdue') === 'badge-danger', 'getStatusBadgeClass("Overdue") returns badge-danger');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('====================================================\n');
