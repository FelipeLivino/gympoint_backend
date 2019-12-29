import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            idade: Yup.number().required(),
            peso: Yup.number().required(),
            altura: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const studentExist = await Student.findOne({
            where: { email: req.body.email },
        });

        if (studentExist) {
            return res.status(400).json({ error: 'error already exist' });
        }
        const { id, name, email } = await Student.create(req.body);
        return res.json({
            id,
            name,
            email,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            studentid: Yup.number().required(),
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            idade: Yup.number().required(),
            peso: Yup.number().required(),
            altura: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { studentid, email } = req.body;
        const student = await Student.findByPk(studentid);

        if (email !== student.email) {
            const studentExist = await Student.findOne({
                where: { email: req.body.email },
            });
            if (studentExist) {
                return res.status(400).json({ error: 'error already exist' });
            }
        }
        console.log('req.body', req.body);
        const { name } = await student.update(req.body);

        return res.json({
            id: studentid,
            name,
            email,
        });
    }
}

export default new StudentController();
