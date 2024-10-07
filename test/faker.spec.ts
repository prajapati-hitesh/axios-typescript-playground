import { fakerEO } from '@faker-js/faker';

describe('Faker Suite', () => {
    it('should print first name 10 times', async () => {
        const counter: number = 10;

        for (let i = 0; i < counter; i++) {
            console.log(fakerEO.phone.number({ style: 'international' }));
        }
    })
});
