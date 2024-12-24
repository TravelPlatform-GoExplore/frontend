import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { RouterModule, RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule,
        FormsModule,
        GoogleMapsModule,
        TuiRoot
    ],
    providers: [],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() {}

  ngOnInit(): void {
  }
}
