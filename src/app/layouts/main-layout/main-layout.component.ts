import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { SubscriptionService } from '../../services/subscription/subscription.service';
import { CommonModule } from '@angular/common';
import { SubscriptionPickerComponent } from "../../components/subscription-picker/subscription-picker.component";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [RouterModule, HeaderComponent, CommonModule, SubscriptionPickerComponent],

})
export class MainLayoutComponent implements OnInit {
  constructor(private subscriptionService: SubscriptionService, private router: Router) { }
  
  isSubscribed: boolean = false;
  
  ngOnInit(): void {
    this.checkUserSubscriptionStatus();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.checkUserSubscriptionStatus();
      }
    });
  }

  async checkUserSubscriptionStatus() {
    const res = await this.subscriptionService.checkCurrentSubscription();
    this.isSubscribed = !!res.subscription;
    console.log("🚀 ~ MainLayoutComponent ~ checkUserSubscriptionStatus ~ isSubscribed:", this.isSubscribed)
  }
}
