import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Plan from '../models/Plan';
import User from '../models/User';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

class EnrollmentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.date().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(400).json({
                error: 'You do not have the required permissions assigned',
            });
        }

        const plan = await Plan.findByPk(req.body.plan_id);
        const student = await Student.findByPk(req.body.student_id);
        if (!plan || !student) {
            return res.status(400).json({
                error: 'Plan or Student invalid',
            });
        }

        const enrollmentBody = req.body;
        enrollmentBody.start_date = parseISO(enrollmentBody.start_date);
        enrollmentBody.end_date = addMonths(
            enrollmentBody.start_date,
            plan.duration
        );
        enrollmentBody.price = plan.price * plan.duration;

        const enrollment = await Enrollment.create(enrollmentBody);

        return res.json(enrollment);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.date().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        // get User info
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(400).json({
                error: 'You do not have the required permissions assigned',
            });
        }

        // get Plan and Student Info
        const plan = await Plan.findByPk(req.body.plan_id);
        const student = await Student.findByPk(req.body.student_id);
        if (!plan || !student) {
            return res.status(400).json({
                error: 'Plan or Student invalid',
            });
        }

        // set values from enrollment
        const enrollmentBody = req.body;
        enrollmentBody.start_date = parseISO(enrollmentBody.start_date);
        enrollmentBody.end_date = addMonths(
            enrollmentBody.start_date,
            plan.duration
        );
        enrollmentBody.price = plan.price * plan.duration;

        const enrollment = await Enrollment.findByPk(req.params.id);

        const {
            Id,
            start_date,
            end_date,
            price,
            student_id,
            plan_id,
        } = await enrollment.update(enrollmentBody);

        return res.json({
            Id,
            start_date,
            end_date,
            price,
            student_id,
            plan_id,
        });
    }

    async index(req, res) {
        const { page = 1 } = req.query;

        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(400).json({
                error: 'You do not have the required permissions assigned',
            });
        }

        console.log('------------------------');
        const enrollmentList = await Enrollment.findAll({
            where: {
                canceled_at: null,
            },
            attributes: [
                'id',
                'start_date',
                'end_date',
                'student_id',
                'plan_id',
            ],
            limit: 20,
            offset: (page - 1) * 20,

            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: [
                        'id',
                        'name',
                        'email',
                        'idade',
                        'peso',
                        'altura',
                    ],
                },
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['id', 'title', 'duration', 'price'],
                },
            ],
        });

        return res.json(enrollmentList);
    }

    async delete(req, res) {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(400).json({
                error: 'You do not have the required permissions assigned',
            });
        }

        const enrollment = await Enrollment.findByPk(req.params.id);
        if (!enrollment) {
            return res.status(400).json({
                error: 'Invalid enrollment',
            });
        }

        const {
            Id,
            start_date,
            end_date,
            price,
            student_id,
            plan_id,
            canceled_at,
        } = await enrollment.update({
            canceled_at: new Date(),
        });

        return res.json({
            Id,
            start_date,
            end_date,
            price,
            student_id,
            plan_id,
            canceled_at,
        });
    }
}

export default new EnrollmentController();
