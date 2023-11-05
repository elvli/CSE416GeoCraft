const Test = require('../models/test-model')

createTestString = async (req, res) => {
    console.log("REGISTERING USER IN BACKEND");

    const body = req.body.testString;
    const newTestString = new Test(body);
    const savedTestString = await newTestString.save();
}

getTests = async (req, res) => { 
    console.log("FINDING TEST STRINGS IN THE BACKEND")
    Test.find()
}

// createTestString = async (req, res) => {
//     console.log("REGISTERING USER IN BACKEND");
    
//     try {
//         const body = req.body.testString;
//         const newTestString = new Test(body);
//         const savedTestString = await newTestString.save();
//         console.log("new savedTestString saved: " + savedTestString._id);

//         return res
//                 .status(200);

//     } catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// }

// getTests = async (req, res) => {
//     console.log("Find Test with id: " + JSON.stringify(req.params.id));

//     await Playlist.findById({ _id: req.params.id }, (err, list) => {
//         if (err) {
//             return res.status(400).json({ success: false, error: err });
//         }
//         console.log("Found list: " + JSON.stringify(list));

//         // DOES THIS LIST BELONG TO THIS USER?
//         async function asyncFindUser(list) {
//             await User.findOne({ email: list.ownerEmail }, (err, user) => {
//                 return res.status(200).json({ success: true, playlist: list })
//             });
//         }
//         asyncFindUser(list);
//     }).catch(err => console.log(err))
// }

// createTestString = (req, res) => {
//     console.log("CREATING TEST STRING IN BACKEND")

//     try {
//         if (auth.verifyUser(req) === null) {
//             return res.status(400).json({
//                 errorMessage: 'UNAUTHORIZED'
//             })
//         }
//         const body = req.body;
//         console.log("createPlaylist body: " + JSON.stringify(body));
//         if (!body) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'You must provide a test string',
//             })
//         }

//         const testString = new Test(body);
//         console.log("test string: " + testString.toString());
//         if (!testString) {
//             return res.status(400).json({ success: false, error: err })
//         }

//         const savedTestString = await testString.save();
//         console.log("new user saved: " + savedTestString._id);

//     } catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// } 