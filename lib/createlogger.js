/*
 author @Devraj Verma
 developed by @os04
 */

/**
 *  @author:   Devraj Verma
 *  @created:   AUG 2017
 *  @description: Create logger file.
 *  @copyright: (c) Copyright by os04
 *  @Revision 0.1
 *  @Last Updated: Devraj Verma , Aug 11 2017
 **/
var fs = require("fs");
var crypto = require('crypto');
module.exports = class {
    setLogger(token, path, loggerObject) {
        var password = token;
        var loggerObject = JSON.stringify(loggerObject);
        var self = this;
        if (!fs.existsSync("public/" + path)) {
            fs.mkdirSync("public/" + path);
            this.encrypt(loggerObject, password, function (encoded) {
                fs.writeFile("public/" + path + "/logger.dlg", encoded, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            });
        } else {
            this.encrypt(loggerObject, password, function (encoded) {
                fs.appendFile("public/" + path + "/logger.dlg", "\n" + encoded, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            });
        }
    }

    encrypt(input, password, callback) {
        var m = crypto.createHash('md5');
        m.update(password)
        var key = m.digest('hex');

        m = crypto.createHash('md5');
        m.update(password + key)
        var iv = m.digest('hex');

        var data = new Buffer(input, 'utf8').toString('binary');

        var cipher = crypto.createCipheriv('aes-256-cbc', key, iv.slice(0, 16));

        var nodev = process.version.match(/^v(\d+)\.(\d+)/);
        var encrypted;

        if (nodev[1] === '0' && parseInt(nodev[2]) < 10) {
            encrypted = cipher.update(data, 'binary') + cipher.final('binary');
        } else {
            encrypted = cipher.update(data, 'utf8', 'binary') + cipher.final('binary');
        }

        var encoded = new Buffer(encrypted, 'binary').toString('base64');

        callback(encoded);
    }

    decrypt(input, password, callback) {
        // Convert urlsafe base64 to normal base64
        var input = input.replace(/\-/g, '+').replace(/_/g, '/');
        // Convert from base64 to binary string
        var edata = new Buffer(input, 'base64').toString('binary')

        // Create key from password
        var m = crypto.createHash('md5');
        m.update(password)
        var key = m.digest('hex');

        // Create iv from password and key
        m = crypto.createHash('md5');
        m.update(password + key)
        var iv = m.digest('hex');
        var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv.slice(0, 16));
        var nodev = process.version.match(/^v(\d+)\.(\d+)/);
        var decrypted, plaintext;

        if (nodev[1] === '0' && parseInt(nodev[2]) < 10) {
            decrypted = decipher.update(edata, 'binary') + decipher.final('binary');
            plaintext = new Buffer(decrypted, 'binary').toString('utf8');
        } else {
            plaintext = (decipher.update(edata, 'binary', 'utf8') + decipher.final('utf8'));
        }
        callback(plaintext);
    }

    getLogger(path, password, callback) {
        var contents = fs.readFileSync("public/" + path + "/logger.dlg", 'utf8');
        var listOfLog = contents.split("\n");
        var dataList = [];
        for (var i = 0; i < listOfLog.length; i++) {
            this.decrypt(listOfLog[i], password, (data) => {
                dataList.push(JSON.parse(data));
            });
        }
        callback(dataList);
    }

};






