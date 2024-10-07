import { faker } from '@faker-js/faker';
import axios from 'axios';
import { expect } from 'chai';

const dataGenerationCounter = 5;

let randomDataArray = []

for (let i = 0; i < dataGenerationCounter; i++) {
    const gender = faker.helpers.arrayElement(['male', 'female']);
    const reqBody = {
        "name": faker.person.fullName({ sex: gender }),
        "email": faker.internet.email({ provider: 'rdbatch.com' }),
        "gender": gender,
        "status": faker.helpers.arrayElement(['active', 'inactive'])
    };
    randomDataArray.push(reqBody);
}

console.log(JSON.stringify(randomDataArray, null, 2));

//data driven testing
randomDataArray.forEach(eachData => {
    describe('Go Rest API: /users CRUD & GET operation', () => {
        let userId!: number;
        before(() => {
            console.log(`\nRequest Body: ${JSON.stringify(eachData, null, 2)}`);
        })

        it(`[POST] /users : Add random user [${eachData.name}]`, async () => {
            const response = await axios({
                method: 'post',
                url: 'https://gorest.co.in/public/v2/users',
                headers: {
                    Authorization: `Bearer 28ddc11b3729350a49339d06f5f6c4071b2c76ad9dcd0a2a4c60b2696c52d45b`,
                    "Content-Type": 'application/json'
                },
                data: eachData
            });

            // validate status code
            expect(response.status).to.equal(201);
            // get the user id from response
            userId = response.data.id;
            console.log(`\nUser Id: ${userId}`);

            expect(response.data).to.haveOwnProperty('id');
            expect(response.data.id).to.be.a('number');
            expect(response.data).to.include(eachData);
        });

        it(`[GET] /users/${userId} : Validate user details [${eachData.name}]`, async () => {
            const response = await axios({
                method: 'get',
                url: `https://gorest.co.in/public/v2/users/${userId}`,
                headers: {
                    Authorization: `Bearer 28ddc11b3729350a49339d06f5f6c4071b2c76ad9dcd0a2a4c60b2696c52d45b`
                }
            });

            expect(response.status).to.equal(200);
            expect(response.data).to.include(eachData);
        });

        it(`[DELETE] /users/${userId} : Delete a user [${eachData.name}]`, async () => {
            const response = await axios({
                method: 'delete',
                url: `https://gorest.co.in/public/v2/users/${userId}`,
                headers: {
                    Authorization: `Bearer 28ddc11b3729350a49339d06f5f6c4071b2c76ad9dcd0a2a4c60b2696c52d45b`
                }
            });

            expect(response.status).to.equal(204);
        })
    });
})


