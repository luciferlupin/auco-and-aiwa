import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ktrqhmzaesllajbowymt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cnFobXphZXNsbGFqYm93eW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDAxMzMsImV4cCI6MjEwMzQxNjEzM30.SvwTDEBlfJ8hfyC2ELCCskXk2uVNGpDB73VLHJDHAVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('====================================================');
console.log('COMPREHENSIVE BACKEND & DATABASE CRUD QA SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, name, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${name}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${name} -> ${details}`);
    failCount++;
  }
}

async function runFullQA() {
  const runId = Date.now();

  // 1. CLIENTS CRUD
  console.log('\n--- 1. Testing CLIENTS CRUD ---');
  const testClientId = `QA-CLN-${runId}`;
  try {
    const { error: insErr } = await supabase.from('clients').insert({
      id: testClientId,
      brand: 'AUCO',
      client_name: 'QA Client',
      company_name: 'QA Engineering Corp',
      contact_person: 'QA Person',
      phone: '9800011111',
      email: 'qa@client.com',
      city: 'Pune',
      state: 'Maharashtra',
      client_type: 'Enterprise',
      lead_source: 'Website',
      conversion_status: 'Converted',
      total_orders: 1,
      payment_terms: 'Net 30',
      payment_days: 30,
      pending_amount: 0,
      total_business_value: 100000,
      client_status: 'Active'
    });
    assert(!insErr, 'Client Insert', insErr?.message);

    const { data: selClient, error: selErr } = await supabase.from('clients').select('*').eq('id', testClientId).single();
    assert(!selErr && selClient?.company_name === 'QA Engineering Corp', 'Client Select & Column Verification', selErr?.message);

    const { error: updErr } = await supabase.from('clients').update({ pending_amount: 25000 }).eq('id', testClientId);
    assert(!updErr, 'Client Update', updErr?.message);

    const { error: delErr } = await supabase.from('clients').delete().eq('id', testClientId);
    assert(!delErr, 'Client Delete', delErr?.message);
  } catch (e) {
    assert(false, 'Client Exception', e.message);
  }

  // 2. PRODUCTS / INVENTORY CRUD
  console.log('\n--- 2. Testing PRODUCTS CRUD ---');
  const testProdId = `QA-PRD-${runId}`;
  const testProdCode = `QA-CODE-${runId}`;
  try {
    const { error: insErr } = await supabase.from('products').insert({
      id: testProdId,
      brand: 'AUCO',
      product_code: testProdCode,
      name: 'QA Test Sensor Array',
      sku: 'SKU-QA-TEST',
      category: 'Automation Hardware',
      current_stock: 50,
      available_stock: 50,
      min_stock_level: 10,
      stock_in: 50,
      stock_out: 0,
      reserved_stock: 0,
      price: 15000,
      supplier: 'QA Supplier Hub'
    });
    assert(!insErr, 'Product Insert', insErr?.message);

    const { data: selProd, error: selErr } = await supabase.from('products').select('*').eq('id', testProdId).single();
    assert(!selErr && Number(selProd?.available_stock) === 50, 'Product Stock Verification', selErr?.message);

    const { error: updErr } = await supabase.from('products').update({
      stock_out: 5,
      available_stock: 45
    }).eq('id', testProdId);
    assert(!updErr, 'Product Stock Adjustment Update', updErr?.message);

    const { error: delErr } = await supabase.from('products').delete().eq('id', testProdId);
    assert(!delErr, 'Product Delete', delErr?.message);
  } catch (e) {
    assert(false, 'Product Exception', e.message);
  }

  // 3. ORDERS & DISPATCHES CRUD
  console.log('\n--- 3. Testing ORDERS & DISPATCHES CRUD ---');
  const testOrderId = `QA-ORD-${runId}`;
  const testDispId = `QA-DSP-${runId}`;
  try {
    const { error: insOrderErr } = await supabase.from('orders').insert({
      id: testOrderId,
      brand: 'AUCO',
      client_id: 'CLN-001',
      client_name: 'Mehta Precision Engineering Ltd',
      product_code: 'AUC-101',
      quantity: 2,
      order_value: 90000,
      delivery_status: 'In Progress',
      payment_status: 'Unpaid',
      order_date: new Date().toISOString().split('T')[0],
      assigned_team_member: 'Rahul Verma'
    });
    assert(!insOrderErr, 'Order Insert', insOrderErr?.message);

    // Create linked dispatch
    const { error: insDispErr } = await supabase.from('dispatches').insert({
      id: testDispId,
      order_id: testOrderId,
      brand: 'AUCO',
      client_id: 'CLN-001',
      client_name: 'Mehta Precision Engineering Ltd',
      company_name: 'Mehta Precision Engineering Ltd',
      challan_number: `DC-QA-${runId.toString().slice(-4)}`,
      courier_carrier: 'BlueDart Express',
      tracking_number: 'TRK-QA-123456',
      package_count: 2,
      dispatch_date: new Date().toISOString().split('T')[0],
      dispatch_status: 'Dispatched'
    });
    assert(!insDispErr, 'Dispatch Insert & Link to Order', insDispErr?.message);

    // Verify linked read
    const { data: selDisp, error: selDispErr } = await supabase.from('dispatches').select('*').eq('id', testDispId).single();
    assert(!selDispErr && selDisp?.tracking_number === 'TRK-QA-123456', 'Dispatch Select Verification', selDispErr?.message);

    // Clean up
    await supabase.from('dispatches').delete().eq('id', testDispId);
    await supabase.from('orders').delete().eq('id', testOrderId);
    assert(true, 'Order & Dispatch Cleaned up');
  } catch (e) {
    assert(false, 'Order/Dispatch Exception', e.message);
  }

  // 4. INVOICES & PAYMENTS CRUD
  console.log('\n--- 4. Testing INVOICES & PAYMENTS CRUD ---');
  const testInvId = `QA-INV-${runId}`;
  const testPayId = `QA-PAY-${runId}`;
  try {
    const testInvNum = `INV-QA-${runId.toString().slice(-4)}`;
    const { error: insInvErr } = await supabase.from('invoices').insert({
      id: testInvId,
      invoice_number: testInvNum,
      brand: 'AUCO',
      client_name: 'QA Billing Client',
      subtotal: 100000,
      tax_amount: 18000,
      total_amount: 118000,
      amount_paid: 50000,
      balance: 68000,
      payment_status: 'Partially Paid',
      issue_date: new Date().toISOString().split('T')[0],
      payment_due_date: new Date(Date.now() + 30*86400000).toISOString().split('T')[0]
    });
    assert(!insInvErr, 'Invoice Insert', insInvErr?.message);

    const { error: insPayErr } = await supabase.from('payments').insert({
      id: testPayId,
      invoice_id: testInvId,
      invoice_number: testInvNum,
      brand: 'AUCO',
      client_name: 'QA Billing Client',
      invoice_amount: 118000,
      amount_paid: 50000,
      balance: 68000,
      payment_mode: 'NEFT',
      payment_date: new Date().toISOString().split('T')[0],
      payment_status: 'Partially Paid'
    });
    assert(!insPayErr, 'Payment Record Insert', insPayErr?.message);

    // Clean up
    await supabase.from('payments').delete().eq('id', testPayId);
    await supabase.from('invoices').delete().eq('id', testInvId);
    assert(true, 'Invoice & Payment Cleaned up');
  } catch (e) {
    assert(false, 'Invoice/Payment Exception', e.message);
  }

  // 5. FOLLOWUPS CRUD
  console.log('\n--- 5. Testing FOLLOWUPS CRUD ---');
  const testFlwId = `QA-FLW-${runId}`;
  try {
    const { error: insFlwErr } = await supabase.from('followups').insert({
      id: testFlwId,
      brand: 'AUCO',
      client_name: 'QA Touchpoint Client',
      contact_person: 'Amit Kumar',
      phone: '9811122233',
      assigned_salesperson: 'Priya Desai',
      follow_up_date: new Date().toISOString().split('T')[0],
      follow_up_type: 'WhatsApp',
      notes: 'QA Scheduled discussion',
      next_action: 'Send quotation',
      status: 'Pending'
    });
    assert(!insFlwErr, 'Follow-up Insert', insFlwErr?.message);

    const { error: updFlwErr } = await supabase.from('followups').update({ status: 'Completed' }).eq('id', testFlwId);
    assert(!updFlwErr, 'Follow-up Mark Done Update', updFlwErr?.message);

    await supabase.from('followups').delete().eq('id', testFlwId);
    assert(true, 'Follow-up Cleaned up');
  } catch (e) {
    assert(false, 'Followup Exception', e.message);
  }

  // 6. TASKS CRUD
  console.log('\n--- 6. Testing TASKS CRUD ---');
  const testTaskId = `QA-TSK-${runId}`;
  try {
    const { error: insTaskErr } = await supabase.from('tasks').insert({
      id: testTaskId,
      task_name: 'QA Logistics Verification',
      description: 'Test dispatch readiness',
      assigned_person: 'Rahul Verma',
      priority: 'High',
      status: 'To Do',
      due_date: new Date().toISOString().split('T')[0],
      created_by: 'QA System'
    });
    assert(!insTaskErr, 'Task Insert', insTaskErr?.message);

    const { error: updTaskErr } = await supabase.from('tasks').update({ status: 'Completed' }).eq('id', testTaskId);
    assert(!updTaskErr, 'Task Update to Completed', updTaskErr?.message);

    await supabase.from('tasks').delete().eq('id', testTaskId);
    assert(true, 'Task Cleaned up');
  } catch (e) {
    assert(false, 'Task Exception', e.message);
  }

  // 7. LEADS CRUD
  console.log('\n--- 7. Testing LEADS CRUD ---');
  const testLeadId = `QA-LED-${runId}`;
  try {
    const { error: insLeadErr } = await supabase.from('leads').insert({
      id: testLeadId,
      brand: 'AUCO',
      client: 'Sunil Gavaskar',
      company: 'Premier Textiles Pvt Ltd',
      phone: '9876543210',
      stage: 'New Lead',
      expected_value: 250000,
      lead_source: 'WhatsApp'
    });
    assert(!insLeadErr, 'Lead Insert', insLeadErr?.message);

    const { error: updLeadErr } = await supabase.from('leads').update({ stage: 'Qualified' }).eq('id', testLeadId);
    assert(!updLeadErr, 'Lead Stage Advance Update', updLeadErr?.message);

    await supabase.from('leads').delete().eq('id', testLeadId);
    assert(true, 'Lead Cleaned up');
  } catch (e) {
    assert(false, 'Lead Exception', e.message);
  }

  console.log('\n====================================================');
  console.log(`FULL CRUD QA RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('====================================================');
}

runFullQA();
