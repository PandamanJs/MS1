import { db } from '../lib/db.js';
import { students, academicYears, academicTerms, feeTypes, studentFees, payments, paymentItems } from '../lib/schema.js';
import { eq, or, desc } from 'drizzle-orm';

// Student operations
export async function lookupStudent(searchTerm) {
  try {
    const cleanedInput = searchTerm.trim();
    
    // Search by phone, email, or student ID
    const result = await db
      .select({
        id: students.id,
        first_name: students.firstName,
        last_name: students.lastName,
        email: students.email,
        phone: students.phone,
        student_id: students.studentId,
        parent_email: students.parentEmail,
        parent_phone: students.parentPhone
      })
      .from(students)
      .where(
        or(
          eq(students.phone, cleanedInput),
          eq(students.parentPhone, cleanedInput),
          eq(students.email, cleanedInput),
          eq(students.parentEmail, cleanedInput),
          eq(students.studentId, cleanedInput)
        )
      );
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error looking up student:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getStudentFees(studentId) {
  try {
    // First get the fees with their basic info
    const feesResult = await db
      .select({
        id: studentFees.id,
        amount: studentFees.amount,
        due_date: studentFees.dueDate,
        isPaid: studentFees.isPaid,
        academicYear: academicYears.year,
        termName: academicTerms.name,
        feeTypeName: feeTypes.name
      })
      .from(studentFees)
      .leftJoin(feeTypes, eq(studentFees.feeTypeId, feeTypes.id))
      .leftJoin(academicYears, eq(studentFees.academicYearId, academicYears.id))
      .leftJoin(academicTerms, eq(studentFees.academicTermId, academicTerms.id))
      .where(eq(studentFees.studentId, studentId));

    // Calculate paid amounts for each fee
    const result = [];
    for (const fee of feesResult) {
      // Get total paid amount for this fee
      const paidResult = await db
        .select({
          totalPaid: paymentItems.amount
        })
        .from(paymentItems)
        .where(eq(paymentItems.studentFeeId, fee.id));
      
      const totalPaid = paidResult.reduce((sum, item) => {
        return sum + parseFloat(item.totalPaid || 0);
      }, 0);

      result.push({
        id: fee.id,
        amount: parseFloat(fee.amount),
        due_date: fee.due_date,
        paid_amount: totalPaid,
        academic_year: fee.academicYear,
        term_name: fee.termName,
        fee_types: {
          name: fee.feeTypeName
        }
      });
    }
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error getting student fees:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getStudentPayments(studentId) {
  try {
    const result = await db
      .select()
      .from(payments)
      .where(eq(payments.studentId, studentId))
      .orderBy(desc(payments.paymentDate));
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error getting student payments:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Financial data operations
export async function getFeeTypes() {
  try {
    const result = await db
      .select()
      .from(feeTypes)
      .where(eq(feeTypes.isActive, true));
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error getting fee types:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getAcademicYears() {
  try {
    const result = await db
      .select()
      .from(academicYears)
      .where(eq(academicYears.isActive, true));
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error getting academic years:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getAcademicTerms() {
  try {
    const result = await db
      .select({
        id: academicTerms.id,
        name: academicTerms.name,
        academicYearId: academicTerms.academicYearId,
        academicYear: academicYears.year
      })
      .from(academicTerms)
      .leftJoin(academicYears, eq(academicTerms.academicYearId, academicYears.id))
      .where(eq(academicTerms.isActive, true));
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error getting academic terms:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Add new student fee
export async function addStudentFee({ studentId, feeTypeId, academicYearId, academicTermId, amount, dueDate }) {
  try {
    const result = await db
      .insert(studentFees)
      .values({
        studentId: studentId,
        feeTypeId: feeTypeId,
        academicYearId: academicYearId,
        academicTermId: academicTermId,
        amount: amount.toString(),
        dueDate: new Date(dueDate),
        isPaid: false
      })
      .returning({ id: studentFees.id });

    return {
      success: true,
      data: result[0]
    };
  } catch (error) {
    console.error('Error adding student fee:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Payment operations
export async function makePayment({ studentId, items, total, receiptDetails }) {
  try {
    // Start a transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // Create the payment record
      const paymentResult = await tx
        .insert(payments)
        .values({
          studentId: studentId,
          amount: total.toString(),
          paymentMethod: 'online',
          status: 'completed',
          receiptSentToEmail: receiptDetails?.email,
          receiptSentToWhatsapp: receiptDetails?.whatsapp
        })
        .returning({ id: payments.id });
      
      const paymentId = paymentResult[0].id;
      
      // Create payment items for each fee being paid
      for (const item of items) {
        await tx
          .insert(paymentItems)
          .values({
            paymentId: paymentId,
            studentFeeId: item.id,
            amount: item.amount.toString()
          });
        
        // Mark the student fee as paid
        await tx
          .update(studentFees)
          .set({ isPaid: true })
          .where(eq(studentFees.id, item.id));
      }
      
      return { paymentId };
    });
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error making payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
}