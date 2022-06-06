// //@ts-check
// const { describe, expect, it, beforeEach } = require("@jest/globals");
// const request = require("axios").default;

// const URL = "http://localhost:8080";
// const axios = request.create({
//   baseURL: URL,
// });

// describe("auth tests", function () {
//   beforeEach(async function () {
//     //   clear db before every test so that prev data doesn't affect test cases
//     await axios.post("/db", { users: [] });
//   });

//   it("should create a new user", async () => {
//     const { data: db } = await axios.get("/db");
//     expect(db.users).toEqual([]);

//     const { data: createVoter, status } = await axios.post("/user/create", {
//       name: "John Doe",
//       age: 20,
//       username: "john",
//       password: "1234",
//     });

//     expect(createVoter.status).toBe("user created");
//     expect(status).toBe(201);

//     const { data: voter } = await axios.get(`/user/${createVoter.id}`);
//     expect(voter.id).toBe(createVoter.id);
//     expect(voter.name).toBe("John Doe");
//     expect(voter.age).toBe(20);

//     const { data: createCandidate } = await axios.post("/user/create", {
//       name: "Donald Trump",
//       age: 55,
//       votes: 0,
//       party: "democrats",
//     });

//     expect(createCandidate.status).toBe("user created");

//     const { data: candidate } = await axios.get(`/user/${createCandidate.id}`);
//     expect(candidate.id).toBe(createCandidate.id);
//     expect(candidate.name).toBe("Donald Trump");
//     expect(candidate.age).toBe(55);
//     expect(candidate.party).toBe("democrats");
//   });

//   it("routes should not be available if user is logged in", async function () {
//     await axios
//       .post("/user/create", {
//         name: "John Doe",
//         age: 20,
//         username: "john",
//         password: "1234",
//       })
//       .catch(console.error);

//     try {
//       const data = await axios.get("/votes/count/Donald Trump");
//     } catch (e) {
//       expect(e.response.status).toBe(401);
//       expect(e.response.data.status).toBe("Unauthorized");
//     }
//   });

//   it("should be able to log user in", async function () {
//     await axios
//       .post("/user/create", {
//         name: "John Doe",
//         age: 20,
//         username: "john",
//         password: "1234",
//       })
//       .catch(console.error);

//     try {
//       await axios.get("/votes/count/Donald Trump");
//     } catch (e) {
//       expect(e.response.status).toBe(401);
//       expect(e.response.data.status).toBe("Unauthorized");
//     }

//     const {
//       data: { token },
//     } = await axios.post("/user/login", { username: "john", password: "1234" });
//     expect(typeof token).toBe("string");
//     expect(token.length).toBeGreaterThan(2);
//   });

//   it("should be able to access protected endpoints after logging in", async function () {
//     await axios
//       .post("/user/create", {
//         name: "John Doe",
//         age: 20,
//         username: "john",
//         password: "1234",
//       })
//       .catch(console.error);

//     await axios.post("/user/create", {
//       name: "Donald Trump",
//       age: 55,
//       votes: 0,
//       party: "democrats",
//     });

//     try {
//       await axios.get("/votes/count/Donald Trump");
//     } catch (e) {
//       expect(e.response.status).toBe(401);
//       expect(e.response.data.status).toBe("Unauthorized");
//     }

//     const {
//       data: { token },
//     } = await axios.post("/user/login", { username: "john", password: "1234" });
//     expect(typeof token).toBe("string");
//     expect(token.length).toBeGreaterThan(2);

//     const {
//       data: { status: votes },
//     } = await axios.get("/votes/count/Donald Trump", {
//       params: { apiKey: token },
//     });
//     expect(votes).toBe(0);
//   });

//   it("should return cannot find user", async function () {
//     await axios
//       .post("/user/create", {
//         name: "John Doe",
//         age: 20,
//         username: "john",
//         password: "1234",
//       })
//       .catch(console.error);

//     await axios.post("/user/create", {
//       name: "Donald Trump",
//       age: 55,
//       votes: 0,
//       party: "democrats",
//     });

//     try {
//       const data = await axios.get("/votes/count/Donald Trump");
//     } catch (e) {
//       expect(e.response.status).toBe(401);
//       expect(e.response.data.status).toBe("Unauthorized");
//     }

//     const {
//       data: { token },
//     } = await axios.post("/user/login", { username: "john", password: "1234" });
//     expect(typeof token).toBe("string");
//     expect(token.length).toBeGreaterThan(2);

//     try {
//       await axios.get("/votes/count/Donald Trump", {
//         params: { apiKey: token },
//       });
//     } catch (err) {
//       expect(err.response.status).toBe(404);
//       expect(err.response.data.status).toBe("cannot find user");
//     }
//   });

//   it("should be able to vote a user successfully", async function () {
//     await axios
//       .post("/user/create", {
//         name: "John Doe",
//         age: 20,
//         username: "john",
//         password: "1234",
//       })
//       .catch(console.error);

