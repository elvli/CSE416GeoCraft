const request = require('supertest');
const app = require('./server'); // Import your Express app
const mongoose = require('mongoose');
const User = mongoose.model('User'); // Import the User model
const URI = "mongodb+srv://geocraftcluster:geomapss@geocraftdb.7izyqmj.mongodb.net/?retryWrites=true&w=majority"

// Sample user data for testing
const sampleUser = {
  name: 'John',
  lastName: 'Doe',
};
jest.setTimeout(20000);
beforeAll(async () => {
  // Connect to the testing database
  require('dotenv').config({ path: './.env' });
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  // Clear the User collection after each test
  await User.deleteMany({});
});


describe('GET /get-users', () => {
  it('should return an empty array when there are no users', async () => {
    const response = await request(app).get('/get-users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return an array of users when there are users in the database', async () => {
    // Create a sample user in the database
    await User.create(sampleUser);

    const response = await request(app).get('/get-users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: sampleUser.name,
          lastName: sampleUser.lastName,
        }),
      ])
    );
  });
});

describe('POST /create', () => {
  it('should create a new user and return it', async () => {
    const response = await request(app)
      .post('/create')
      .send(sampleUser);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: sampleUser.name,
        lastName: sampleUser.lastName,
      })
    );
  });
  
  afterAll(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
  });
});
