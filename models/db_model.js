"use strict";
module.exports = function BaseDBModel(connection, table, primary_key, data) {
	this.connection = connection;
	console.log('connection threadId: ' + connection.threadId);
	this.table = table;
	this.primary_key = primary_key;
	this.model = data || {};


	this.insert = function(callback) {
			console.log('BaseDBModel::insert: ', this.model);
			console.log('connection threadId: ' + connection.threadId);

			let _this = this;
			this.validateInsert(this.model, function(err) {
				if (err) {
						return callback(err, null);
				}
				var sql = "INSERT INTO ?? SET ?";
				connection.query(sql, [table, _this.model], function(err, result) {
					if (err) {
						return callback(err, null);
					}

					return callback(err, (1 === result.affectedRows), result);
				});

			});

	};

	this.findByPrimaryKey = function(id, callback) {
		console.log('findByPrimaryKey: ', id);
		console.log('connection threadId: ' + connection.threadId);
		var sql = "SELECT * FROM ?? WHERE ?? = ?";
		this.connection.query(sql, [this.table, this.primary_key, id], function(err, rows) {
			if (err) {
				return callback(err, null);
			}

			return callback(err, (1 === rows.length ? rows[0] : null));
		});
	};

	this.updateByPrimaryKey = function(data, primaryKeyValue, callback) {
		console.log('updateByPrimaryKey: ', primaryKeyValue);
		console.log('connection threadId: ' + connection.threadId);
		var sql = "UPDATE ?? SET ? WHERE ?? = ?";
		connection.query(sql, [table, data, primary_key, primaryKeyValue], function(err, rows) {
			if (err) {
				return callback(err, null);
			}

			return callback(err, (1 === rows.length ? rows[0] : null));
		});
	};

	this.deleteByPrimaryKey = function(primaryKeyValue, callback) {
		console.log('deleteByPrimaryKey: ', primaryKeyValue);
		console.log('connection threadId: ' + connection.threadId);
		var sql = "DELETE FROM ?? WHERE ?? = ?";
		connection.query(sql, [table, primary_key, primaryKeyValue], function(err, result) {
			if (err) {
				return callback(err, null);
			}

			return callback(err, (1 === result.affectedRows), result);
		});
	};

	// this function should be overwritten in the sub-class
	this.validateInsert = function(data, callback) {
		console.log('BaseDBModel::validateInsert: ', data);
		// always succeed.
		callback(null);
	}

};