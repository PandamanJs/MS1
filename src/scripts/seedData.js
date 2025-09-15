import { db } from '../lib/db.js';
import { students, academicYears, academicTerms, feeTypes, studentFees } from '../lib/schema.js';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Insert academic years
    const academicYearResult = await db.insert(academicYears)
      .values([
        { year: '2024', isActive: true },
        { year: '2025', isActive: true }
      ])
      .returning({ id: academicYears.id });

    console.log('Academic years created:', academicYearResult);

    // Insert academic terms
    const academicTermResult = await db.insert(academicTerms)
      .values([
        { name: 'Term 1', academicYearId: academicYearResult[0].id, isActive: true },
        { name: 'Term 2', academicYearId: academicYearResult[0].id, isActive: true },
        { name: 'Term 3', academicYearId: academicYearResult[0].id, isActive: true }
      ])
      .returning({ id: academicTerms.id });

    console.log('Academic terms created:', academicTermResult);

    // Insert fee types
    const feeTypeResult = await db.insert(feeTypes)
      .values([
        { name: 'Tuition Fee', description: 'Quarterly tuition payment', amount: '2500.00', isActive: true },
        { name: 'Activity Fee', description: 'Sports and extra-curricular activities', amount: '150.00', isActive: true },
        { name: 'Library Fee', description: 'Library usage and book rental', amount: '50.00', isActive: true },
        { name: 'Transport Fee', description: 'School bus transportation', amount: '300.00', isActive: true }
      ])
      .returning({ id: feeTypes.id });

    console.log('Fee types created:', feeTypeResult);

    // Insert sample students
    const studentResult = await db.insert(students)
      .values([
        {
          firstName: 'John',
          lastName: 'Mwamba',
          email: 'john.mwamba@email.com',
          phone: '+260971234567',
          studentId: 'TEC001',
          parentEmail: 'parent.mwamba@email.com',
          parentPhone: '+260977654321'
        },
        {
          firstName: 'Sarah',
          lastName: 'Banda',
          email: 'sarah.banda@email.com',
          phone: '+260971234568',
          studentId: 'TEC002',
          parentEmail: 'parent.banda@email.com',
          parentPhone: '+260977654322'
        },
        {
          firstName: 'Michael',
          lastName: 'Tembo',
          email: 'michael.tembo@email.com',
          phone: '+260971234569',
          studentId: 'TEC003',
          parentEmail: 'parent.tembo@email.com',
          parentPhone: '+260977654323'
        }
      ])
      .returning({ id: students.id });

    console.log('Students created:', studentResult);

    // Insert student fees
    const feeAmounts = ['2500.00', '150.00', '50.00', '300.00'];
    const studentFeeData = [];
    studentResult.forEach(student => {
      feeTypeResult.forEach((feeType, index) => {
        studentFeeData.push({
          studentId: student.id,
          feeTypeId: feeType.id,
          academicYearId: academicYearResult[0].id,
          academicTermId: academicTermResult[0].id, // Term 1
          amount: feeAmounts[index],
          dueDate: new Date('2025-01-31'),
          isPaid: false
        });
      });
    });

    const studentFeeResult = await db.insert(studentFees)
      .values(studentFeeData)
      .returning({ id: studentFees.id });

    console.log('Student fees created:', studentFeeResult.length, 'records');

    console.log('Database seeding completed successfully!');
    
    return {
      success: true,
      message: 'Database seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      error: error.message
    };
  }
}