import Router from './router';
import { didService } from '../services';
import MongooseDAO from '../model/dao';

export default class APIRouter extends Router {

	init() {
		const dao = new MongooseDAO();

		this.get( '/did/:did', req => {
			return didService.resolve( req.params.did )
		} );

		this.get( '/vc/:did', req => {
			return dao.getVCs( req.params.did.toLowerCase() );
		} );

		this.post( '/vc', async req => {
			const { subject, data } = req.body;
			await dao.addVC( subject, data );
			return true;
		} );
	}
}