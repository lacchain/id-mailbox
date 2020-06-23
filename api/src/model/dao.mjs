import mongoose from "mongoose";
import userModel from "./user.mjs";

export default class MongoDAO {

	constructor() {
		mongoose.connect( process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true } );

		const userSchema = mongoose.Schema( userModel );

		this.models = {
			'user': mongoose.model( 'user', userSchema )
		};
	}

	async addVC( did, vc ) {
		let user = await this.models['user'].findOne( { did } );
		if( !user ) {
			user = new this.models['user']( {
				did,
				vcs: [vc]
			} )
		} else {
			user.vcs.push( vc );
		}
		return user.save();
	}

	async getVCs( did ) {
		const user = await this.models['user'].findOne( { did } );
		if( !user ) return [];

		return user.vcs.toObject();
	}

}