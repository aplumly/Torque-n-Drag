const db = require("../models");

// Defining methods for the db Controller
module.exports = {
  findAllByUser: function(req, res) {
    db.User.findById(req.params.userId)
      .populate("well")
      // .sort({ lastName: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  user: {
    findAll: function(req, res) {
      db.User.find(req.query)
        // .sort({ lastName: -1 })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    findById: function(req, res) {
      db.User.findById(req.params.id)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    create: function(req, res) {
      db.User.create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    update: function(req, res) {
      db.User.findOneAndUpdate({ _id: req.params.id }, req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    remove: function(req, res) {
      db.User.findById({ _id: req.params.id })
        .then(dbModel => dbModel.remove())
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }
  },
  well: {
    findAll: function(req, res) {
      db.Well.find(req.query)
        .sort({ wellName: -1 })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    findById: function(req, res) {
      db.Well.findById(req.params.id)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    create: function(req, res) {
      console.log(JSON.stringify(req.body.wellData));
      db.Well.create(req.body.wellData)
        .then(function(dbWell) {
         return db.User.findOneAndUpdate(
            {
              uid: req.body.userId
            },
            {
              $push: { well: dbWell._id }
            },
            { new: true }
          );
        })
        .then(dbModel => res.json(dbModel))
        .catch(err => {res.status(422).json(err);console.log(err)});
    },
    update: function(req, res) {
      db.Well.findOneAndUpdate({ _id: req.params.id }, req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    remove: function(req, res) {
      db.Well.findById({ _id: req.params.id })
        .then(dbModel => dbModel.remove())
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }
  },
  survey: {
    findAll: function(req, res) {
      db.Survey.find(req.query)
        .sort({ _id: -1 })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    findById: function(req, res) {
      db.Survey.findById(req.params.id)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    create: function(req, res) {
      db.Survey.create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    update: function(req, res) {
      db.Survey.findOneAndUpdate({ _id: req.params.id }, req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    remove: function(req, res) {
      db.Survey.findById({ _id: req.params.id })
        .then(dbModel => dbModel.remove())
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }
  },
  userAndWells: {
    findByUid: function(req,res){
      //console.log(JSON.stringify(req.body.uid)+"you hit the right one at least")
      db.User.findOne({'uid':req.body.uid},function(error,dbuser){
        let userData=dbuser;
        //console.log(dbuser)
        if(dbuser===null||dbuser===undefined)
        {
          return res.json({userData:'error creating user or user does not exist',wellData:[{wellName:'no data'}]})
        }
        if(userData.well.length>0)
        {
                  db.Well.find({
          '_id': { $in: userData.well}
      }, function(err, docs){
           res.json({userData:userData,wellData:docs})
      });
        }else{
          res.json({userData:userData,wellData:[{wellName:'no data'}]})
        }

      }).catch(err=> res.status(422).json(err));

    }
  }
};
