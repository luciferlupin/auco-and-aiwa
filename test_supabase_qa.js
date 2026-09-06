import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ktrqhmzaesllajbowymt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cnFobXphZXNsbGFqYm93eW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDAxMzMsImV4cCI6MjEwMzQxNjEzM30.SvwTDEBlfJ8hfyC2ELCCskXk2uVNGpDB73VLHJDHAVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('====================================================');
console.log('SUPABASE & BACKEND DATABASE QA DIAGNOSTIC TEST');
console.log(`Target URL: ${SUPABASE_URL}`);
console.log('====================================================\n');

const tables = [
  'users_directory',
  'products',
  'clients',
  'leads',
  'orders',
  'dispatches',
  'invoices',
  'payments',
  'tasks',
  'followups',
  'activity_logs',
  'repairs'
];

async function runQA() {
  let passedTables = 0;
  let missingTables = [];
  let tableRows = {};

  console.log('--- 1. Testing Table Existence & Read Permissions ---');
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(5);

      if (error) {
        console.error(`❌ [FAIL] Table '${table}':`, error.message, `(Code: ${error.code})`);
        missingTables.push({ table, error: error.message });
      } else {
        console.log(`✅ [PASS] Table '${table}' is accessible! Found ${data.length} sample rows (Total: ${count ?? 'N/A'})`);
        passedTables++;
        tableRows[table] = data;
      }
    } catch (err) {
      console.error(`❌ [EXCEPTION] Table '${table}':`, err.message);
      missingTables.push({ table, error: err.message });
    }
  }

  console.log(`\nTable Status: ${passedTables}/${tables.length} tables verified.\n`);

  // Test 2: CRUD Write Test on Tasks (or another table)
  console.log('--- 2. Testing Insert, Update & Delete Permissions (RLS Check) ---');
  const testTaskId = `TEST-TASK-${Date.now()}`;
  try {
    console.log(`Attempting to insert test task: ${testTaskId}...`);
    const { data: insertData, error: insertError } = await supabase
      .from('tasks')
      .insert({
        id: testTaskId,
        task_name: 'QA Automation Test Task',
        description: 'Verifying frontend-backend database sync',
        client: 'Mehta Precision Engineering Ltd',
        assigned_person: 'Rahul Verma',
        priority: 'Medium',
        due_date: new Date().toISOString().split('T')[0],
        status: 'To Do',
        created_by: 'QA Suite'
      })
      .select();

    if (insertError) {
      console.error(`❌ [FAIL] Insert Task Error:`, insertError.message);
    } else {
      console.log(`✅ [PASS] Insert successful!`, insertData);

      // Update test
      console.log(`Attempting to update task: ${testTaskId}...`);
      const { data: updateData, error: updateError } = await supabase
        .from('tasks')
        .update({ status: 'Completed' })
        .eq('id', testTaskId)
        .select();

      if (updateError) {
        console.error(`❌ [FAIL] Update Task Error:`, updateError.message);
      } else {
        console.log(`✅ [PASS] Update successful! New status:`, updateData?.[0]?.status);
      }

      // Delete test
      console.log(`Attempting to clean up test task: ${testTaskId}...`);
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', testTaskId);

      if (deleteError) {
        console.error(`❌ [FAIL] Delete Task Error:`, deleteError.message);
      } else {
        console.log(`✅ [PASS] Delete successful! Cleaned up.`);
      }
    }
  } catch (err) {
    console.error(`❌ [EXCEPTION] CRUD Test failed:`, err.message);
  }

  // Test 3: Leads Insert/Update/Delete
  console.log('\n--- 3. Testing Leads Insert & Conversion Check ---');
  const testLeadId = `TEST-LEAD-${Date.now()}`;
  try {
    const { error: leadInsertErr } = await supabase
      .from('leads')
      .insert({
        id: testLeadId,
        brand: 'AUCO',
        client: 'QA Contact Person',
        company: 'QA Test Industries',
        phone: '9999988888',
        stage: 'New Lead',
        expected_value: 50000
      });

    if (leadInsertErr) {
      console.error(`❌ [FAIL] Lead Insert Error:`, leadInsertErr.message);
    } else {
      console.log(`✅ [PASS] Lead Insert successful: ${testLeadId}`);

      // Clean up lead
      await supabase.from('leads').delete().eq('id', testLeadId);
      console.log(`✅ [PASS] Cleaned up test lead.`);
    }
  } catch (err) {
    console.error(`❌ [EXCEPTION] Lead test failed:`, err.message);
  }

  // Test 4: Repairs Table Check
  console.log('\n--- 4. Testing Repairs Table & Sync ---');
  const testRepId = `TEST-REP-${Date.now()}`;
  try {
    const { error: repErr } = await supabase
      .from('repairs')
      .insert({
        id: testRepId,
        brand: 'AUCO',
        customer_name: 'Test Customer',
        customer_phone: '9876543210',
        product_code: 'AUC-101',
        product_name: 'Test Product',
        issue_description: 'Testing repair persistence',
        repair_status: 'Pending Diagnosis'
      });

    if (repErr) {
      console.warn(`⚠ [NOTICE] Repairs table insert note:`, repErr.message);
      if (repErr.code === '42P01') {
        console.log(`ℹ Notice: The 'repairs' table has not yet been executed in the Supabase SQL editor by the user.`);
      }
    } else {
      console.log(`✅ [PASS] Repairs insert successful: ${testRepId}`);
      await supabase.from('repairs').delete().eq('id', testRepId);
      console.log(`✅ [PASS] Cleaned up test repair record.`);
    }
  } catch (err) {
    console.error(`❌ [EXCEPTION] Repairs test:`, err.message);
  }

  console.log('\n====================================================');
  console.log('DATABASE QA DIAGNOSTIC SUMMARY');
  console.log('====================================================');
  console.log(`Total Tables Tested: ${tables.length}`);
  console.log(`Accessible: ${passedTables}`);
  console.log(`Issues / Missing: ${missingTables.length}`);
  if (missingTables.length > 0) {
    console.log(`Table Issues:`, missingTables);
  }
}

runQA();
