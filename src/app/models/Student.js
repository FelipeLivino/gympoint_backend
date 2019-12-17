import Sequelize, { Model } from 'sequelize';

class Student extends Model {
    static init(sequelize) {
        super.init(
            {
                studentid: Sequelize.VIRTUAL,
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                idade: Sequelize.INTEGER,
                peso: Sequelize.INTEGER,
                altura: Sequelize.INTEGER,
            },
            {
                sequelize,
            }
        );

        // this.addHook('beforeSave', async student => {
        //     if (student.studentid) student.id = student.studentid;
        // });

        return this;
    }
}

export default Student;
