import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { NotifierService } from '../../services/notifier.service';

declare const flowplayer: any; // for using global flowplayer
declare const $: any; // for using global jQuery

@Component({
  selector: 'flowplayer',
  templateUrl: './flowplayer.component.html'
})
export class FlowplayerComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input('source') public source;
  @HostBinding('class') public classes = 'fp-full fp-edgy fp-outlined';
  public $player: any;
  public isPremium: boolean = false;
  public minutesLeft: number = 0;
  public playStart: number = 0;
  public elapsedSecs: number = 0;

  constructor(private el: ElementRef, public authService: AuthService, public notifier: NotifierService) {
  }

  public ngOnInit() {
    this.isPremium = this.authService.isPremium();
    this.minutesLeft = this.authService.minutes();
  }
  public ngOnChanges(changes) {
    if (!this.source || !changes.source || !this.$player) {
      return;
    }
    this.$player.load(this.source);
  }

  public ngAfterViewChecked() {
    const {source} = this;
    if (source && !this.$player) {
      const player = this.$player = flowplayer(this.el.nativeElement,
        {
          clip: {
            sources: [{type: 'application/dash+xml', src: `http://${source.slice(7)}/manifest.mpd`}]
          }
        }
        );

      this.el.nativeElement.querySelector('.fp-controls').insertAdjacentHTML('beforeend', `<a class='fp-fullscreen fp-icon'></a>`);
      player.on('beforeseek', (ev, flowPlayer, seekTime) => this._seekHandler(ev, flowPlayer, seekTime));
      player.on('progress', (ev, flowPlayer, time) => this._progressHandler(ev, flowPlayer, time));
    }
  }

  public trackByFn(i) {
    return i;
  }

  public play() {
    this.$player.play();
  }

  private _progressHandler(ev, player, time) {
    if (this.isPremium) {
      return;
    }

    // todo: fix this later.
    $('.fp-message', this.el.nativeElement).remove();

    this._updateSecs(time);
    if (!this.minutesLeft && time > 20 * 60) {
      player.pause();
      player.message('Hey Sorry ! Looks like your 20 minutes is up - to continue using our service please sign up and support our cause ! Click on Premium in the Menu , create an account\n' +
        'and JOIN US ! we will be adding artifical inteligence, machine learning tools and tons of other fun stuff fo your viewing pleasure');
    }
  }
  private _seekHandler(ev, player, seekTime) {
    this.playStart = seekTime;
  }

  private _updateSecs(secs) {
    const elapsed = this.elapsedSecs += secs - this.playStart;
    this.playStart = secs;
    if (elapsed > 60) {
      this.elapsedSecs -= 60;
      this.authService.updateMinutes()
        .subscribe(
        () => this._updateMinutesLeft(),
        (error) => this.notifier.showError(error)
        );
    }
  }

  private _updateMinutesLeft() {
    this.authService.getFreeMinutes()
      .subscribe(
      (data) => this.minutesLeft = data.free_minutes,
      (error) => this.notifier.showError(error)
      );
  }

}
