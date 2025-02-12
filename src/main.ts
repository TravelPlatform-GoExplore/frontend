// src/main.ts
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import * as dotenv from 'dotenv';

// This function will manually configure HTTP interceptors
bootstrapApplication(AppComponent, appConfig)
.catch((err) => {console.error(err)});