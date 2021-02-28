module.exports.configure = (mongoose) => {
    let url = 'mongodb://localhost:27017/OurProject';
    let connect = function () {
        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    }
    connect();
    let db = mongoose.connection;
    db.once('open', () => { console.log('Connected to db'); })
    db.on('disconnected', connect)
    db.on('error', console.log)

};