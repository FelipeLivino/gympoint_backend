import Sequelize, { Model } from 'sequelize';

class Student extends Model {
    static init(sequelize) {
        console.log('Student init ');
        super.init(
            {
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
        console.log('Student end ');

        return this;
    }
}

export default Student;
