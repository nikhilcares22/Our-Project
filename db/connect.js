module.exports.configure = (mongoose) => {
    let p = process.argv.find(e => !isNaN(e)) || 27017
    console.log('MONGOPORT== ', p);
    let url = `mongodb://localhost:${p}/OurProject`;
    let connect = function () {
        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    }
    connect();
    let db = mongoose.connection;
    db.once('open', () => { console.log('Connected to db'); })
    db.on('disconnected', connect)
    db.on('error', console.log)

};