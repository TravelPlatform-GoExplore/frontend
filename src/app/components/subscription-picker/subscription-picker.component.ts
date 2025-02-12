import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiHint } from '@taiga-ui/core';
import { TuiIcon } from '@taiga-ui/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { SubscriptionService } from '../../services/subscription/subscription.service';
import { Router } from '@angular/router';

interface PlanFeature {
  text: string;
  tooltip?: string;
}

interface SubscriptionPlan {
  name: string;
  description: string;
  price: number;
  isPopular?: boolean;
  features: PlanFeature[];
  value: string;
}

@Component({
  selector: 'app-subscription-picker',
  templateUrl: './subscription-picker.component.html',
  styleUrls: ['./subscription-picker.component.css'],
  standalone: true,
  imports: [CommonModule, TuiButton, TuiHint, TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('hintAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', [
        animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),
      transition('* => void', [
        animate('50ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class SubscriptionPickerComponent implements OnInit{
  constructor(private subscriptionService: SubscriptionService, private cdr: ChangeDetectorRef, private router: Router){}

  currentPlan: string | null = null;
  isLoading = false;


  plans: SubscriptionPlan[] = [
    {
      name: 'Uno',
      description: 'Basic access to explore features',
      price: 6,
      features: [
        { text: '1 destination / month' },
        { text: 'Basic support', tooltip: 'Email support with 24h response time' },
        { text: 'Community access' },
      ],
      value: 'Uno',
    },
    {
      name: 'Dos',
      description: 'For individual explorers',
      price: 10,
      isPopular: true,
      features: [
        { text: '2 destinations / month' },
        { text: 'Priority support', tooltip: 'Email support with 4h response time' },
        { text: 'Offline maps' },
      ],
      value: 'Dos',
    },
    {
      name: 'Digital Nomad',
      description: 'For frequent travellers',
      price: 30,
      features: [
        { text: 'Unlimited destinations / month' },
        { text: 'Collaborative tools' },
        { text: 'Custom itineraries' },
      ],
      value: 'Digital Nomad',
    },
  ];

  async onChoosePlan(plan: SubscriptionPlan) {
    await this.subscriptionService.subscribe(plan.value);
    // this.checkCurrentSubscriptionStatus();
    this.router.navigateByUrl('/')
  }

  async checkCurrentSubscriptionStatus() {
    try {
      this.isLoading = true;
      const res = await this.subscriptionService.checkCurrentSubscription();
      this.currentPlan = res?.subscription?.subscriptionType || null;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      this.currentPlan = null;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    this.checkCurrentSubscriptionStatus();
  }
}