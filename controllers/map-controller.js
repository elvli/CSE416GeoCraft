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
  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a Map',
    })
  }

  const map = new Map(body);

  if (!map) {
    return res.status(400).json({ success: false, error: err })
  }

  User.findOne({ _id: req.userId }).then((user) => {
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

  Map.findById({ _id: req.params.id }).then((map) => {
    if (!map) {
      return res.status(404).json({
        errorMessage: 'Map not found!',
      })
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(mapList) {
      try {
        const user = User.findOne({ email: mapList.ownerEmail })

        if (!user) {
          return res.status(404).json({
            errorMessage: 'User was not found',
          })
        }

        Map.deleteOne({ _id: req.params.id }).then(() => {
          return res.status(200).json({ success: true, data: {} });
        }).catch(err => console.log(err))

      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error'
        });
      }

    }
    asyncFindUser(map);
  })
}

getMapById = async (req, res) => {
  try {
    const map = await Map.findById(req.params.id);

    if (!map) {
      return res.status(404).json({
        success: false,
        error: 'Map not found'
      });
    }

    return res.status(200).json({
      success: true,
      map: map
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};

getMapPairs = async (req, res) => {
  Map.find({}).then((data) => {
    return res.status(200).json({ success: true, idNamePairs: data })
  }).catch(err => console.log(err))
}

updateMultipleMaps = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: 'UNAUTHORIZED'
    })
  }

  try {
    const body = req.body.data;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a body to update',
      });
    }

    const result = await Map.updateMany({ ownerName: body.current }, { $set: { ownerName: body.username, ownerEmail: body.email } })

    return res.status(200).json({ success: true, data: result.modifiedCount })
  } catch {
    console.dir
  }

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

  await User.findOne({ _id: req.userId }, (err, user) => {
    async function asyncFindList() {
      await Map.find({ published: true }, (err, maps) => {
        if (err) {
          return res.status(400).json({ success: false, error: err })
        }

        if (!maps) {
          return res
            .status(404)
            .json({ success: false, error: 'Maps not found' })
        }

        else {
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

updateMapById = async (req, res) => {
  try {
    const user = auth.verifyUser(req);

    if (!user) {
      return res.status(401).json({
        errorMessage: 'UNAUTHORIZED'
      });
    }

    const body = req.body.map;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a body to update',
      });
    }

    const updatedMap = await Map.findOneAndUpdate(
      { _id: req.params.id },
      body,
      { new: true, runValidators: true }
    );

    if (!updatedMap) {
      return res.status(404).json({
        success: false,
        error: 'Map not found!',
      });
    }

    return res.status(200).json({
      success: true,
      map: updatedMap,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};


updateUserFeedback = async (req, res) => {
  try {
    const user = auth.verifyUser(req);

    if (!user) {
      return res.status(401).json({
        errorMessage: 'UNAUTHORIZED'
      });
    }
    const body = req.body.map;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a body to update',
      });
    }

    const updatedMap = await Map.findByIdAndUpdate(
      req.params.id,
      {
        comments: body.comments,
        likes: body.likes,
        dislikes: body.dislikes,
        listens: body.listens,
      },
      { new: true, runValidators: true }
    );

    if (!updatedMap) {
      return res.status(404).json({
        success: false,
        error: 'Map not found!',
      });
    }

    return res.status(200).json({
      success: true,
      map: updatedMap,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};


module.exports = {
  createMap,
  deleteMap,
  getMapById,
  getMapPairs,
  getMaps,
  updateMapById,
  updateUserFeedback,
  getPublishedMaps,
  updateMultipleMaps,
}