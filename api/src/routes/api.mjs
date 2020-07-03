import Router from './router';
import { didService } from '../services';
import MongooseDAO from '../model/dao';
import randomstring from 'randomstring';
import { verify } from "../utils/sign";
import { promisify } from "util";
import redis from "redis";

export default class APIRouter extends Router {

	init() {
		const redisClient = redis.createClient( {
			host: 'localhost',
			port: 6379,
			db: 1
		} );
		const set = promisify( redisClient.setex ).bind( redisClient );
		const get = promisify( redisClient.get ).bind( redisClient );

		const dao = new MongooseDAO();

		this.get( '/did/:did', req => {
			return didService.resolve( req.params.did )
		} );

		this.get( '/auth/:did', async req => {
			const { did } = req.params;
			const challenge = randomstring.generate();
			await set( did, 60 * 60 * 24, challenge );
			return { challenge };
		} );

		this.get( '/vc/:did', async req => {
			const { did } = req.params;

			const { signature } = req.headers;
			const challenge = await get( did.toLowerCase() );
			const address = verify( signature, challenge );
			if( !did.toLowerCase().endsWith( address ) ) {
				throw new Error( "Invalid signature" );
			}

			return dao.getVCs( did.toLowerCase() );
		} );

		this.post( '/vc', async req => {
			const { from, to, vc } = req.body;

			const { signature } = req.headers;
			const challenge = await get(from.toLowerCase());
			const address = verify( signature, challenge );
			if( !from.toLowerCase().endsWith( address ) ) {
				throw new Error( "Invalid signature" );
			}

			await dao.addVC( to, vc );
			return true;
		} );
	}
}