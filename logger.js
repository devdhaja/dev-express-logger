/*
 author @Devraj Verma
 developed by @os04
 */

/**
 *  @author:   Devraj Verma
 *  @created:   AUG 2017
 *  @description: Main module for logger lib.
 *  @copyright: (c) Copyright by os04
 *  @Revision 0.1
 *  @Last Updated: Devraj Verma , Aug 11 2017
 **/


module.exports = class {

    /**
     * @desciption Constructor function that initialize this module and load required module
     */
    constructor() {
        var setLogger = require("lib/createlogger");
        this.loggerApp = new setLogger();
        this.setToken();
        this.setLoggerPath();
    }

    /**
     * 
     * @param {String} hash
     * @description set scret token for logger incryption 
     */
    setToken(token = "my-dev-logger-token") {
        this.token = token;
    }
    
    /**
     * @param {String} path 
     */
    setLoggerPath(path = ""){
        if(path === "")
            path = "logger"; 
        this.path = path;
    }

    /**
     * @argument {Object} req 
     * @description This function set logger to our file
     */
    setLogger(req) {
        let loggerObject = {};
        loggerObject.url = req.protocol + '://' + req.get('host') + req.originalUrl;
        loggerObject.params = req.params;
        loggerObject.body = req.body;
        loggerObject.date = new Date();
        loggerObject.timeStamp = +new Date;
        loggerObject.userIp = req.connection.remoteAddress;
        loggerObject.token = this.token;
        this.loggerApp.setLogger(this.token,this.path,loggerObject);
    }
    
    getLogger(callback) {
        this.loggerApp.getLogger(this.path,this.token,(data)=>{
            callback(data);
        });
    }

};

