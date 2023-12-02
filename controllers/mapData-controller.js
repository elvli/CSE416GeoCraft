const MapData = require('../models/mapData-model')
const User = require('../models/user-model');
const auth = require('../auth')

createMapData = (req, res) => {
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

  const mapData = new MapData(body);
  console.log("newly created MapData: " + mapData.toString());
  if (!mapData) {
    return res.status(400).json({ success: false, error: err })
  }

  User.findOne({ _id: req.userId }).then((user) => {
        mapData
          .save()
          .then(() => {
            return res.status(201).json({
                mapData: mapData
            })
          })
          .catch(error => {
            return res.status(400).json({
              errorMessage: 'Map Data Not Created!'
            })
          })
      });
  }

deleteMapData = (req,res) => {
    try {
        console.log(req.params)
        MapData.deleteOne( { mapID: req.params.id } ).then( () => {
        return res.status(200).json({success: true, data: {}});
      }).catch(err => console.log(err))
    }
    catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }
}

updateMapData = async (req, res) => {
  try {
    const user = auth.verifyUser(req);

    if (!user) {
      return res.status(401).json({
        errorMessage: 'UNAUTHORIZED'
      });
    }

    const body = req.body.map;
    //req.body.mapData
    console.log(req.params.id)

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a body to update',
      });
    }

    // Use async/await with findOneAndUpdate
    const updatedMap = await Map.findOneAndUpdate(
      { mapID: req.params.id },
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

getMapDataById = async (req, res) => {
  try {
    MapData.findOne( { mapID: req.params.id } ).then( (mapData) => {
    return res.status(200).json({success: true, mapData: mapData});
  }).catch(err => console.log(err))
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};

  module.exports = {
    createMapData,
    deleteMapData,
    updateMapData,
    getMapDataById,
  }
