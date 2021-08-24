import { Controller, Get, Post, Render,Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as admin from 'firebase-admin'
import * as serviceAccount from "./firestore-test-18de9-firebase-adminsdk-bjyxb-acd9ad198c.json"
import * as dotenv from 'dotenv'
import { request, response } from 'express';
import { resolveSoa } from 'dns';
import * as csrf from 'csurf'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'

const csrfMiddleware=csrf({cookie: true})
dotenv.config({ path: 'C:/firestore-test/firestore-test/src/url.env'})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: process.env.database_url
  });


@Controller()
export class AppController {
  [x: string]: any;
  constructor(private readonly appService: AppService) {}
  //@Render('login.html')
  @Get('user/login')
  login(@Req() request,@Res() response) {
    response.sendFile('C:/nest-firebase-auth/firebase-auth/src/login.html')
  }
  @Get('user/profile')
  getProfile(@Req() request,@Res() response) {
      const sessionCookie=request.cookies.session || ''
      try{
      admin.auth().verifySessionCookie(sessionCookie).then((user)=>{
      response.send(user)
    })
    }
    catch(error) {
      response.send('/user/login')
    }
  }
  @Post('user/signup')
  createUser(@Req() request,@Res() response) {
    const {email,password,displayName}=request.body
    admin.auth().createUser({
      email: email,
      password:password,
      displayName: displayName
    }).then(()=>{
      response.send('ok')
    })
  }
  @Post('user/login')
  async getHi(@Req() request,@Res() response){
    console.log(123)
    const idToken=request.body.idToken.toString()
    const expiresIn=60*60*24*14*1000
    try{
      admin.auth().createSessionCookie(idToken,{expiresIn}).then((sessionCookie)=>{        
      response.cookie('session',sessionCookie).json({status:'sucess'})
    })}
    catch(e) {
      response.status(401).redirect('/user/login')
      console.error(e)
    }
  }
  @Post('user/logout')
  logOut(@Req() request,@Res() response){
      console.log(1)
      response.clearCookie('session')
      response.redirect('/user/login')
    }
  }

