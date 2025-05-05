import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  import { Chart } from 'chart.js';
  import { PieController, ArcElement, Tooltip, Legend } from 'chart.js';
  
  Chart.register(PieController, ArcElement, Tooltip, Legend);
  