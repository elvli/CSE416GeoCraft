const Map = require('../models/map-model')
const User = require('../models/user-model');
const auth = require('../auth')

createMap = (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: 'UNAUTHORIZED'
    })
  }
  const body = req.body;
  console.log("createMap body: " + JSON.stringify(body));
  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a Map',
    })
  }

  const map = new Map(body);
  console.log("newly created Map: " + map.toString());
  if (!map) {
    return res.status(400).json({ success: false, error: err })
  }

  User.findOne({ _id: req.userId }, (err, user) => {
    console.log("user found: " + JSON.stringify(user));
    user.maps.push(map._id);
    user
      .save()
      .then(() => {
        map
          .save()
          .then(() => {
            return res.status(201).json({
              map: map
            })
          })
          .catch(error => {
            return res.status(400).json({
              errorMessage: 'Map Not Created!'
            })
          })
      });
  })
}

deleteMap = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: 'UNAUTHORIZED'
    })
  }
  console.log("delete Map with id: " + JSON.stringify(req.params.id));
  console.log("delete " + req.params.id);
  Map.findById({ _id: req.params.id }, (err, map) => {
    console.log("Map found: " + JSON.stringify(map));
    if (err) {
      return res.status(404).json({
        errorMessage: 'Map not found!',
      })
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(mapList) {
      User.findOne({ email: mapList.ownerEmail }, (err, user) => {


        console.log("correct user!");
        Map.findOneAndDelete({ _id: req.params.id }, () => {
          return res.status(200).json({});
        }).catch(err => console.log(err))

        console.log("incorrect user!");
        return res.status(400).json({
          errorMessage: "authentication error"
        });

      });
    }
    asyncFindUser(map);
  })
}

getMapById = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: 'UNAUTHORIZED'
    })
  }
  console.log("Find Map with id: " + JSON.stringify(req.params.id));

  await Map.findById({ _id: req.params.id }, (err, list) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    console.log("Found list: " + JSON.stringify(list));

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      await User.findOne({ email: list.ownerEmail }, (err, user) => {
        return res.status(200).json({ success: true, map: list })
      });
    }
    asyncFindUser(list);
  }).catch(err => console.log(err))
}

getMapPairs = async (req, res) => {
  // if (auth.verifyUser(req) === null) {
  //   return res.status(400).json({
  //     errorMessage: 'UNAUTHORIZED'
  //   })
  // }
  console.log("getMapPairs called");
  const email = await User.findOne({ _id: req.userId }).then((data) => {
    if(!data) {
      return res
                        .status(404)
                        .json({ success: false, error: 'User not found not found' })
    }
    return data.email
    // async function asyncFindList(email) {
    //   console.log("find all Maps owned by: " + email);
      
    // }
    // asyncFindList(data.email)
  }).catch((err) => console.log(err))
  console.log(email)
  await Map.find({ ownerEmail: email }).then( (data) => {
    console.log((data));
  //   if (err) {
  //     return res.status(400).json({ success: false, error: err })
  //   }
  //   if (!mapdata) {
  //     console.log("!)maps.length");
  //     return res
  //       .status(404)
  //       .json({ success: false, error: 'Maps not found' })
  //   }
  //   else {
  //     console.log("Send the Maps pairs");
  //     // PUT ALL THE LISTS INTO ID, NAME PAIRS
  //     let pairs = [];
  //     for (let key in mapdata) {
  //       let list = mapdata[key];
  //       let pair = {
  //         _id: list._id,
  //         name: list.name,
  //         ownerEmail: list.ownerEmail,
  //         ownerName: list.ownerName,
  //         data: list.data,
  //         published: list.published,
  //         publishedDate: list.publishedDate,
  //         likes: list.likes,
  //         dislikes: list.dislikes,
  //         views: list.views,
  //         createdAt: list.createdAt,
  //         updatedAt: list.updatedAt,
  //       };
  //       pairs.push(pair);
  //     }
  //     return res.status(200).json({ success: true, idNamePairs: pairs })
  //   }
   }).catch(err => console.log(err))
}

