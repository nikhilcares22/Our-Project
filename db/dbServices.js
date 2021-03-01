
module.exports = {
    checkExisting: function (model, qry, message = "") {
        return new Promise(async (resolve, reject) => {
            try {
                let foundUser = await model.findOne(qry)
                if (foundUser) return reject({ error: `${constants.USEREXIST} ${message}`, statusCode: 409 })
                resolve(true)
            } catch (error) {
                console.log(error)
                return reject(error)
            }
        })
    },
    checkIfExisting: function (model, qry, message = "") {
        return new Promise(async (resolve, reject) => {
            try {
                let foundUser = await model.findOne(qry)
                if (!foundUser) return reject({ error: `${constants.USERNOTEXIST} ${message}`, statusCode: 409 })
                resolve(foundUser)
            } catch (error) {
                console.log(error)
                return reject(error)
            }
        })
    },

}