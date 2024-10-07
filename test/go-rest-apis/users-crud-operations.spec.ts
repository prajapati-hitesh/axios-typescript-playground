import { faker } from '@faker-js/faker';
import axios from 'axios';
import { expect } from 'chai';
import { before } from 'mocha';


describe('Go Rest API: /users CRUD & GET operation', () => {
    describe.skip('GET Operations', () => {
        it('GET /users should return all the users (using axios.get)', async () => {
            const response = await axios.get('https://gorest.co.in/public/v2/users')
            console.log(`Response Status Code: ${response.status}`);
            expect(response.status).to.equal(200);
        });

        it('GET /users should return all the users (using axios config)', async () => {
            const response = await axios({
                url: 'https://gorest.co.in/public/v2/users',
                method: 'get',
                params: {
                    status: 'active'
                }
            });
            console.log(`[${response.config.method} ${JSON.stringify(response.config.params, null, 2)} | ${response.status}]`);
            console.log(JSON.stringify(response.data, null, 2))
            response.data.forEach((res: { email: any; }) => {
                console.log(`Email : ${res.email}`);
            })

        });

    });

    describe.only('/users CRUD Operations', () => {
        let requestBody: User = {}
        let userId!: number;
        before(async () => {
            const gender = faker.helpers.arrayElement(['male', 'female']);
            requestBody = {
                "name": faker.person.fullName({ sex: gender }),
                "email": faker.internet.email({ provider: 'rdbatch.com' }),
                "gender": gender,
                "status": faker.helpers.arrayElement(['active', 'inactive'])
            };
            console.log(`\nRequest Body: ${JSON.stringify(requestBody, null, 2)}`);
        })

        it('@user [POST] /users : Add random user', async () => {
            const response = await axios({
                method: 'post',
                url: 'https://gorest.co.in/public/v2/users',
                headers: {
                    Authorization: `Bearer 28ddc11b3729350a49339d06f5f6c4071b2c76ad9dcd0a2a4c60b2696c52d45b`,
                    "Content-Type": 'application/json'
                },
                data: requestBody
            });

            // validate status code
            expect(response.status).to.equal(201);
            // get the user id from response
            requestBody.id = response.data.id;
            userId = response.data.id;
            console.log(`\n User Id: ${requestBody.id}`);

            expect(response.data).to.haveOwnProperty('id');
            expect(response.data.id).to.be.a('number');
            expect(response.data).to.include(requestBody);
        });

        it(`@user [GET] /users/${userId} : Validate user details`, async () => {
            const response = await axios({
                method: 'get',
                url: `https://gorest.co.in/public/v2/users/${userId}`,
                headers: {
                    Authorization: `Bearer 28ddc11b3729350a49339d06f5f6c4071b2c76ad9dcd0a2a4c60b2696c52d45b`
                }
            });

            expect(response.status).to.equal(200);
            expect(response.data).to.include(requestBody);
        });

        it(`[DELETE] /users/${userId} : Delete a user`, async () => {
            const response = await axios({
                method: 'delete',
                url: `https://gorest.co.in/public/v2/users/${userId}`,
                headers: {
                    Authorization: `Bearer 28ddc11b3729350a49339d06f5f6c4071b2c76ad9dcd0a2a4c60b2696c52d45b`
                }
            });

            expect(response.status).to.equal(204);
        })

        it.skip(`[GET] /users/${userId} : Validate that the user is deleted`, async () => {
            const response = await axios({
                method: 'get',
                url: `https://gorest.co.in/public/v2/users/7444923`,
                headers: {
                    Authorization: `Bearer 28ddc11b3729350a49339d06f5f6c4071b2c76ad9dcd0a2a4c60b2696c52d45b`
                }
            });
            console.log(JSON.stringify(response.data));
            // expect(response.status).to.equal(404);
        });
    });

});


export interface User {
    id?: number | unknown;
    name?: string;
    email?: string;
    gender?: string;
    status?: string;
}