//     const {
//       data: { id: candidateID },
//     } = await axios.post("/user/create", {
//       name: "Donald Trump",
//       age: 55,
//       votes: 0,
//       party: "democrats",
//     });

//     try {
//       await axios.get("/votes/count/Donald Trump");
//     } catch (e) {
//       expect(e.response.status).toBe(401);
//       expect(e.response.data.status).toBe("Unauthorized");
//     }

//     const {
//       data: { token },
//     } = await axios.post("/user/login", { username: "john", password: "1234" });
//     expect(typeof token).toBe("string");
//     expect(token.length).toBeGreaterThan(2);

//     const { data: votesCountBefore } = await axios.get(`/user/${candidateID}`);
//     expect(votesCountBefore.votes).toBe(0);

//     const {
//       data: { status },
//     } = await axios.post(
//       "/votes/vote/Donald Trump",
//       {},
//       { params: { apiKey: token } }
//     );
//     expect(status).toBe("voted user succesfully");

//     const { data: votesCountAfter } = await axios.get(`/user/${candidateID}`);

//     expect(votesCountAfter.votes).toBe(1);

//     await axios.post(
//       "/votes/vote/Donald Trump",
//       {},
//       { params: { apiKey: token } }
//     );

//     const { data: votesCountAfter2 } = await axios.get(`/user/${candidateID}`);
//     expect(votesCountAfter2.votes).toBe(2);
//   });

//   it("should return list of voters", async function () {
//     const {
//       data: { id: firstId },
//     } = await axios.post("/user/create", {
//       name: "John Doe",
//       age: 20,
//       role: "voter",
//       username: "john",
//       password: "1234",
//     });

//     const {
//       data: { id: secondId },
//     } = await axios.post("/user/create", {
//       name: "Jenna Doe",
//       age: 27,
//       role: "voter",
//       username: "jenna",
//       password: "8888",
//     });

//     await axios.post("/user/create", {
//       name: "Barrack Obama",
//       age: 44,
//       role: "candidate",
//       votes: 0,
//       party: "republicans",
//     });

//     const {
//       data: { token },
//     } = await axios.post("/user/login", {
//       username: "jenna",
//       password: "8888",
//     });

//     const { data: list } = await axios.get("/votes/voters", {
//       params: { apiKey: token },
//     });
//     expect(list.length).toBe(2);
//     expect(list[0]).toEqual({
//       id: firstId,
//       name: "John Doe",
//       age: 20,
//       role: "voter",
//       username: "john",
//       password: "1234",
//     });
//     expect(list[1]).toEqual({
//       id: secondId,
//       name: "Jenna Doe",
//       role: "voter",
//       age: 27,
//       token,
//       username: "jenna",
//       password: "8888",
//     });
//   });

//   it("get list of all candidates by party", async function () {
//     await axios.post("/user/create", {
//       name: "Barrack Obama",
//       age: 44,
//       role: "candidate",
//       votes: 0,
//       party: "republicans",
//     });

//     await axios.post("/user/create", {
//       name: "Michelle Obama",
//       age: 42,
//       role: "candidate",
//       votes: 0,
//       party: "republicans",
//     });

//     await axios.post("/user/create", {
//       name: "Joe Biden",
//       age: 42,
//       role: "candidate",
//       votes: 0,
//       party: "republicans",
//     });

//     await axios.post("/user/create", {
//       name: "Donald Trump",
//       age: 42,
//       role: "candidate",
//       votes: 0,
//       party: "democrats",
//     });

//     await axios.post("/user/create", {
//       name: "Peter Stronghold",
//       age: 42,
//       role: "candidate",
//       votes: 0,
//       party: "democrats",
//     });

//     const { data: democratsList } = await axios.get("/votes/party/democrats", {
//       params: { apiKey: "1j1cahj123" },
//     });

//     const { data: republicansList } = await axios.get(
//       "/votes/party/republicans",
//       {
//         params: { apiKey: "1j1cahj123" },
//       }
//     );

//     expect(democratsList.length).toBe(2);
//     expect(republicansList.length).toBe(3);
//   });

//   it("should log user out", async function () {
//     const { data: db } = await axios.get("/db");

//     const { data: createUser } = await axios.post("/user/create", {
//       name: "Jenna Doe",
//       age: 27,
//       role: "voter",
//       username: "jenna",
//       password: "8888",
//     });

//     const {
//       data: { token },
//     } = await axios.post("/user/login", {
//       username: "jenna",
//       password: "8888",
//     });

//     const { data: user } = await axios.get(`/user/${createUser.id}`);
//     expect(user.token.length).toBeGreaterThan(1);
//     expect(typeof user.token).toBe("string");
//     expect(user.token).toBe(token);
//   });
// });
