import express from 'express';
import http from 'http';
import cors from 'cors';
import APIRouter from "./routes/api";

const app = express();
const apiRouter = new APIRouter();

app.use( cors() );
app.use( express.json( { limit: '50mb' } ) );
app.use( express.urlencoded( { extended: false } ) );

app.use( function( req, res, next ) {
	res.setHeader( 'Strict-Transport-Security', 'max-age=15724800; includeSubDomains' );
	next();
} );

app.use( '/', apiRouter.getRouter() );

const server = http.createServer( app );

server.listen( process.env.API_PORT, function() {
	console.log( 'LACChain ID | API Server v1.0 on port', process.env.API_PORT );
} );