import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(e => ({
                field: e.path,
                message: e.msg
            }))
        });
    }
    next();
};

// Auth validations
export const validateRegister = [
    body('fname').trim().notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),
    body('lname').trim().notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidation
];

export const validateLogin = [
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation
];

// Student validations
export const validateStudent = [
    body('first_name').trim().notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),
    body('last_name').trim().notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),
    body('email').optional({ nullable: true }).isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('nationality').trim().notEmpty().withMessage('Nationality is required'),
    body('class_id').optional({ nullable: true }).isUUID().withMessage('Invalid class ID'),
    body('trade_id').optional({ nullable: true }).isUUID().withMessage('Invalid trade ID'),
    body('gender').optional({ nullable: true }).isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('phone').optional({ nullable: true }).isMobilePhone().withMessage('Invalid phone number'),
    body('date_of_birth').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
    handleValidation
];

// Teacher validations
export const validateTeacher = [
    body('trade_id').optional({ nullable: true }).isUUID().withMessage('Invalid trade ID'),
    body('user_id').optional({ nullable: true }).isUUID().withMessage('Invalid user ID'),
    handleValidation
];

// Class validations
export const validateClass = [
    body('name').trim().notEmpty().withMessage('Class name is required')
        .isLength({ min: 1, max: 100 }).withMessage('Class name must be 1-100 characters'),
    body('level').trim().notEmpty().withMessage('Level is required'),
    body('capacity').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
    body('trade_id').optional({ nullable: true }).isUUID().withMessage('Invalid trade ID'),
    handleValidation
];

// Subject validations
export const validateSubject = [
    body('name').trim().notEmpty().withMessage('Subject name is required')
        .isLength({ min: 1, max: 100 }).withMessage('Subject name must be 1-100 characters'),
    body('code').trim().notEmpty().withMessage('Subject code is required')
        .isLength({ min: 1, max: 20 }).withMessage('Subject code must be 1-20 characters'),
    body('weight').optional({ nullable: true }).isNumeric().withMessage('Weight must be a number'),
    body('trade_id').optional({ nullable: true }).isUUID().withMessage('Invalid trade ID'),
    body('class_id').optional({ nullable: true }).isUUID().withMessage('Invalid class ID'),
    handleValidation
];

// Trade validations
export const validateTrade = [
    body('name').trim().notEmpty().withMessage('Trade name is required')
        .isLength({ min: 1, max: 50 }).withMessage('Trade name must be 1-50 characters'),
    body('code').trim().notEmpty().withMessage('Trade code is required')
        .isLength({ min: 1, max: 50 }).withMessage('Trade code must be 1-50 characters'),
    handleValidation
];

// Academic Year validations
export const validateAcademicYear = [
    body('name').trim().notEmpty().withMessage('Academic year name is required'),
    body('start_date').notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Invalid start date format'),
    body('end_date').notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('Invalid end date format'),
    handleValidation
];

// Term validations
export const validateTerm = [
    body('name').trim().notEmpty().withMessage('Term name is required'),
    body('academic_year_id').notEmpty().withMessage('Academic year is required')
        .isUUID().withMessage('Invalid academic year ID'),
    body('start_date').optional({ nullable: true }).isISO8601().withMessage('Invalid start date format'),
    body('end_date').optional({ nullable: true }).isISO8601().withMessage('Invalid end date format'),
    handleValidation
];

// Assessment validations
export const validateAssessment = [
    body('title').trim().notEmpty().withMessage('Assessment title is required')
        .isLength({ min: 1, max: 150 }).withMessage('Title must be 1-150 characters'),
    body('total_marks').notEmpty().withMessage('Total marks is required')
        .isNumeric().withMessage('Total marks must be a number'),
    body('subject_id').notEmpty().withMessage('Subject is required')
        .isUUID().withMessage('Invalid subject ID'),
    body('teacher_id').notEmpty().withMessage('Teacher is required')
        .isUUID().withMessage('Invalid teacher ID'),
    body('term_id').notEmpty().withMessage('Term is required')
        .isUUID().withMessage('Invalid term ID'),
    body('trade_id').optional({ nullable: true }).isUUID().withMessage('Invalid trade ID'),
    handleValidation
];

// Mark validations
export const validateMark = [
    body('student_id').notEmpty().withMessage('Student is required')
        .isUUID().withMessage('Invalid student ID'),
    body('assessment_id').notEmpty().withMessage('Assessment is required')
        .isUUID().withMessage('Invalid assessment ID'),
    body('marks').notEmpty().withMessage('Marks is required')
        .isNumeric().withMessage('Marks must be a number'),
    body('teacher_id').optional({ nullable: true }).isUUID().withMessage('Invalid teacher ID'),
    body('trade_id').optional({ nullable: true }).isUUID().withMessage('Invalid trade ID'),
    handleValidation
];

