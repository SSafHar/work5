import { Component, OnInit } from '@angular/core';
// import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { PlansService } from './plans.service';
import { CardDetails, Plans } from './plans.model';
import { Plan } from '../../shared/models/plan.model';
import { NotifierService } from '../../shared/services/notifier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'plans',
  providers: [],
  templateUrl: './plans.component.html',
})

export class PlansComponent implements OnInit {
  public busy: boolean = true;
  public plans: Plans[] = [];
  public selectedPlan: Plan = null;
  public cardDetails = {} as CardDetails;
  public months = [
    {
      name: '01',
      id: '01'
    },
    {
      name: '02',
      id: '02'
    },
    {
      name: '03',
      id: '03'
    },
    {
      name: '04',
      id: '04'
    },
    {
      name: '05',
      id: '05'
    },
    {
      name: '06',
      id: '06'
    },
    {
      name: '07',
      id: '07'
    },
    {
      name: '08',
      id: '08'
    },
    {
      name: '09',
      id: '09'
    },
    {
      name: '10',
      id: '10'
    },
    {
      name: '11',
      id: '11'
    },
    {
      name: '12',
      id: '12'
    },
  ];
  public currentYear = (('' + (new Date()).getFullYear()).slice(-2));

  private returnUrl = '';

  constructor(public plansService: PlansService, public notifier: NotifierService, public route: ActivatedRoute, private router: Router, private authService: AuthService) {
  }

  public ngOnInit() {
    const selectedPlanStr = localStorage.getItem('selectedPlan');
    if (selectedPlanStr && this.authService.loggedIn()) {
      localStorage.setItem('selectedPlan', '');
      this.selectedPlan = JSON.parse(selectedPlanStr);
    }

    this.getPlansData();
    this.route.params.subscribe((params) => {
      this.returnUrl = params.returnUrl;
    });

    this.busy = false;
  }

  public getPlansData() {
    this.plansService.getPlans()
      .subscribe((data) => {
        return this.plans = data.data;
      });
  }

  public selectPlan(plan) {
    if (this.authService.loggedIn()) {
      this.selectedPlan = plan;
      return;
    } else {
      localStorage.setItem('selectedPlan', JSON.stringify(plan));
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }
  }

  public checkout() {
    this.busy = true;

    this.plansService.openCheckout(this.cardDetails, this.selectedPlan.id)
      .subscribe((response) => {
        this.busy = false;
        this.notifier.showSuccess(response.json().messages);
        this.navigateBack();
      }, (error) => {
        this.busy = false;
        this.notifier.showError(error.message);
      });
  }

  public addSpace(ev) {
    const target = ev.currentTarget;
    let length = target.value.length;
    if (length === 4 || length === 9 || length === 14) {
      target.value += ' ';
    }
  }
  public setExpMonth(ev) {
    this.cardDetails.expMonth = ev.id;
  }

  public navigateBack() {
    if (!this.returnUrl) {
      return;
    }

    this.router.navigateByUrl(this.returnUrl);
  }
}
