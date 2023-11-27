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

  describe('User Registration', () => {
    it('should register a sample user', async () => {
      const sampleUserData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'securePassword',
        confirmPassword: 'securePassword',
      };
    });
  });

  describe('User Login', () => {
    // Assuming you have a test user with the following credentials
    const existingUserCredentials = {
      email: 'elvenli54@gmail.com',
      password: '123123123',
    };
  
    it('should login with existing user credentials', async () => {
      // Perform the login request using the existing user's credentials
      const response = await request(app)
        .post('/login')
        .send(existingUserCredentials);
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

  describe('Map Controller', () => {
    const {
      createMap,
      deleteMap,
      getMapById,
      getMapPairs,
      getMaps,
      updateMap,
      updateUserFeedback,
      getPublishedMaps,
    } = require('./controllers/map-controller');
  
    // Mock data for testing
    const mockMap = {
      // Add relevant map data
      name: 'Sample Map',
      ownerEmail: 'test@example.com',
    };
  
    describe('POST /createMap', () => {
      it('should create a new map', async () => {
        const response = await request(app).post('/createMap').send(mockMap);
      });
    });
  
    describe('GET /getMapById/:id', () => {
      it('should return a map by ID', async () => {
        const response = await request(app).get(`/getMapById/`);
      });
  
      it('should return a 404 status for a non-existent map', async () => {
        const response = await request(app).get('/getMapById/nonexistentid');
      });
    });

  });

  describe('Map Interaction', () => {
    let authToken; // Store the authentication token obtained during login
  
  
    it('should like a map', async () => {
      const mapId = 'your_map_id'; // Provide a valid map ID from your database
  
      const response = await request(app)
        .post(`/maps/${mapId}/like`)
        .set('Authorization', `Bearer ${authToken}`);
  
    });
  
    it('should dislike a map', async () => {
      const mapId = 'your_map_id'; // Provide a valid map ID from your database
  
      const response = await request(app)
        .post(`/maps/${mapId}/dislike`)
        .set('Authorization', `Bearer ${authToken}`);
    });
  
    it('should add a comment to a map', async () => {
      const mapId = 'your_map_id'; // Provide a valid map ID from your database
      const commentData = { text: 'This is a test comment' };
  
      const response = await request(app)
        .post(`/maps/${mapId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData);
  
    });
  
    it('should update a comment on a map', async () => {
      const mapId = 'your_map_id'; // Provide a valid map ID from your database
      const commentId = 'your_comment_id'; // Provide a valid comment ID from your database
      const updatedCommentData = { text: 'Updated test comment' };
  
      const response = await request(app)
        .put(`/maps/${mapId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedCommentData);
    });
  
    it('should delete a comment from a map', async () => {
      const mapId = 'your_map_id'; // Provide a valid map ID from your database
      const commentId = 'your_comment_id'; // Provide a valid comment ID from your database
  
      const response = await request(app)
        .delete(`/maps/${mapId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`);
    });
  });
  
  

  
  afterAll(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
    await mongoose.disconnect();
  });