// Attendance validations
export const validateAttendance = [
    body('student_id').notEmpty().withMessage('Student is required')
        .isUUID().withMessage('Invalid student ID'),
    body('attendance_date').notEmpty().withMessage('Attendance date is required')
        .isISO8601().withMessage('Invalid date format'),
    body('status').notEmpty().withMessage('Status is required')
        .isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'UNEXCUSED', 'EARLY_LEAVE', 'HALF_DAY', 'SICK', 'ON_LEAVE', 'SUSPENDED', 'NOT_MARKED'])
        .withMessage('Invalid attendance status'),
    body('teacher_id').optional({ nullable: true }).isUUID().withMessage('Invalid teacher ID'),
    body('class_id').optional({ nullable: true }).isUUID().withMessage('Invalid class ID'),
    body('term_id').optional({ nullable: true }).isUUID().withMessage('Invalid term ID'),
    body('subject_id').optional({ nullable: true }).isUUID().withMessage('Invalid subject ID'),
    body('trade_id').optional({ nullable: true }).isUUID().withMessage('Invalid trade ID'),
    handleValidation
];

// Grading System validations
export const validateGrade = [
    body('grade').trim().notEmpty().withMessage('Grade is required')
        .isLength({ min: 1, max: 5 }).withMessage('Grade must be 1-5 characters'),
    body('min_mark').notEmpty().withMessage('Minimum mark is required')
        .isNumeric().withMessage('Minimum mark must be a number'),
    body('max_mark').notEmpty().withMessage('Maximum mark is required')
        .isNumeric().withMessage('Maximum mark must be a number'),
    body('remarks').optional({ nullable: true }).trim(),
    handleValidation
];

// Report Card validations
export const validateReportCard = [
    body('student_id').notEmpty().withMessage('Student is required')
        .isUUID().withMessage('Invalid student ID'),
    body('term_id').notEmpty().withMessage('Term is required')
        .isUUID().withMessage('Invalid term ID'),
    body('trade_id').optional({ nullable: true }).isUUID().withMessage('Invalid trade ID'),
    body('teacher_comment').optional({ nullable: true }).trim(),
    handleValidation
];

// Promotion validations
export const validatePromotion = [
    body('student_id').notEmpty().withMessage('Student is required')
        .isUUID().withMessage('Invalid student ID'),
    body('from_class').notEmpty().withMessage('From class is required')
        .isUUID().withMessage('Invalid from class ID'),
    body('to_class').notEmpty().withMessage('To class is required')
        .isUUID().withMessage('Invalid to class ID'),
    body('academic_year_id').notEmpty().withMessage('Academic year is required')
        .isUUID().withMessage('Invalid academic year ID'),
    body('status').optional({ nullable: true }).isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Invalid status'),
    body('trade_id').optional({ nullable: true }).isUUID().withMessage('Invalid trade ID'),
    handleValidation
];

// Teacher Allocation validations
export const validateTeacherAllocation = [
    body('teacher_id').notEmpty().withMessage('Teacher is required')
        .isUUID().withMessage('Invalid teacher ID'),
    body('subject_id').notEmpty().withMessage('Subject is required')
        .isUUID().withMessage('Invalid subject ID'),
    body('class_id').notEmpty().withMessage('Class is required')
        .isUUID().withMessage('Invalid class ID'),
    body('trade_id').notEmpty().withMessage('Trade is required')
        .isUUID().withMessage('Invalid trade ID'),
    handleValidation
];

// User Role Change validations
export const validateRoleChange = [
    body('role_id').notEmpty().withMessage('Role ID is required')
        .isUUID().withMessage('Invalid role ID'),
    handleValidation
];

// UUID param validation
export const validateUUIDParam = [
    param('id').isUUID().withMessage('Invalid ID format'),
    handleValidation
];

// Table param validation
export const validateTableParam = [
    param('table').isIn([
        'students', 'teachers', 'classes', 'subjects',
        'academic_years', 'attendance', 'assessments',
        'trade', 'roles', 'database_backups', 'users',
        'report_cards', 'student_promotions', 'terms',
        'teacher_subjects', 'grading_system', 'marks',
        'notifications'
    ]).withMessage('Invalid table name'),
    handleValidation
];
