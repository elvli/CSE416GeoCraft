const request = require('supertest');
const app = require('./server');
const mongoose = require('mongoose');

const URI = "mongodb+srv://geocraftcluster:geomapss@geocraftdb.7izyqmj.mongodb.net/?retryWrites=true&w=majority"

jest.setTimeout(20000);
beforeAll(async () => {
    // Connect to the testing database
    require('dotenv').config({ path: './.env' });
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  
  describe('Auth Controller', () => {
    describe('GET /loggedIn', () => {
      it('should return the login screen for an unauthenticated user', async () => {
        const response = await request(app).get('/loggedIn');
        expect(response.status).toBe(200);
        expect(response.body.loggedIn).toBe(false);
        expect(response.body.user).toBe(null);
      });
  
      // Add more tests for authenticated users, different scenarios, etc.
    });
  
    describe('POST /login', () => {
      it('should login a user with valid credentials', async () => {
  
        const response = await request(app)
          .post('/login')
          .send({ email: 'test@example.com', password: 'testpassword' });
  
      });
  
      it('should return an error for invalid credentials', async () => {
        const response = await request(app)
          .post('/login')
          .send({ email: 'invalid@example.com', password: 'invalidpassword' });
  
      });
  
      // Add more tests for edge cases, invalid inputs, etc.
    });
  
    describe('GET /logout', () => {
      it('should log out a user and clear the token cookie', async () => {
  
        const response = await request(app).get('/logout');
        expect(response.status).toBe(200);
        expect(response.header['set-cookie'][0]).toContain('token=;');

      });
    });
  
    describe('POST /register', () => {
      it('should register a new user with valid data', async () => {
        const response = await request(app)
          .post('/register')
          .send({
            firstName: 'New',
            lastName: 'User',
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'newpassword',
            confirmPassword: 'newpassword',
          });
  

      });
  
      it('should return an error for duplicate email or username', async () => {
        // Ensure you have a user with existing email or username in the database
        // ...
  
        const response = await request(app)
          .post('/register')
          .send({
            firstName: 'Duplicate',
            lastName: 'User',
            username: 'existinguser', // Use an existing username
            email: 'existinguser@example.com', // Use an existing email
            password: 'duplicatepassword',
            confirmPassword: 'duplicatepassword',
          });
      });

    });
  });
  

  
  afterAll(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
  });