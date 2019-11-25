// 模型
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/vmag')
const Schema = mongoose.Schema
 , ObjectId = Schema.ObjectId
const itemSchema = new Schema({
  _id          : ObjectId
  , author     : String
  , text       : {type:String,index:true,unique:true}
  , image_url  : String
  , created_at : Date
  , source     : String
  , weibo_id   : String
  , site_id    : String
})
exports.Item = mongoose.model('item', itemSchema)