getMaps = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: 'UNAUTHORIZED'
    })
  }
  await Map.find({}, (err, maps) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }
    if (!maps.length) {
      return res
        .status(404)
        .json({ success: false, error: `Maps not found` })
    }
    return res.status(200).json({ success: true, data: maps })
  }).catch(err => console.log(err))
}

getPublishedMaps = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: 'UNAUTHORIZED'
    })
  }
  console.log("getPublishedMaps");
  await User.findOne({ _id: req.userId }, (err, user) => {
    console.log("find user with id " + req.userId);
    async function asyncFindList() {
      await Map.find({ published: true }, (err, maps) => {
        console.log("found Maps: " + JSON.stringify(maps));
        if (err) {
          return res.status(400).json({ success: false, error: err })
        }
        if (!maps) {
          console.log("!maps.length");
          return res
            .status(404)
            .json({ success: false, error: 'Maps not found' })
        }
        else {
          console.log("Send the Published Map pairs");
          // PUT ALL THE LISTS INTO ID, NAME PAIRS
          let pairs = [];
          for (let key in maps) {
            let list = maps[key];
            let pair = {
              _id: list._id,
              name: list.name,
              ownerEmail: list.ownerEmail,
              ownerName: list.ownerName,
              published: list.published,
              publishedDate: list.publishedDate,
              likes: list.likes,
              dislikes: list.dislikes,
              listens: list.listens,
              createdAt: list.createdAt,
              updatedAt: list.updatedAt,
            };
            pairs.push(pair);
          }
          return res.status(200).json({ success: true, idNamePairs: pairs })
        }
      }).catch(err => console.log(err))
    }
    asyncFindList();
  }).catch(err => console.log(err))
}

updateMap = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: 'UNAUTHORIZED'
    })
  }
  const body = req.body
  console.log("updateMap: " + JSON.stringify(body));
  console.log("req.body.name: " + req.body.name);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    })
  }

  Map.findOne({ _id: req.params.id }, (err, map) => {
    console.log("map found: " + JSON.stringify(map));
    if (err) {
      return res.status(404).json({
        err,
        message: 'Map not found!',
      })
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      await User.findOne({ email: list.ownerEmail }, (err, user) => {

        console.log("correct user!");
        console.log("req.body.name: " + req.body.name);

        list.name = body.map.name;
        // list.songs = body.map.songs;
        list.published = body.map.published;
        list.publishedDate = body.map.publishedDate;
        list.likes = body.map.likes;
        list.dislikes = body.map.dislikes;
        list.views = body.map.views;
        list
          .save()
          .then(() => {
            console.log("SUCCESS!!!");
            return res.status(200).json({
              success: true,
              id: list._id,
              message: 'Map updated!',
            })
          })
          .catch(error => {
            console.log("FAILURE: " + JSON.stringify(error));
            return res.status(404).json({
              error,
              message: 'Map not updated!',
            })
          })

      });
    }
    asyncFindUser(map);
  })
}

updateUserFeedback = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: 'UNAUTHORIZED'
    })
  }
  const body = req.body
  console.log("updateMap: " + JSON.stringify(body));
  console.log("req.body.name: " + req.body.name);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    })
  }

  Map.findOne({ _id: req.params.id }, (err, map) => {
    console.log("Map found: " + JSON.stringify(map));
    if (err) {
      return res.status(404).json({
        err,
        message: 'Map not found!',
      })
    }

    map.comments = body.map.comments;
    map.likes = body.map.likes;
    map.dislikes = body.map.dislikes;
    map.listens = body.map.listens;
    map
      .save()
      .then(() => {
        console.log("SUCCESS!!!");
        return res.status(200).json({
          success: true,
          id: map._id,
          message: 'map updated!',
        })
      })
      .catch(error => {
        console.log("FAILURE: " + JSON.stringify(error));
        return res.status(404).json({
          error,
          message: 'map not updated!',
        })
      })
  })
}

module.exports = {
  createMap,
  deleteMap,
  getMapById,
  getMapPairs,
  getMaps,
  updateMap,
  updateUserFeedback,
  getPublishedMaps,
}