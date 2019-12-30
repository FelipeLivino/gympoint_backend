module.exports = {
    up: QueryInterface => {
        return QueryInterface.bulkInsert(
            'students',
            [
                {
                    name: 'Felipe Livino',
                    email: 'felipelivino@gmail.com',
                    idade: 24,
                    peso: 90,
                    altura: 170,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Henrique Livino',
                    email: 'henriquelivino2@gmail.com',
                    idade: 14,
                    peso: 63,
                    altura: 170,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Manoel Messias Livino dos Santos',
                    email: 'manoelmlivino@gmail.com',
                    idade: 54,
                    peso: 70,
                    altura: 173,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Nanci Aparecida da Silva Santos',
                    email: 'nancisantos101@gmail.com',
                    idade: 43,
                    peso: 90,
                    altura: 159,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: () => {},
};
