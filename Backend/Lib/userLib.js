var model=require("../Model/userModel");

module.exports={
    createUser: function(userObj){
        var user=new model(userObj);
        user.save();
    },
    getAllUsers: function(cb){
        model.find({},function(err,result){
            cb(err,result);
        });
    },
    getSingleItemByQuery: function(query, model, cb){
        //console.log('Getting Single item with Query '+JSON.stringify(query));
        model.findOne(query, function (err, singleItem) {
            if(err)
                console.log("ERROR: "+err);
            cb(err, singleItem);
        });
    },
    getItemById: function(id, model, cb){
        //console.log('Getting Single item with ID '+id);
        model.findById(id, function (err, singleDBItem) {
            cb(err, singleDBItem);
        });
    },
    getItemByQuery: function(query, model, cb){
        //console.log('Getting item with Query '+JSON.stringify(query));
        model.find(query, function (err, allDBItems) {
            if(err)
                console.log("ERROR: "+err);
            cb(err, allDBItems);
        });
    },
    deleteItem: function (id, softDelete, itemModel, cb) {
        console.log('Delete Resource ' + id);
        cb(null, null); // Disabled Delete
    }
}