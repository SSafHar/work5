import { Component, OnInit } from '@angular/core';
import { Faq } from './faq.model';
import { FaqService } from './faq.service';

@Component({
  selector: 'faq',
  providers: [],
  templateUrl: './faq.component.html'
})

export class FaqComponent implements OnInit {
  public busy: boolean = true;
  public faq: Faq[];

  constructor(public faqService: FaqService) {
  }

  public ngOnInit() {
    this.getFaqData();
  }

  public getFaqData() {
    this.faqService.getFAQ()
      .subscribe((data) => {
        this.busy = false;
        return this.faq = data.data;
      });
  }
}
