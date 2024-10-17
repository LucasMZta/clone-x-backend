import { Router } from 'express'
import * as pingController from '../controllers/ping';
import * as authController from '../controllers/auth';
import * as tweetController from '../controllers/tweet';
import * as userController from '../controllers/user';
import * as feedController from '../controllers/feed';
import * as searchController from '../controllers/search';
import { verifyJWT } from '../utils/jwt';

export const mainRouter = Router();

mainRouter.get('/ping', pingController.ping);
mainRouter.get('/privateping', verifyJWT, pingController.privatePing);

mainRouter.post('/auth/signup', authController.signUp); //tela de cadastro
mainRouter.post('/auth/signin', authController.signIn); //tela de login

mainRouter.post('/tweet', verifyJWT, tweetController.addTweet); //criar um tweet novo
mainRouter.get('/tweet/:id', verifyJWT, tweetController.getTweet); //tweet/123, tweet especifico
mainRouter.get('/tweet/:id/answers', verifyJWT, tweetController.getAnswers) //comentarios do tweet especifico
mainRouter.post('/tweet/:id/like', verifyJWT, tweetController.likeTweetToggle); //dar like ou remover o like

mainRouter.get('/user/:slug', verifyJWT, userController.getUser); //dado do usuario especifico
mainRouter.get('/user/:slug/tweets', verifyJWT, userController.getUserTweets);
mainRouter.post('/user/:slug/follow', verifyJWT, userController.followUserToggle) //seguir ou deixar de seguir o user
mainRouter.put('/user', verifyJWT, userController.updateUser); //editar dados do usuario
// mainRouter.put('/user/avatar'); //editar imagem do usuario
// mainRouter.put('/user/cover'); //editar capa do usuario

mainRouter.get('/feed', verifyJWT, feedController.getFeed);
mainRouter.get('/search', verifyJWT, searchController.searchTweets);
// mainRouter.get('/trending');
// mainRouter.get('/suggestions');

