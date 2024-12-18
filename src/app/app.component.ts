import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from "@angular/common";
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [CommonModule, FormsModule, RouterOutlet, RouterModule],
    providers: [],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() {}

  ngOnInit(): void {
  }
}
