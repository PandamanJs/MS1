import { pgTable, serial, text, varchar, decimal, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// Students table
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  studentId: varchar('student_id', { length: 50 }).unique(),
  parentEmail: varchar('parent_email', { length: 255 }),
  parentPhone: varchar('parent_phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Academic years table
export const academicYears = pgTable('academic_years', {
  id: serial('id').primaryKey(),
  year: varchar('year', { length: 20 }).notNull().unique(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// Academic terms table
export const academicTerms = pgTable('academic_terms', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  academicYearId: integer('academic_year_id').references(() => academicYears.id),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// Fee types table
export const feeTypes = pgTable('fee_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// Student fees table (fees assigned to specific students)
export const studentFees = pgTable('student_fees', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  feeTypeId: integer('fee_type_id').references(() => feeTypes.id).notNull(),
  academicYearId: integer('academic_year_id').references(() => academicYears.id).notNull(),
  academicTermId: integer('academic_term_id').references(() => academicTerms.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp('due_date'),
  isPaid: boolean('is_paid').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  transactionId: varchar('transaction_id', { length: 100 }),
  quickbooksTransactionId: varchar('quickbooks_transaction_id', { length: 100 }),
  status: varchar('status', { length: 20 }).default('completed'),
  paymentDate: timestamp('payment_date').defaultNow(),
  receiptSentToEmail: varchar('receipt_sent_to_email', { length: 255 }),
  receiptSentToWhatsapp: varchar('receipt_sent_to_whatsapp', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow()
});

// Payment items table (linking payments to specific fees)
export const paymentItems = pgTable('payment_items', {
  id: serial('id').primaryKey(),
  paymentId: integer('payment_id').references(() => payments.id).notNull(),
  studentFeeId: integer('student_fee_id').references(() => studentFees.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});