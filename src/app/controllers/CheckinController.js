import { addDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
    async store(req, res) {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(401).json({ error: 'Invalid student' });
        }

        const searchDate = addDays(new Date(), -7);
        const chekinsLast7Days = await Checkin.findAll({
            where: {
                student_id: student.id,
                created_at: {
                    [Op.between]: [
                        startOfDay(searchDate),
                        endOfDay(new Date()),
                    ],
                },
            },
        });

        if (chekinsLast7Days && chekinsLast7Days.length >= 5) {
            return res.status(401).json({ error: 'Checkin Limit ' });
        }

        const checkin = await Checkin.create({
            student_id: student.id,
        });

        return res.json(checkin);
    }

    async index(req, res) {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(401).json({ error: 'Invalid student' });
        }

        const checkins = await Checkin.findAll({
            where: {
                student_id: student.id,
            },
            attributes: ['created_at', 'id'],
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        return res.json(checkins);
    }
}

export default new CheckinController();
